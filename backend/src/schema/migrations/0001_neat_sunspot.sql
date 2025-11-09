CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"showcase_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"up" boolean DEFAULT false,
	"down" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_showcase_id_showcases_id_fk" FOREIGN KEY ("showcase_id") REFERENCES "public"."showcases"("id") ON DELETE no action ON UPDATE no action;