import { Injectable } from "@nestjs/common";
import { CreatePostDto, createPostSchema } from "./dto/create-post.input";
import { SlugUtil } from "@common/utils/slug.util";
import { db } from "@database/db";
import { posts } from "@database/schema/posts.schema";
import { eq } from "drizzle-orm";
import { tags } from "@database/schema/tags.schema";
import { postTags } from "@database/schema/post-tags.schema";
import { ConflictError } from "@common/responses/custom-response";

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

    const [post] = await db
      .insert(posts)
      .values({
        title: validated.title,
        slug,
        description: validated.description,
        metaDescription: validated.metaDescription,
        image: validated.image,
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

    return post;
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
