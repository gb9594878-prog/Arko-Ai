"use client"

import { useEffect, useRef } from "react"
import { ArrowUp, Square } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
  isStreaming: boolean
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSubmit, onStop, isStreaming, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [value])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-3xl px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-end gap-2 rounded-2xl border border-input bg-card p-2 transition-colors focus-within:border-ring">
          <label htmlFor="chat-input" className="sr-only">
            Message Arko AI
          </label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Arko AI…"
            disabled={disabled}
            className="max-h-[200px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
          />
          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-accent"
              aria-label="Stop generating"
            >
              <Square className="size-4 fill-current" />
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={disabled || !value.trim()}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
              aria-label="Send message"
            >
              <ArrowUp className="size-5" />
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Arko AI can make mistakes. Powered by Gemini 2.5 Flash.
        </p>
      </div>
    </div>
  )
}
