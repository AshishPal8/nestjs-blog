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
import { users } from "@database/schema/user.schema";
import { likes } from "@database/schema/like.schema";
import { bookmarks } from "@database/schema/bookmark.schema";

@Injectable()
export class PostsService {
  constructor() {}

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

  async findAll(pagination: PaginationDto, userId?: number) {
    const validated = paginationSchema.parse(pagination);
    const { page, limit, search, isActive, categorySlug, isBookmarked } =
      validated;
    const offset = (page - 1) * limit;

    const filters = [eq(posts.isDeleted, false)];

    if (search) filters.push(ilike(posts.title, `%${search}%`));
    if (isActive !== undefined) filters.push(eq(posts.isActive, isActive));

    if (isBookmarked && userId) {
      const userBookmarks = db
        .select({ postId: bookmarks.postId })
        .from(bookmarks)
        .where(eq(bookmarks.userId, userId));

      filters.push(inArray(posts.id, userBookmarks));
    }

    if (categorySlug) {
      const [category] = await db
        .select()
        .from(categories)
        .where(
          and(
            eq(categories.slug, categorySlug),
            eq(categories.isDeleted, false),
          ),
        )
        .limit(1);

      if (category) {
        const postIdsInCategory = await db
          .select({ postId: postCategories.postId })
          .from(postCategories)
          .where(eq(postCategories.categoryId, category.id));

        const ids = postIdsInCategory.map((r) => r.postId);
        if (ids.length === 0) {
          return {
            data: [],
            meta: {
              total: 0,
              page,
              limit,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          };
        }
        filters.push(inArray(posts.id, ids));
      }
    }

    const whereClause = and(...filters);

    const [countResult, postsList] = await Promise.all([
      db.select({ value: count() }).from(posts).where(whereClause),
      db
        .select()
        .from(posts)
        .where(whereClause)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0].value;
    const totalPages = Math.ceil(total / limit);

    const data = await this.getPostsWithRelationsBatch(postsList, userId);

    return {
      data,
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
    if (search) filters.push(ilike(posts.title, `%${search}%`));

    const whereClause = and(...filters);

    const [countResult, postsList] = await Promise.all([
      db.select({ value: count() }).from(posts).where(whereClause),
      db
        .select()
        .from(posts)
        .where(whereClause)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0].value;
    const totalPages = Math.ceil(total / limit);

    const data = await this.getPostsWithRelationsBatch(postsList);

    return {
      data,
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

  async findBySlug(slug: string, userId?: number) {
    const [post] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.isDeleted, false)))
      .limit(1);

    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return this.getPostWithRelations(post.id, userId);
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  private async getPostWithRelations(postId: number, userId?: number) {
    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        description: posts.description,
        metaDescription: posts.metaDescription,
        imageIds: posts.imageIds,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        isActive: posts.isActive,
        isDeleted: posts.isDeleted,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const [images, postTagsList, postCategoriesList, isLiked, isBookmarked] =
      await Promise.all([
        post.imageIds?.length > 0
          ? db.select().from(uploads).where(inArray(uploads.id, post.imageIds))
          : Promise.resolve([]),
        db
          .select({ tagId: postTags.tagId })
          .from(postTags)
          .where(eq(postTags.postId, postId)),
        db
          .select({ categoryId: postCategories.categoryId })
          .from(postCategories)
          .where(eq(postCategories.postId, postId)),
        userId
          ? db
              .select()
              .from(likes)
              .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
              .limit(1)
              .then((rows) => rows.length > 0)
          : Promise.resolve(false),
        userId
          ? db
              .select()
              .from(bookmarks)
              .where(
                and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)),
              )
              .limit(1)
              .then((rows) => rows.length > 0)
          : Promise.resolve(false),
      ]);

    const [tagsList, categoriesList] = await Promise.all([
      postTagsList.length > 0
        ? db
            .select()
            .from(tags)
            .where(
              inArray(
                tags.id,
                postTagsList.map((t) => t.tagId),
              ),
            )
        : Promise.resolve([]),
      postCategoriesList.length > 0
        ? db
            .select()
            .from(categories)
            .where(
              inArray(
                categories.id,
                postCategoriesList.map((c) => c.categoryId),
              ),
            )
        : Promise.resolve([]),
    ]);

    const wordCount = post.description
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean).length;

    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      ...post,
      likesCount: post.likesCount ?? 0,
      commentsCount: post.commentsCount ?? 0,
      readingTime,
      images,
      categories: categoriesList,
      tags: tagsList,
      isLiked,
      isBookmarked,
    };
  }

  public async getPostsWithRelationsBatch(
    postsList: Awaited<ReturnType<typeof db.select>>["0"][],
    userId?: number,
  ) {
    if (postsList.length === 0) return [];

    const postIds = postsList.map((p) => p.id);
    const allImageIds = [
      ...new Set(postsList.flatMap((p) => p.imageIds ?? [])),
    ];

    const [
      allPostTags,
      allPostCategories,
      allImages,
      allUserLikes,
      allUserBookmarks,
    ] = await Promise.all([
      db.select().from(postTags).where(inArray(postTags.postId, postIds)),
      db
        .select()
        .from(postCategories)
        .where(inArray(postCategories.postId, postIds)),
      allImageIds.length > 0
        ? db.select().from(uploads).where(inArray(uploads.id, allImageIds))
        : Promise.resolve([]),
      userId
        ? db
            .select({ postId: likes.postId })
            .from(likes)
            .where(
              and(inArray(likes.postId, postIds), eq(likes.userId, userId)),
            )
        : Promise.resolve([]),
      userId
        ? db
            .select({ postId: bookmarks.postId })
            .from(bookmarks)
            .where(
              and(
                inArray(bookmarks.postId, postIds),
                eq(bookmarks.userId, userId),
              ),
            )
        : Promise.resolve([]),
    ]);

    const allTagIds = [...new Set(allPostTags.map((pt) => pt.tagId))];
    const allCategoryIds = [
      ...new Set(allPostCategories.map((pc) => pc.categoryId)),
    ];

    const [allTags, allCategories, allAuthors] = await Promise.all([
      allTagIds.length > 0
        ? db.select().from(tags).where(inArray(tags.id, allTagIds))
        : Promise.resolve([]),
      allCategoryIds.length > 0
        ? db
            .select()
            .from(categories)
            .where(inArray(categories.id, allCategoryIds))
        : Promise.resolve([]),
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
        })
        .from(users)
        .where(
          inArray(users.id, [...new Set(postsList.map((p) => p.authorId))]),
        ),
    ]);

    const tagById = new Map(allTags.map((t) => [t.id, t]));
    const categoryById = new Map(allCategories.map((c) => [c.id, c]));
    const imageById = new Map(allImages.map((img) => [img.id, img]));
    const authorById = new Map(allAuthors.map((u) => [u.id, u]));
    const likedPostIds = new Set(allUserLikes.map((l) => l.postId));
    const bookmarkedPostIds = new Set(allUserBookmarks.map((b) => b.postId));

    const tagsByPost = new Map<number, typeof allTags>();
    const categoriesByPost = new Map<number, typeof allCategories>();

    for (const pt of allPostTags) {
      if (!tagsByPost.has(pt.postId)) tagsByPost.set(pt.postId, []);
      const tag = tagById.get(pt.tagId);
      if (tag) tagsByPost.get(pt.postId)!.push(tag);
    }

    for (const pc of allPostCategories) {
      if (!categoriesByPost.has(pc.postId)) categoriesByPost.set(pc.postId, []);
      const cat = categoryById.get(pc.categoryId);
      if (cat) categoriesByPost.get(pc.postId)!.push(cat);
    }

    return postsList.map((post) => {
      const wordCount = post.description
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean).length;

      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      return {
        ...post,
        author: authorById.get(post.authorId) ?? null,
        tags: tagsByPost.get(post.id) ?? [],
        categories: categoriesByPost.get(post.id) ?? [],
        images: (post.imageIds ?? [])
          .map((id: any) => imageById.get(id))
          .filter(Boolean),
        isLiked: likedPostIds.has(post.id),
        isBookmarked: bookmarkedPostIds.has(post.id),
        likesCount: post.likesCount ?? 0,
        commentsCount: post.commentsCount ?? 0,
        readingTime,
      };
    });
  }

  private async findOrCreateTags(tagNames: string[]): Promise<number[]> {
    const slugsAndNames = tagNames.map((name) => ({
      name,
      slug: SlugUtil.generate(name),
    }));

    const slugs = slugsAndNames.map((t) => t.slug);

    const existingTags = await db
      .select()
      .from(tags)
      .where(inArray(tags.slug, slugs));

    const existingSlugMap = new Map(existingTags.map((t) => [t.slug, t]));

    const toCreate = slugsAndNames.filter((t) => !existingSlugMap.has(t.slug));

    let newTags: typeof existingTags = [];
    if (toCreate.length > 0) {
      newTags = await db.insert(tags).values(toCreate).returning();
    }

    // Return IDs in the same order as input tagNames
    return slugsAndNames.map((t) => {
      const existing = existingSlugMap.get(t.slug);
      if (existing) return existing.id;
      return newTags.find((nt) => nt.slug === t.slug)!.id;
    });
  }
}
