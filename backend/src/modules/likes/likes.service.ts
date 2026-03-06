import { db } from "@database/db";
import { likes } from "@database/schema/like.schema";
import { posts } from "@database/schema/posts.schema";
import { Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";

@Injectable()
export class LikesService {
  async toggle(postId: number, userId: number) {
    const [existing] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
      .limit(1);

    if (existing) {
      await db
        .delete(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));

      const [post] = await db
        .update(posts)
        .set({
          likesCount: sql`GREATEST(COALESCE(${posts.likesCount}, 0) - 1, 0)`,
        })
        .where(eq(posts.id, postId))
        .returning({ likesCount: posts.likesCount });

      return { postId, likesCount: post.likesCount ?? 0, isLiked: false };
    } else {
      await db.insert(likes).values({ postId, userId });

      const [post] = await db
        .update(posts)
        .set({
          likesCount: sql`GREATEST(COALESCE(${posts.likesCount}, 0) + 1, 0)`,
        })
        .where(eq(posts.id, postId))
        .returning({ likesCount: posts.likesCount });

      return { postId, likesCount: post.likesCount ?? 0, isLiked: true };
    }
  }

  async isLiked(postId: number, userId: number): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
      .limit(1);

    return !!existing;
  }
}
