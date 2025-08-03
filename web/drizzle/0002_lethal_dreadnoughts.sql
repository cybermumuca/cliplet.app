ALTER TABLE "videos" ADD COLUMN "width" integer;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "files" DROP COLUMN "mime_type";