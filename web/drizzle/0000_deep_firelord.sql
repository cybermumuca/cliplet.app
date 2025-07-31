CREATE TYPE "public"."auth_providers_enum" AS ENUM('GOOGLE', 'GITHUB');--> statement-breakpoint
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
ALTER TABLE "user_auth_providers" ADD CONSTRAINT "user_auth_providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_auth_providers" ADD CONSTRAINT "user_auth_providers_fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_auth_providers_idx_fk_user" ON "user_auth_providers" USING btree ("user_id");