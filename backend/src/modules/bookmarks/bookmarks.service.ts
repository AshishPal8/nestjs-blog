import { Injectable } from "@nestjs/common";
import { db } from "@database/db";
import { bookmarks } from "@database/schema/bookmark.schema";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { PaginationDto, paginationSchema } from "@common/dto/pagination.input";
import { posts } from "@database/schema/posts.schema";
import { PostsService } from "../posts/posts.service";

@Injectable()
export class BookmarksService {
  constructor(private readonly postService: PostsService) {}

  async toggleBookmark(userId: number, postId: number): Promise<boolean> {
    const deleted = await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)))
      .returning({ id: bookmarks.id });

    if (deleted.length > 0) {
      return false;
    }

    await db.insert(bookmarks).values({ userId, postId });
    return true;
  }

  async findMyBookmarks(pagination: PaginationDto, userId: number) {
    const validated = paginationSchema.parse(pagination);
    const { page, limit } = validated;
    const offset = (page - 1) * limit;

    // get bookmarked post ids for this user
    const userBookmarks = await db
      .select({ postId: bookmarks.postId })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId));

    if (userBookmarks.length === 0) {
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

    const postIds = userBookmarks.map((b) => b.postId);

    const postsList = await db
      .select()
      .from(posts)
      .where(and(inArray(posts.id, postIds), eq(posts.isDeleted, false)));

    const postsWithRelations =
      await this.postService.getPostsWithRelationsBatch(postsList, userId);

    const totalPages = Math.ceil(total / limit);

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
}
