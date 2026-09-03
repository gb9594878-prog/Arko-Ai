"use client"

import { useState } from "react"
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { validateGeminiKey } from "@/lib/gemini"

interface ApiKeyDialogProps {
  initialKey?: string
  onSave: (key: string) => void
  onClose?: () => void
  dismissible?: boolean
}

export function ApiKeyDialog({ initialKey = "", onSave, onClose, dismissible }: ApiKeyDialogProps) {
  const [value, setValue] = useState(initialKey)
  const [show, setShow] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    const key = value.trim()
    if (!key) {
      setError("Please enter your API key.")
      return
    }
        onSave(key)
    return
  }
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={dismissible ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-key-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-secondary">
          <KeyRound className="size-5 text-foreground" aria-hidden="true" />
        </div>

        <h2 id="api-key-title" className="text-lg font-semibold text-balance">
          Connect your Gemini API key
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
          Arko AI runs on Google&apos;s Gemini. Paste your key to start chatting — it is stored only in your
          browser&apos;s local storage and never sent anywhere else.
        </p>

        <div className="mt-5">
          <label htmlFor="api-key" className="sr-only">
            Gemini API key
          </label>
          <div className="relative">
            <input
              id="api-key"
              type={show ? "text" : "password"}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) handleSave()
              }}
              placeholder="AIza..."
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={show ? "Hide API key" : "Show API key"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Get a free API key from Google AI Studio
          </a>
        </div>

        <div className="mt-6 flex gap-2">
          {dismissible && (
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={checking} className="flex-1">
            {checking ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verifying
              </>
            ) : (
              "Save key"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
