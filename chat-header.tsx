"use client"

import { KeyRound, Plus } from "lucide-react"

interface ChatHeaderProps {
  onNewChat: () => void
  onEditKey: () => void
  hasMessages: boolean
}

export function ChatHeader({ onNewChat, onEditKey, hasMessages }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">A</span>
          </div>
          <h1 className="text-base font-semibold tracking-tight">Arko AI</h1>
          <span className="rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onNewChat}
            disabled={!hasMessages}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New chat</span>
          </button>
          <button
            onClick={onEditKey}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Manage API key"
          >
            <KeyRound className="size-4" />
            <span className="hidden sm:inline">API key</span>
          </button>
        </div>
      </div>
    </header>
  )
}
