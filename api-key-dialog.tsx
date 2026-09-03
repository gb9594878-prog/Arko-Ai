
"use client"
import { useState } from "react"
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { validateGeminiKey } from "@/lib/gemini"

interface ApiKeyDialogProps {
  initialKey?: string
  onSave: (key: string) => void
  onClose: () => void
  dismissible?: boolean
}

export function ApiKeyDialog({ initialKey = "", onSave, onClose, dismissible = true }: ApiKeyDialogProps) {
  const [value, setValue] = useState(initialKey)
  const [show, setShow] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    const key = value.trim()
    if (!key) { setError("Please enter your API key."); return }
    setChecking(true); setError(null)
    const result = await validateGeminiKey(key)
    setChecking(false)
    if (!result.valid) { setError(result.error || "Invalid API Key"); return }
    onSave(key)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={dismissible ? onClose : undefined} />
      <div role="dialog" className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
        <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-muted"><KeyRound className="size-5" /></div>
        <h2 className="text-lg font-semibold">Connect your Gemini API Key</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">Paste your key to start. Key is stored in browser only.</p>
        <div className="mt-5">
          <div className="relative">
            <input id="api-key" type={show ? "text" : "password"} value={value} onChange={(e) => { setValue(e.target.value); if (error) setError(null) }} onKeyDown={(e) => { if (e.key === "Enter") handleSave() }} placeholder="AIza..." className="h-11 w-full rounded-lg border bg-background px-4 pr-10 text-sm outline-none" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          {dismissible && (<Button variant="ghost" onClick={onClose}>Later</Button>)}
          <Button onClick={handleSave} disabled={checking}>{checking ? <><Loader2 className="mr-2 size-4 animate-spin" />Checking...</> : "Save & Continue"}</Button>
        </div>
      </div>
    </div>
  )
}
