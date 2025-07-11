"use client"

import { useState, useCallback, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChatHeader } from "@/components/chat/chat-header"
import { MessageList } from "@/components/chat/message-list"
import { MessageInput } from "@/components/chat/message-input"
import { sendMessage, getMessages, clearMessages, createChat, type Message } from "@/lib/deepseek-api"
import { useToast } from "@/hooks/use-toast"

export default function Chat() {
  const [chatId, setChatId] = useState<number | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isDeepThinking, setIsDeepThinking] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Create initial chat on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const chat = await createChat("محادثة جديدة", "dr.x AI Assistant")
        setChatId(chat.id)
      } catch (error) {
        console.error("Failed to create initial chat:", error)
        toast({
          title: "خطأ في إنشاء المحادثة",
          description: "فشل في إنشاء محادثة جديدة. يرجى إعادة تحميل الصفحة.",
          variant: "destructive",
        })
      }
    }

    initializeChat()
  }, [toast])

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/chats", chatId, "messages"],
    queryFn: () => getMessages(chatId!),
    enabled: !!chatId,
    refetchInterval: false,
  })

  const sendMessageMutation = useMutation({
    mutationFn: ({ content, useDeepThink }: { content: string; useDeepThink: boolean }) =>
      sendMessage(content, chatId!, useDeepThink),
    onMutate: ({ useDeepThink }) => {
      setIsTyping(true)
      setIsDeepThinking(useDeepThink)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats", chatId, "messages"] })
      setIsTyping(false)
      setIsDeepThinking(false)
    },
    onError: (error: any) => {
      console.error("Error sending message:", error)
      setIsTyping(false)
      setIsDeepThinking(false)
      toast({
        title: "خطأ في الإرسال",
        description: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    },
  })

  const clearChatMutation = useMutation({
    mutationFn: () => clearMessages(chatId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats", chatId, "messages"] })
      toast({
        title: "تم مسح المحادثة",
        description: "تم مسح جميع الرسائل بنجاح.",
      })
    },
    onError: (error: any) => {
      console.error("Error clearing chat:", error)
      toast({
        title: "خطأ في المسح",
        description: "فشل في مسح المحادثة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    },
  })

  const handleSendMessage = useCallback(
    (content: string, useDeepThink = false) => {
      if (!chatId) return
      sendMessageMutation.mutate({ content, useDeepThink })
    },
    [sendMessageMutation, chatId],
  )

  const handleClearChat = useCallback(() => {
    if (!chatId) return
    clearChatMutation.mutate()
  }, [clearChatMutation, chatId])

  const handleQuickMessage = useCallback(
    (message: string) => {
      if (!chatId) return
      sendMessageMutation.mutate({ content: message, useDeepThink: false })
    },
    [sendMessageMutation, chatId],
  )

  // Transform messages to match the expected format
  const transformedMessages: Array<{
    id: number
    content: string
    isUser: boolean
    timestamp: string
  }> = messages.map((msg: Message) => ({
    id: msg.id,
    content: msg.content,
    isUser: msg.sender === "user",
    timestamp: msg.created_at?.toISOString() || new Date().toISOString(),
  }))

  if (!chatId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-muted-foreground">جاري إنشاء المحادثة...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <ChatHeader onClearChat={handleClearChat} isConnected={!sendMessageMutation.isPending && !isLoading} />

      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-background via-surface to-background">
        <MessageList
          messages={transformedMessages}
          isTyping={isTyping || sendMessageMutation.isPending}
          isDeepThinking={isDeepThinking}
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={sendMessageMutation.isPending}
          onQuickMessage={handleQuickMessage}
        />
      </main>
    </div>
  )
}
