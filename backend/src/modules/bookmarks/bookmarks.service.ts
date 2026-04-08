import { Injectable } from "@nestjs/common";
import { db } from "@database/db";
import { bookmarks } from "@database/schema/bookmark.schema";
import { and, eq } from "drizzle-orm";

@Injectable()
export class BookmarksService {
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
}
