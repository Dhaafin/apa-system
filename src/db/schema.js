import { pgTable, serial, text, timestamp, pgEnum, integer, boolean } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["GURU", "SISWA", "KETUA"]);
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

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  date: timestamp("date").notNull(),
  attendanceOpen: boolean("attendance_open").default(false).notNull(),
  isExpedition: boolean("is_expedition").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const activityParticipants = pgTable("activity_participants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  activityId: integer("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  status: statusEnum("status").default("PENDING").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});
