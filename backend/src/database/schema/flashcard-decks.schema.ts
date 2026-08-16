import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { categories } from "./categories.schema";
import { uploads } from "./uploads.schema";

export const flashcardDecks = pgTable(
  "flashcard_decks",
  {
    id: serial("id").primaryKey(),

    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),

    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),

    imageId: integer("image_id").references(() => uploads.id),

    sourceText: text("source_text"),

    status: varchar("status", { length: 20 }).default("draft").notNull(),

    createdById: integer("created_by_id")
      .references(() => users.id)
      .notNull(),

    pointsReward: integer("points_reward").default(10).notNull(),

    isActive: boolean("is_active").default(true).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdIdx: index("flashcard_decks_category_id_idx").on(
      table.categoryId,
    ),
    statusIdx: index("flashcard_decks_status_idx").on(table.status),
  }),
);

export type FlashcardDeck = typeof flashcardDecks.$inferSelect;
export type NewFlashcardDeck = typeof flashcardDecks.$inferInsert;
