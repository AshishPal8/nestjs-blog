import { Injectable } from "@nestjs/common";
import { CreatePostDto, createPostSchema } from "./dto/create-post.input";
import { SlugUtil } from "@common/utils/slug.util";
import { db } from "@database/db";
import { posts } from "@database/schema/posts.schema";
import { and, count, desc, eq, ilike, inArray } from "drizzle-orm";
import { tags } from "@database/schema/tags.schema";
import { postTags } from "@database/schema/post-tags.schema";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@common/responses/custom-response";
import { uploads } from "@database/schema/uploads.schema";
import { categories } from "@database/schema/categories.schema";
import { postCategories } from "@database/schema/post-categories";
import { PaginationDto, paginationSchema } from "@common/dto/pagination.input";
import { UpdatePostDto, updatePostSchema } from "./dto/update-post-input";

@Injectable()
export class PostsService {
  async create(input: CreatePostDto, authorId: number) {
    const validated = createPostSchema.parse(input);

    const slug = SlugUtil.generate(validated.title);

    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (existingPost) {
      throw new ConflictError(`Post with slug "${slug}" already exists`);
    }

    if (validated.imageIds && validated.imageIds.length > 0) {
      const uploadList = await db
        .select()
        .from(uploads)
        .where(
          and(
            inArray(uploads.id, validated.imageIds),
            eq(uploads.uploadBy, authorId),
          ),
        );

      if (uploadList.length !== validated.imageIds.length) {
        throw new BadRequestError(
          "Some image IDs are invalid or not owned by you",
        );
      }
    }

    if (validated.categoryIds && validated.categoryIds.length > 0) {
      const categoryList = await db
        .select()
        .from(categories)
        .where(
          and(
            inArray(categories.id, validated.categoryIds),
            eq(categories.isDeleted, false),
          ),
        );

      if (categoryList.length !== validated.categoryIds.length) {
        throw new BadRequestError("Some category IDs are invalid");
      }
    }

    const [post] = await db
      .insert(posts)
      .values({
        title: validated.title,
        slug,
        description: validated.description,
        metaDescription: validated.metaDescription,
        imageIds: validated.imageIds,
        authorId,
      })
      .returning();

    if (validated.tags && validated.tags.length > 0) {
      const tagIds = await this.findOrCreateTags(validated.tags);

      await db.insert(postTags).values(
        tagIds.map((tagId) => ({
          postId: post.id,
          tagId: tagId,
        })),
      );
    }

    if (validated.categoryIds && validated.categoryIds.length > 0) {
      await db.insert(postCategories).values(
        validated.categoryIds.map((categoryId) => ({
          postId: post.id,
          categoryId: categoryId,
        })),
      );
    }

    return this.getPostWithRelations(post.id);
  }

  async update(id: number, input: UpdatePostDto, userId: number) {
    const validated = updatePostSchema.parse(input);

    const [existingPost] = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.id, id),
          eq(posts.authorId, userId),
          eq(posts.isDeleted, false),
        ),
      )
      .limit(1);

    if (!existingPost) {
      throw new NotFoundError("Post not found");
    }

    if (existingPost.authorId !== userId) {
      throw new ForbiddenError("You can only edit your own posts");
    }

    if (validated.title) {
      const newSlug = SlugUtil.generate(validated.title);

      if (newSlug !== existingPost.slug) {
        const [slugConflict] = await db
          .select()
          .from(posts)
          .where(eq(posts.slug, newSlug))
          .limit(1);

        if (slugConflict) {
          throw new ConflictError(`Post with slug "${newSlug}" already exists`);
        }
      }
    }

    if (validated.imageIds && validated.imageIds.length > 0) {
      const uploadList = await db
        .select()
        .from(uploads)
        .where(
          and(
            inArray(uploads.id, validated.imageIds),
            eq(uploads.uploadBy, userId),
          ),
        );

      if (uploadList.length !== validated.imageIds.length) {
        throw new BadRequestError(
          "Some image IDs are invalid or not owned by you",
        );
      }
    }

    if (validated.categoryIds && validated.categoryIds.length > 0) {
      const categoryList = await db
        .select()
        .from(categories)
        .where(
          and(
            inArray(categories.id, validated.categoryIds),
            eq(categories.isDeleted, false),
          ),
        );

      if (categoryList.length !== validated.categoryIds.length) {
        throw new BadRequestError("Some category IDs are invalid");
      }
    }

    const updateData: any = {};

    if (validated.title) {
      updateData.title = validated.title;
      updateData.slug = SlugUtil.generate(validated.title);
    }

    if (validated.description) {
      updateData.description = validated.description;
    }

    if (validated.metaDescription) {
      updateData.metaDescription = validated.metaDescription;
    }

    if (validated.imageIds) {
      updateData.imageIds = validated.imageIds;
    }

    if (validated.isActive !== undefined) {
      updateData.isActive = validated.isActive;
    }

    updateData.updatedAt = new Date();

    const [updatedPost] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    if (validated.tags !== undefined) {
      await db.delete(postTags).where(eq(postTags.postId, id));

      if (validated.tags.length > 0) {
        const tagIds = await this.findOrCreateTags(validated.tags);
        await db.insert(postTags).values(
          tagIds.map((tagId) => ({
            postId: id,
            tagId: tagId,
          })),
        );
      }
    }

    if (validated.categoryIds !== undefined) {
      await db.delete(postCategories).where(eq(postCategories.postId, id));

      if (validated.categoryIds.length > 0) {
        await db.insert(postCategories).values(
          validated.categoryIds.map((categoryId) => ({
            postId: id,
            categoryId: categoryId,
          })),
        );
      }
    }

    return this.getPostWithRelations(updatedPost.id);
  }

  async delete(id: number, userId: number) {
    const [post] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, id), eq(posts.isDeleted, false)))
      .limit(1);

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (post.authorId !== userId) {
      throw new ForbiddenError("You can only delete your own posts");
    }

    await db
      .update(posts)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id));

    return { success: true, message: "Post deleted successfully" };
  }

  async findAll(pagination: PaginationDto) {
    const validated = paginationSchema.parse(pagination);
    const { page, limit, search, isActive } = validated;

    const offset = (page - 1) * limit;

    const filters = [eq(posts.isDeleted, false)];

    if (search) {
      filters.push(ilike(posts.title, `%${search}%`));
    }

    if (isActive !== undefined) {
      filters.push(eq(posts.isActive, isActive));
    }

    const whereClause = and(...filters);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(posts)
      .where(whereClause);

    const postsList = await db
      .select()
      .from(posts)
      .where(whereClause)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    const postsWithRelations = await Promise.all(
      postsList.map((post) => this.getPostWithRelations(post.id)),
    );

    return {
      data: postsWithRelations,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findByAuthor(authorId: number, pagination: PaginationDto) {
    const validated = paginationSchema.parse(pagination);
    const { page, limit, search } = validated;

    const offset = (page - 1) * limit;

    const filters = [eq(posts.isDeleted, false), eq(posts.authorId, authorId)];

    if (search) {
      filters.push(ilike(posts.title, `%${search}%`));
    }

    const whereClause = and(...filters);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(posts)
      .where(whereClause);

    const postsList = await db
      .select()
      .from(posts)
      .where(whereClause)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    const postsWithRelations = await Promise.all(
      postsList.map((post) => this.getPostWithRelations(post.id)),
    );

    return {
      data: postsWithRelations,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: number) {
    const [post] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, id), eq(posts.isDeleted, false)))
      .limit(1);

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    return this.getPostWithRelations(post.id);
  }

  async findBySlug(slug: string) {
    const [post] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.isDeleted, false)))
      .limit(1);

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    return this.getPostWithRelations(post.id);
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  private async getPostWithRelations(postId: number) {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    let images = [];

    if (post.imageIds && post.imageIds.length > 0) {
      images = await db
        .select()
        .from(uploads)
        .where(inArray(uploads.id, post.imageIds));
    }

    const postTagsList = await db
      .select({ tagId: postTags.tagId })
      .from(postTags)
      .where(eq(postTags.postId, postId));

    const tagIds = postTagsList.map((pt) => pt.tagId);
    let tagsList = [];
    if (tagIds.length > 0) {
      tagsList = await db.select().from(tags).where(inArray(tags.id, tagIds));
    }

    const postCategoriesList = await db
      .select({ categoryId: postCategories.categoryId })
      .from(postCategories)
      .where(eq(postCategories.postId, postId));

    const categoryIds = postCategoriesList.map((pc) => pc.categoryId);
    let categoriesList = [];
    if (categoryIds.length > 0) {
      categoriesList = await db
        .select()
        .from(categories)
        .where(inArray(categories.id, categoryIds));
    }

    return {
      ...post,
      images,
      categories: categoriesList,
      tags: tagsList,
    };
  }
  private async findOrCreateTags(tagNames: string[]): Promise<number[]> {
    const tagIds: number[] = [];

    for (const name of tagNames) {
      const slug = SlugUtil.generate(name);

      const [existingTag] = await db
        .select()
        .from(tags)
        .where(eq(tags.slug, slug))
        .limit(1);

      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        const [newTag] = await db
          .insert(tags)
          .values({ name, slug })
          .returning();

        tagIds.push(newTag.id);
      }
    }

    return tagIds;
  }
}
