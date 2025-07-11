import { User } from "lucide-react"
import { DrXLogo } from "../dr-x-logo"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"

interface MessageBubbleProps {
  content: string
  isUser: boolean
  timestamp: string
}

export function MessageBubble({ content, isUser, timestamp }: MessageBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: ar,
  })

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 message-enter group">
        <div className="flex flex-col items-end max-w-[80%] sm:max-w-[70%]">
          <div className="chat-bubble-user">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
          </div>
          <time className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {timeAgo}
          </time>
        </div>

        <div className="avatar-user flex-shrink-0">
          <User className="w-5 h-5" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-3 message-enter group">
      <div className="avatar-ai flex-shrink-0">
        <DrXLogo className="w-5 h-5" />
      </div>

      <div className="flex flex-col items-start max-w-[80%] sm:max-w-[70%]">
        <div className="chat-bubble-ai">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gradient">dr.x AI</span>
            <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        </div>
        <time className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {timeAgo}
        </time>
      </div>
    </div>
  )
}
