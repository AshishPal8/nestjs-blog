ALTER TABLE "flashcard_decks" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "flashcard_decks" ADD CONSTRAINT "flashcard_decks_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_slug_unique" UNIQUE("slug");