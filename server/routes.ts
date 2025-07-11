import type { Request, Response } from "express"
import { z } from "zod"
import { db } from "./storage"
import { chats, messages } from "../shared/schema"
import { eq } from "drizzle-orm"

// Validation schemas
const createChatSchema = z.object({
  title: z.string().min(1),
  personality: z.string().optional(),
  userId: z.number().optional(),
})

const sendMessageSchema = z.object({
  content: z.string().min(1),
  useDeepThink: z.boolean().default(false),
})

// DeepSeek API configuration
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

async function callDeepSeekAPI(content: string, useDeepThink = false) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not configured")
  }

  const model = useDeepThink ? "deepseek-reasoner" : "deepseek-chat"

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "أنت مساعد ذكي يتحدث العربية ويساعد المستخدمين في مختلف المواضيع. كن مفيداً ومهذباً.",
        },
        {
          role: "user",
          content,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`DeepSeek API error: ${response.status} - ${errorData}`)
  }

  const data = await response.json()
  return {
    content: data.choices[0]?.message?.content || "عذراً، لم أتمكن من الحصول على رد.",
    model: model,
    usage: data.usage,
  }
}

export function registerRoutes(app: any) {
  // Create a new chat
  app.post("/api/chats", async (req: Request, res: Response) => {
    try {
      const { title, personality, userId } = createChatSchema.parse(req.body)

      const [chat] = await db
        .insert(chats)
        .values({
          title,
          personality,
          user_id: userId,
          created_at: new Date(),
        })
        .returning()

      res.json(chat)
    } catch (error) {
      console.error("Error creating chat:", error)
      res.status(500).json({ error: "Failed to create chat" })
    }
  })

  // Get chat by ID
  app.get("/api/chats/:chatId", async (req: Request, res: Response) => {
    try {
      const chatId = Number.parseInt(req.params.chatId)

      const [chat] = await db.select().from(chats).where(eq(chats.id, chatId))

      if (!chat) {
        return res.status(404).json({ error: "Chat not found" })
      }

      res.json(chat)
    } catch (error) {
      console.error("Error fetching chat:", error)
      res.status(500).json({ error: "Failed to fetch chat" })
    }
  })

  // Get messages for a chat
  app.get("/api/chats/:chatId/messages", async (req: Request, res: Response) => {
    try {
      const chatId = Number.parseInt(req.params.chatId)

      const chatMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.chat_id, chatId))
        .orderBy(messages.created_at)

      res.json(chatMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
      res.status(500).json({ error: "Failed to fetch messages" })
    }
  })

  // Send a message
  app.post("/api/chats/:chatId/messages", async (req: Request, res: Response) => {
    try {
      const chatId = Number.parseInt(req.params.chatId)
      const { content, useDeepThink } = sendMessageSchema.parse(req.body)

      // Save user message
      const [userMessage] = await db
        .insert(messages)
        .values({
          content,
          sender: "user",
          chat_id: chatId,
          created_at: new Date(),
        })
        .returning()

      // Get AI response
      const startTime = Date.now()
      const aiResponse = await callDeepSeekAPI(content, useDeepThink)
      const executionTime = Date.now() - startTime

      // Save AI message
      const [aiMessage] = await db
        .insert(messages)
        .values({
          content: aiResponse.content,
          sender: "assistant",
          model_used: aiResponse.model,
          execution_time: executionTime,
          chat_id: chatId,
          created_at: new Date(),
        })
        .returning()

      res.json({
        userMessage,
        aiMessage,
      })
    } catch (error) {
      console.error("Error sending message:", error)
      res.status(500).json({ error: "Failed to send message" })
    }
  })

  // Clear messages for a chat
  app.delete("/api/chats/:chatId/messages", async (req: Request, res: Response) => {
    try {
      const chatId = Number.parseInt(req.params.chatId)

      await db.delete(messages).where(eq(messages.chat_id, chatId))

      res.json({ success: true })
    } catch (error) {
      console.error("Error clearing messages:", error)
      res.status(500).json({ error: "Failed to clear messages" })
    }
  })
}
