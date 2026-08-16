import {
  pgTable,
  serial,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { flashcardDecks } from "./flashcard-decks.schema";
import { users } from "./user.schema";

export const flashcardAttempts = pgTable(
  "flashcard_attempts",
  {
    id: serial("id").primaryKey(),

    deckId: integer("deck_id")
      .references(() => flashcardDecks.id, { onDelete: "cascade" })
      .notNull(),

    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    knownCount: integer("known_count").notNull(),
    totalCards: integer("total_cards").notNull(),
    pointsEarned: integer("points_earned").default(0).notNull(),

    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("flashcard_attempts_user_id_idx").on(table.userId),
    deckIdIdx: index("flashcard_attempts_deck_id_idx").on(table.deckId),
  }),
);

export type FlashcardAttempt = typeof flashcardAttempts.$inferSelect;
export type NewFlashcardAttempt = typeof flashcardAttempts.$inferInsert;
