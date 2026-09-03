"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Sparkles } from "lucide-react"
import { ApiKeyDialog } from "@/components/api-key-dialog"
import { ChatHeader } from "@/components/chat-header"
import { ChatInput } from "@/components/chat-input"
import { ChatMessage } from "@/components/chat-message"
import { streamGeminiResponse, type ChatMessage as Message } from "@/lib/gemini"

const STORAGE_KEY = "arko-ai-gemini-key"

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a haiku about the ocean",
  "Give me a 20-minute dinner idea",
  "Debug: why is my useEffect looping?",
]

export default function Page() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [showKeyDialog, setShowKeyDialog] = useState(false)
  const [ready, setReady] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load key from localStorage on first mount.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setApiKey(stored)
    } else {
      setShowKeyDialog(true)
    }
    setReady(true)
  }, [])

  // Auto-scroll to bottom on new content.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const saveKey = useCallback((key: string) => {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKey(key)
    setShowKeyDialog(false)
  }, [])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming) return
      if (!apiKey) {
        setShowKeyDialog(true)
        return
      }

      setError(null)
      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed }
      const assistantId = crypto.randomUUID()
      const assistantMsg: Message = { id: assistantId, role: "model", content: "" }

      const history = [...messages, userMsg]
      setMessages([...history, assistantMsg])
      setInput("")
      setIsStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        await streamGeminiResponse({
          apiKey,
          messages: history,
          signal: controller.signal,
          onChunk: (chunk) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
            )
          },
        })
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // stopped by user — keep whatever streamed so far
        } else {
          const message = (err as Error).message || "Something went wrong."
          setError(message)
          setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content))
        }
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [apiKey, isStreaming, messages],
  )

  function handleStop() {
    abortRef.current?.abort()
  }

  function handleNewChat() {
    if (isStreaming) abortRef.current?.abort()
    setMessages([])
    setError(null)
    setInput("")
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <ChatHeader
        onNewChat={handleNewChat}
        onEditKey={() => setShowKeyDialog(true)}
        hasMessages={hasMessages}
      />

      <main ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          {!hasMessages ? (
            <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-secondary">
                <Sparkles className="size-6 text-foreground" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-balance">
                How can I help you today?
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground text-pretty">
                Ask anything. Arko AI is powered by Gemini 2.5 Flash.
              </p>
              <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  message={m}
                  streaming={isStreaming && m.role === "model" && m.id === messages[messages.length - 1].id}
                />
              ))}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
      </main>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => send(input)}
        onStop={handleStop}
        isStreaming={isStreaming}
        disabled={!ready}
      />

      {showKeyDialog && (
        <ApiKeyDialog
          initialKey={apiKey ?? ""}
          onSave={saveKey}
          dismissible={!!apiKey}
          onClose={() => setShowKeyDialog(false)}
        />
      )}
    </div>
  )
}
