ALTER TABLE "posts" ADD COLUMN "cover_image_url" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "cover_image_alt" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;