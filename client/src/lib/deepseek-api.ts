import { apiRequest } from "./queryClient"

export interface Message {
  id: number
  content: string
  sender: string
  model_used?: string | null
  execution_time?: number | null
  chat_id: number
  created_at?: Date | null
}

export interface Chat {
  id: number
  title?: string | null
  personality?: string | null
  user_id?: number | null
  created_at?: Date | null
}

export interface SendMessageResponse {
  userMessage: Message
  aiMessage: Message
}

export async function createChat(title: string, personality?: string, userId?: number): Promise<Chat> {
  const response = await apiRequest("POST", "/api/chats", {
    title,
    personality,
    userId,
  })
  return response.json()
}

export async function getChat(chatId: number): Promise<Chat> {
  const response = await apiRequest("GET", `/api/chats/${chatId}`)
  return response.json()
}

export async function sendMessage(content: string, chatId: number, useDeepThink = false): Promise<SendMessageResponse> {
  const response = await apiRequest("POST", `/api/chats/${chatId}/messages`, {
    content,
    useDeepThink,
  })
  return response.json()
}

export async function getMessages(chatId: number): Promise<Message[]> {
  const response = await apiRequest("GET", `/api/chats/${chatId}/messages`)
  return response.json()
}

export async function clearMessages(chatId: number): Promise<void> {
  await apiRequest("DELETE", `/api/chats/${chatId}/messages`)
}
