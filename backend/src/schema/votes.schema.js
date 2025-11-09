import { pgTable, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { showcases } from "./showcase.schema.js";

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  showcaseId: integer("showcase_id").references(() => showcases.id).notNull(),
  userId: integer("user_id").notNull(),
  up: boolean("up").default(false),
  down: boolean("down").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
