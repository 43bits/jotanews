import { pgTable, serial, varchar, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    password: text("password").notNull(), // hashed password
    profileImage: text("profile_image").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      usernameIdx: uniqueIndex("users_username_idx").on(table.username),
      emailIdx: uniqueIndex("users_email_idx").on(table.email),
    };
  }
);
