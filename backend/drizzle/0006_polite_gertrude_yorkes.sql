ALTER TABLE "uploads" ALTER COLUMN "upload_by" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;