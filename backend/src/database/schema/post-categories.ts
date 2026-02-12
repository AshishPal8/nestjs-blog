import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { posts } from "./posts.schema";
import { categories } from "./categories.schema";

export const postCategories = pgTable(
  "post_categories",
  {
    postId: integer("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.postId, table.categoryId] }),
    };
  },
);

export type PostCategory = typeof postCategories.$inferSelect;
