import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),

  description: text("description").notNull(),

  imageIds: integer("image_ids").array().notNull(),

  authorId: integer("author_id")
    .references(() => users.id)
    .notNull(),

  metaDescription: varchar("meta_description", { length: 500 }).notNull(),

  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
