import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core"

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  title: text("title"),
  personality: text("personality"),
  user_id: integer("user_id"),
  created_at: timestamp("created_at").defaultNow(),
})

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'assistant'
  model_used: text("model_used"),
  execution_time: integer("execution_time"), // in milliseconds
  chat_id: integer("chat_id").references(() => chats.id),
  created_at: timestamp("created_at").defaultNow(),
})

export type Chat = typeof chats.$inferSelect
export type Message = typeof messages.$inferSelect
