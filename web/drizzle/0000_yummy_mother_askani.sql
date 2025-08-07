CREATE TYPE "public"."auth_providers_enum" AS ENUM('GOOGLE', 'GITHUB');--> statement-breakpoint
CREATE TYPE "public"."clip_types_enum" AS ENUM('text', 'image', 'video', 'audio', 'document', 'file');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_pk_id" PRIMARY KEY("id"),
	CONSTRAINT "users_uq_email" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_auth_providers" (
	"id" text NOT NULL,
	"user_id" text NOT NULL,
	"provider" "auth_providers_enum" NOT NULL,
	"provider_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "user_auth_providers_pk_id" PRIMARY KEY("id"),
	CONSTRAINT "user_auth_providers_uq_user_provider" UNIQUE("user_id","provider")
);
--> statement-breakpoint
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
	"width" integer,
	"height" integer,
	CONSTRAINT "videos_pk_id" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "user_auth_providers" ADD CONSTRAINT "user_auth_providers_fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clips" ADD CONSTRAINT "clips_fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audios" ADD CONSTRAINT "audios_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "texts" ADD CONSTRAINT "texts_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_fk_clip" FOREIGN KEY ("id") REFERENCES "public"."clips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_auth_providers_idx_fk_user" ON "user_auth_providers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "clips_idx_fk_user" ON "clips" USING btree ("user_id");