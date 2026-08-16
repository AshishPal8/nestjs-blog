import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { flashcardDecks } from "./flashcard-decks.schema";

export const flashcardCards = pgTable(
  "flashcard_cards",
  {
    id: serial("id").primaryKey(),

    deckId: integer("deck_id")
      .references(() => flashcardDecks.id, { onDelete: "cascade" })
      .notNull(),

    front: text("front").notNull(),
    back: text("back").notNull(),
    orderIndex: integer("order_index").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    deckIdIdx: index("flashcard_cards_deck_id_idx").on(table.deckId),
  }),
);

export type FlashcardCard = typeof flashcardCards.$inferSelect;
export type NewFlashcardCard = typeof flashcardCards.$inferInsert;
