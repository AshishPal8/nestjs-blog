import {
  pgTable,
  serial,
  integer,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { quizzes } from "./quizzes.schema";

export const quizQuestions = pgTable(
  "quiz_questions",
  {
    id: serial("id").primaryKey(),

    quizId: integer("quiz_id")
      .references(() => quizzes.id, { onDelete: "cascade" })
      .notNull(),

    question: text("question").notNull(),
    options: jsonb("options").$type<string[]>().notNull(),
    correctOptionIndex: integer("correct_option_index").notNull(),
    explanation: text("explanation"),
    orderIndex: integer("order_index").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    quizIdIdx: index("quiz_questions_quiz_id_idx").on(table.quizId),
  }),
);

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type NewQuizQuestion = typeof quizQuestions.$inferInsert;
