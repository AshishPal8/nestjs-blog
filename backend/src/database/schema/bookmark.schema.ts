import {
  pgTable,
  serial,
  integer,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { posts } from "./posts.schema";

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    postId: integer("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userPostUnique: unique("bookmarks_user_post_unique").on(
      table.userId,
      table.postId,
    ),

    userIdIdx: index("bookmarks_user_id_idx").on(table.userId),
    postIdIdx: index("bookmarks_post_id_idx").on(table.postId),
  }),
);

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
