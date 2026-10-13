"use client"

import { useState } from "react"
import { authHeaders } from "@/lib/session"

type Props = { userId: string; currency: string; balance: string }

const input = "px-2 py-1 rounded-md border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"

export function AdminBalanceEditor({ userId, currency, balance }: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(Number(balance).toFixed(2))
  const [reason, setReason] = useState("")
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  async function save() {
    setMessage("")
    setSaving(true)
    try {
      const r = await fetch(`/api/admin/users/${userId}/balance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ currency, balance: value, reason }),
      })
      const j = await r.json()
      if (!r.ok || !j.success) {
        const err = j.error?.startsWith("{") ? Object.values(JSON.parse(j.error)).join(". ") : j.error
        setMessage(err || "Could not save")
        return
      }
      window.location.reload()
    } catch {
      setMessage("Could not reach the server")
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap">{currency} {Number(balance).toFixed(2)}</span>
        <button onClick={() => setEditing(true)} className="text-xs text-primary hover:underline">Edit</button>
      </div>
    )
  }

  return (
    <div className="space-y-1.5 min-w-[11rem]">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">{currency}</span>
        <input type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} className={`${input} w-24`} />
      </div>
      <input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className={`${input} w-full`} />
      {message && <p className="text-xs text-destructive">{message}</p>}
      <div className="flex gap-2">
        <button disabled={saving || reason.trim().length < 3} onClick={save} className="text-xs px-2 py-1 rounded-md bg-primary text-primary-foreground disabled:opacity-50">
          {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={() => { setEditing(false); setMessage("") }} className="text-xs px-2 py-1 rounded-md border border-border">Cancel</button>
      </div>
    </div>
  )
}
