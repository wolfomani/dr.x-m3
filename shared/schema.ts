import { pgTable, text, serial, integer, timestamp, varchar, jsonb } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import type { z } from "zod"

// Use the existing users table from the database
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  password_hash: varchar("password_hash", { length: 255 }),
  theme: varchar("theme", { length: 50 }),
  preferences: jsonb("preferences"),
  created_at: timestamp("created_at").defaultNow(),
})

// Use the existing chats table
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  personality: varchar("personality", { length: 100 }),
  user_id: integer("user_id"),
  created_at: timestamp("created_at").defaultNow(),
})

// Use the existing messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender: varchar("sender", { length: 50 }).notNull(), // 'user' or 'assistant'
  model_used: varchar("model_used", { length: 100 }),
  execution_time: integer("execution_time"),
  chat_id: integer("chat_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
})

// Schema for inserting new messages
export const insertMessageSchema = createInsertSchema(messages)
  .pick({
    content: true,
    sender: true,
    model_used: true,
    execution_time: true,
    chat_id: true,
  })
  .required({
    content: true,
    sender: true,
    chat_id: true,
  })

// Schema for inserting new chats
export const insertChatSchema = createInsertSchema(chats)
  .pick({
    title: true,
    personality: true,
    user_id: true,
  })
  .required({
    title: true,
  })

export type InsertMessage = z.infer<typeof insertMessageSchema>
export type Message = typeof messages.$inferSelect
export type InsertChat = z.infer<typeof insertChatSchema>
export type Chat = typeof chats.$inferSelect
export type User = typeof users.$inferSelect
