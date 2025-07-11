import { DrXLogo } from "../dr-x-logo"
import { Brain } from "lucide-react"

interface TypingIndicatorProps {
  isDeepThinking?: boolean
}

export function TypingIndicator({ isDeepThinking = false }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start gap-3 message-enter">
      <div className="avatar-ai flex-shrink-0">
        <DrXLogo className="w-5 h-5" />
      </div>

      <div className="flex flex-col items-start">
        <div className="chat-bubble-ai min-w-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gradient">dr.x AI</span>
            {isDeepThinking && (
              <div className="flex items-center gap-1 text-primary">
                <Brain className="w-3 h-3 animate-pulse" />
                <span className="text-xs font-medium bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  R1
                </span>
              </div>
            )}
            <div className="spinner" />
          </div>
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {isDeepThinking ? "يفكر بعمق مع DeepSeek-R1..." : "يكتب..."}
        </span>
      </div>
    </div>
  )
}
