import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool } from "@neondatabase/serverless"
import * as schema from "../shared/schema"
import { eq, desc } from "drizzle-orm"
import type { Message, InsertMessage, Chat, InsertChat } from "../shared/schema"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })

export interface IStorage {
  createChat(chat: InsertChat): Promise<Chat>
  getChat(id: number): Promise<Chat | undefined>
  getChatsByUser(userId: number): Promise<Chat[]>
  createMessage(message: InsertMessage): Promise<Message>
  getMessagesByChat(chatId: number): Promise<Message[]>
  clearMessages(chatId: number): Promise<void>
  updateChatTitle(chatId: number, title: string): Promise<void>
}

export class DatabaseStorage implements IStorage {
  async createChat(insertChat: InsertChat): Promise<Chat> {
    const [chat] = await db.insert(schema.chats).values(insertChat).returning()
    return chat
  }

  async getChat(id: number): Promise<Chat | undefined> {
    const [chat] = await db.select().from(schema.chats).where(eq(schema.chats.id, id))
    return chat
  }

  async getChatsByUser(userId: number): Promise<Chat[]> {
    return await db
      .select()
      .from(schema.chats)
      .where(eq(schema.chats.user_id, userId))
      .orderBy(desc(schema.chats.created_at))
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(schema.messages).values(insertMessage).returning()
    return message
  }

  async getMessagesByChat(chatId: number): Promise<Message[]> {
    return await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.chat_id, chatId))
      .orderBy(schema.messages.created_at)
  }

  async clearMessages(chatId: number): Promise<void> {
    await db.delete(schema.messages).where(eq(schema.messages.chat_id, chatId))
  }

  async updateChatTitle(chatId: number, title: string): Promise<void> {
    await db.update(schema.chats).set({ title }).where(eq(schema.chats.id, chatId))
  }
}

// Fallback in-memory storage for development
export class MemStorage implements IStorage {
  private chats: Map<number, Chat> = new Map()
  private messages: Map<number, Message> = new Map()
  private currentChatId = 1
  private currentMessageId = 1

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = this.currentChatId++
    const chat: Chat = {
      id,
      title: insertChat.title,
      personality: insertChat.personality || null,
      user_id: insertChat.user_id || null,
      created_at: new Date(),
    }
    this.chats.set(id, chat)
    return chat
  }

  async getChat(id: number): Promise<Chat | undefined> {
    return this.chats.get(id)
  }

  async getChatsByUser(userId: number): Promise<Chat[]> {
    return Array.from(this.chats.values())
      .filter((chat) => chat.user_id === userId)
      .sort((a, b) => (b.created_at?.getTime() || 0) - (a.created_at?.getTime() || 0))
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++
    const message: Message = {
      id,
      content: insertMessage.content,
      sender: insertMessage.sender,
      model_used: insertMessage.model_used || null,
      execution_time: insertMessage.execution_time || null,
      chat_id: insertMessage.chat_id,
      created_at: new Date(),
    }
    this.messages.set(id, message)
    return message
  }

  async getMessagesByChat(chatId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.chat_id === chatId)
      .sort((a, b) => (a.created_at?.getTime() || 0) - (b.created_at?.getTime() || 0))
  }

  async clearMessages(chatId: number): Promise<void> {
    const messagesToDelete = Array.from(this.messages.entries())
      .filter(([_, message]) => message.chat_id === chatId)
      .map(([id]) => id)

    messagesToDelete.forEach((id) => this.messages.delete(id))
  }

  async updateChatTitle(chatId: number, title: string): Promise<void> {
    const chat = this.chats.get(chatId)
    if (chat) {
      chat.title = title
      this.chats.set(chatId, chat)
    }
  }
}

// Use database storage if DATABASE_URL is available, otherwise fallback to memory
export const storage: IStorage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage()
