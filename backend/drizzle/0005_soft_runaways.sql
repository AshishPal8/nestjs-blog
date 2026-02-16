CREATE TABLE "uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_id" varchar(255) NOT NULL,
	"url" varchar(500) NOT NULL,
	"name" varchar(255) NOT NULL,
	"mimeType" varchar(255) NOT NULL,
	"size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"upload_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uploads_file_id_unique" UNIQUE("file_id")
);
--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_upload_by_users_id_fk" FOREIGN KEY ("upload_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;