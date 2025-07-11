"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { DrXLogo } from "../dr-x-logo"

interface Message {
  id: number
  content: string
  isUser: boolean
  timestamp: string
}

interface MessageListProps {
  messages: Message[]
  isTyping: boolean
  isDeepThinking?: boolean
}

export function MessageList({ messages, isTyping, isDeepThinking = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md animate-fade-in">
          <div className="mb-6">
            <DrXLogo className="w-16 h-16 mx-auto text-primary animate-glow" />
          </div>
          <h2 className="text-2xl font-semibold text-gradient mb-3">مرحبًا بك في dr.x AI</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            أنا مساعد ذكي مدعوم بتقنية DeepSeek المتقدمة. يمكنني مساعدتك في البرمجة، الكتابة، التحليل، وأكثر من ذلك
            بكثير.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">جرب إحدى هذه الأسئلة:</p>
            <div className="grid gap-2 text-sm">
              <div className="glass rounded-lg p-3 text-right">"اشرح لي مفهوم الذكاء الاصطناعي"</div>
              <div className="glass rounded-lg p-3 text-right">"ساعدني في كتابة كود Python"</div>
              <div className="glass rounded-lg p-3 text-right">"ما هي أفضل الممارسات في التصميم؟"</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-custom px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}

          {isTyping && <TypingIndicator isDeepThinking={isDeepThinking} />}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
