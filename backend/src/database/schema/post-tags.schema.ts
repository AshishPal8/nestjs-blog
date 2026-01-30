import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { posts } from "./posts.schema";
import { tags } from "./tags.schema";

export const postTags = pgTable(
  "post_tags",
  {
    postId: integer("post_id")
      .references(() => posts.id)
      .notNull(),

    tagId: integer("tag_id")
      .references(() => tags.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
  }),
);

export type PostTag = typeof postTags.$inferSelect;
