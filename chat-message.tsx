"use client"

import { cn } from "@/lib/utils"
import type { ChatMessage as ChatMessageType } from "@/lib/gemini"

interface ChatMessageProps {
  message: ChatMessageType
  streaming?: boolean
}

export function ChatMessage({ message, streaming }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:text-[15px]",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-card-foreground",
        )}
      >
        {message.content}
        {streaming && !message.content && (
          <span className="inline-flex gap-1 py-1 align-middle" aria-label="Arko AI is typing">
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
          </span>
        )}
        {streaming && message.content && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-muted-foreground align-middle" />
        )}
      </div>
    </div>
  )
}
