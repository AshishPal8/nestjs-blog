import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { posts } from "./posts.schema";

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),

  postId: integer("post_id")
    .references(() => posts.id)
    .notNull(),

  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
