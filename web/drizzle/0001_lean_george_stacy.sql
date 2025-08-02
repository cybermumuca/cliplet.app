CREATE TYPE "public"."clip_types_enum" AS ENUM('text', 'image', 'video', 'audio', 'document', 'file');--> statement-breakpoint
CREATE TABLE "clips" (
	"id" text NOT NULL,
	"type" "clip_types_enum" NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "clips_pk_id" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "audios" (
	"id" text NOT NULL,
	"file_name" varchar NOT NULL,
	"file_key" varchar NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar NOT NULL,
	"original_name" varchar NOT NULL,
	"url" text NOT NULL,
	"duration" integer NOT NULL,
	CONSTRAINT "audios_pk_id" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text NOT NULL,
	"file_name" varchar NOT NULL,
	"file_key" varchar NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar NOT NULL,
	"original_name" varchar NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "documents_pk_id" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" text NOT NULL,
	"file_name" varchar NOT NULL,
	"file_key" varchar NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar NOT NULL,
	"original_name" varchar NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "files_pk_id" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" text NOT NULL,
	"file_name" varchar NOT NULL,
	"file_key" varchar NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar NOT NULL,
	"original_name" varchar NOT NULL,
	"url" text NOT NULL,
	"width" integer,
	"height" integer,
	CONSTRAINT "images_pk_id" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "texts" (
	"id" text NOT NULL,
	"content" text NOT NULL,
	CONSTRAINT "texts_pk_id" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" text NOT NULL,
	"file_name" varchar NOT NULL,
	"file_key" varchar NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar NOT NULL,
	"original_name" varchar NOT NULL,
	"url" text NOT NULL,
	"duration" integer NOT NULL,
	CONSTRAINT "videos_pk_id" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "clips" ADD CONSTRAINT "clips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clips" ADD CONSTRAINT "clips_fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audios" ADD CONSTRAINT "audios_id_clips_id_fk" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audios" ADD CONSTRAINT "audios_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_id_clips_id_fk" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_id_clips_id_fk" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_id_clips_id_fk" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "texts" ADD CONSTRAINT "texts_id_clips_id_fk" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "texts" ADD CONSTRAINT "texts_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_id_clips_id_fk" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;