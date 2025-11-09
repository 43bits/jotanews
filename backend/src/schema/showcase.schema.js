import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  timestamp, 
  jsonb, 
  integer 
} from "drizzle-orm/pg-core";

import { users } from "./users.schema.js"; 

export const showcases = pgTable("showcases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  inputRaw: text("input_raw").notNull(),
  type: varchar("type", { length: 20 }).notNull(), 
  url: text("url"), 
  previewMeta: jsonb("preview_meta"), 
  posx: integer("posx").default(0).notNull(),
  posy: integer("posy").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
