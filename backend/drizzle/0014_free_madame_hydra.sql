CREATE TABLE "quiz_attempt_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"consumed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD COLUMN "started_at" timestamp;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD COLUMN "time_taken_seconds" integer;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD COLUMN "timed_out" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "image_id" integer;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "time_limit_seconds" integer;--> statement-breakpoint
ALTER TABLE "quiz_attempt_sessions" ADD CONSTRAINT "quiz_attempt_sessions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempt_sessions" ADD CONSTRAINT "quiz_attempt_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quiz_attempt_sessions_quiz_user_idx" ON "quiz_attempt_sessions" USING btree ("quiz_id","user_id");--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_image_id_uploads_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."uploads"("id") ON DELETE no action ON UPDATE no action;