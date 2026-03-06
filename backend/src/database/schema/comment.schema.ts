import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { posts } from "./posts.schema";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),

  content: text("content").notNull(),

  postId: integer("post_id")
    .references(() => posts.id)
    .notNull(),

  authorId: integer("author_id")
    .references(() => users.id)
    .notNull(),

  parentId: integer("parent_id"),

  isDeleted: boolean("is_deleted").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
