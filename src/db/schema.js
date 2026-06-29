import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["GURU", "SISWA"]);
export const statusEnum = pgEnum("user_status", ["PENDING", "APPROVED", "REJECTED"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("SISWA").notNull(),
  status: statusEnum("status").default("PENDING").notNull(),
  class: text("class"), // For SISWA, can be null for GURU
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
