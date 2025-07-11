import type { Express } from "express"
import { createServer, type Server } from "http"
import { storage } from "./storage"
import { z } from "zod"

const sendMessageSchema = z.object({
  content: z.string().min(1),
  chatId: z.number().int().positive(),
  useDeepThink: z.boolean().optional().default(false),
})

const createChatSchema = z.object({
  title: z.string().min(1),
  personality: z.string().optional(),
  userId: z.number().int().positive().optional(),
})

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new chat
  app.post("/api/chats", async (req, res) => {
    try {
      const { title, personality, userId } = createChatSchema.parse(req.body)

      const chat = await storage.createChat({
        title,
        personality,
        user_id: userId,
      })

      res.json(chat)
    } catch (error) {
      console.error("Error creating chat:", error)
      res.status(500).json({ message: "Failed to create chat" })
    }
  })

  // Get chat by ID
  app.get("/api/chats/:chatId", async (req, res) => {
    try {
      const chatId = Number.parseInt(req.params.chatId)
      const chat = await storage.getChat(chatId)

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" })
      }

      res.json(chat)
    } catch (error) {
      console.error("Error fetching chat:", error)
      res.status(500).json({ message: "Failed to fetch chat" })
    }
  })

  // Get messages for a chat
  app.get("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const chatId = Number.parseInt(req.params.chatId)
      const messages = await storage.getMessagesByChat(chatId)
      res.json(messages)
    } catch (error) {
      console.error("Error fetching messages:", error)
      res.status(500).json({ message: "Failed to fetch messages" })
    }
  })

  // Send a message and get AI response
  app.post("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const chatId = Number.parseInt(req.params.chatId)
      const { content, useDeepThink } = sendMessageSchema.parse({
        ...req.body,
        chatId,
      })

      const startTime = Date.now()

      // Store user message
      const userMessage = await storage.createMessage({
        content,
        sender: "user",
        chat_id: chatId,
      })

      // Call DeepSeek API
      const apiKey = process.env.DEEPSEEK_API_KEY || "sk-94af74f2b4fe4e98a8b1ec389dc6ec4b"
      if (!apiKey) {
        return res.status(500).json({ message: "DeepSeek API key not configured" })
      }

      // Get conversation history
      const messages = await storage.getMessagesByChat(chatId)

      // Prepare enhanced prompt based on DeepSeek-R1 recommendations
      let enhancedContent = content

      // Check if it's a math problem and add specific instructions
      const isMathProblem =
        /[\d+\-*/=$$$$]/g.test(content) || /رياضي|حساب|معادلة|math|calculate|solve|equation/i.test(content)

      if (isMathProblem) {
        enhancedContent = `${content}\n\nPlease reason step by step, and put your final answer within \\boxed{}.`
      }

      // Force thinking pattern for DeepSeek-R1 if useDeepThink is enabled
      if (useDeepThink) {
        enhancedContent = `<Thinking>\n\n</Thinking>\n\n${enhancedContent}`
      }

      // Prepare messages for DeepSeek API (NO system prompt as per R1 guidelines)
      const apiMessages = [
        ...messages.slice(0, -1).map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        {
          role: "user",
          content: enhancedContent,
        },
      ]

      // Use deepseek-reasoner model for deep thinking, otherwise regular chat
      const model = useDeepThink ? "deepseek-reasoner" : "deepseek-chat"

      const deepseekResponse = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: apiMessages,
          temperature: 0.6, // Recommended temperature for DeepSeek-R1
          max_tokens: 32768, // Allow long reasoning chains
          stream: false,
        }),
      })

      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text()
        console.error("DeepSeek API error:", errorText)
        return res.status(500).json({ message: "Failed to get AI response" })
      }

      const deepseekData = await deepseekResponse.json()
      let aiResponse = deepseekData.choices[0].message.content

      // Process the response if it contains thinking pattern
      if (aiResponse.includes("<Thinking>") && aiResponse.includes("</Thinking>")) {
        // Extract thinking and final response
        const thinkMatch = aiResponse.match(/<Thinking>([\s\S]*?)<\/Thinking>/)
        const thinking = thinkMatch ? thinkMatch[1].trim() : ""
        const finalResponse = aiResponse.replace(/<Thinking>[\s\S]*?<\/Thinking>/, "").trim()

        // Store the complete response including thinking process
        aiResponse = finalResponse || aiResponse
      }

      const executionTime = Date.now() - startTime

      // Store AI response
      const aiMessage = await storage.createMessage({
        content: aiResponse,
        sender: "assistant",
        model_used: model,
        execution_time: executionTime,
        chat_id: chatId,
      })

      // Auto-generate chat title if it's the first exchange
      if (messages.length <= 1) {
        const title = content.length > 50 ? content.substring(0, 47) + "..." : content
        await storage.updateChatTitle(chatId, title)
      }

      res.json({ userMessage, aiMessage })
    } catch (error) {
      console.error("Error processing message:", error)
      res.status(500).json({ message: "Failed to process message" })
    }
  })

  // Clear chat history
  app.delete("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const chatId = Number.parseInt(req.params.chatId)
      await storage.clearMessages(chatId)
      res.json({ message: "Chat history cleared" })
    } catch (error) {
      console.error("Error clearing messages:", error)
      res.status(500).json({ message: "Failed to clear chat history" })
    }
  })

  const httpServer = createServer(app)
  return httpServer
}
