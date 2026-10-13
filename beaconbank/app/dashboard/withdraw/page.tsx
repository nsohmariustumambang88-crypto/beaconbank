"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { authHeaders, getToken } from "@/lib/session"

type Row = { id: string; amount: string; fee: string; currency: string; bankName: string; accountLast4: string; status: string; reviewNote: string | null; createdAt: string }

const input = "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
const EMPTY = { amount: "", currency: "USD", bankName: "", accountHolder: "", accountNumber: "", iban: "" }

function readError(j: { error?: string; message?: string }) {
  if (j.error?.startsWith("{")) {
    try { return Object.values(JSON.parse(j.error)).join(". ") } catch {}
  }
  return j.error || j.message || "Something went wrong"
}

export default function WithdrawPage() {
  const router = useRouter()
  const [form, setForm] = useState(EMPTY)
  const [rows, setRows] = useState<Row[]>([])
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const r = await fetch("/api/withdrawals", { headers: authHeaders() })
    if (r.status === 401) return router.replace("/login")
    const j = await r.json()
    if (j.success) setRows(j.data.rows)
  }

  useEffect(() => {
    if (!getToken()) router.replace("/login")
    else load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const amount = Number(form.amount)
  const fee = Number.isFinite(amount) && amount > 0 ? Math.max(1, Math.round(amount * 0.01 * 100) / 100) : 0

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setSubmitting(true)
    try {
      const r = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      })
      const j = await r.json()
      if (!r.ok || !j.success) {
        setMessage({ kind: "error", text: readError(j) })
        return
      }
      setMessage({ kind: "ok", text: "Withdrawal requested. The amount and fee are held until it is paid or cancelled." })
      setForm(EMPTY)
      load()
    } catch {
      setMessage({ kind: "error", text: "Could not reach the server. Try again." })
    } finally {
      setSubmitting(false)
    }
  }

  async function cancel(id: string) {
    setMessage(null)
    const r = await fetch(`/api/withdrawals/${id}/cancel`, { method: "POST", headers: authHeaders() })
    const j = await r.json()
    setMessage(r.ok && j.success ? { kind: "ok", text: "Cancelled. The money has been returned to your account." } : { kind: "error", text: readError(j) })
    load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-xs md:text-sm">
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Back to dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Withdraw to your bank</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Minimum 10, maximum 10,000 per request. A fee of 1% (at least 1) applies. Withdrawals are paid out after review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="amount" className="text-xs md:text-sm font-medium">Amount</label>
                  <input id="amount" type="number" min="10" max="10000" step="0.01" required className={input} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="currency" className="text-xs md:text-sm font-medium">Currency</label>
                  <select id="currency" className={input} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                    <option>USD</option><option>EUR</option><option>GBP</option>
                  </select>
                </div>
              </div>
              {fee > 0 && <p className="text-xs text-muted-foreground">Fee {fee.toFixed(2)} · total held {(amount + fee).toFixed(2)} {form.currency}</p>}
              <div className="space-y-2">
                <label htmlFor="bankName" className="text-xs md:text-sm font-medium">Bank name</label>
                <input id="bankName" required className={input} value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="accountHolder" className="text-xs md:text-sm font-medium">Account holder name</label>
                <input id="accountHolder" required className={input} value={form.accountHolder} onChange={(e) => setForm({ ...form, accountHolder: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="accountNumber" className="text-xs md:text-sm font-medium">Account number</label>
                  <input id="accountNumber" required className={input} value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="iban" className="text-xs md:text-sm font-medium">IBAN (optional)</label>
                  <input id="iban" className={input} value={form.iban} onChange={(e) => setForm({ ...form, iban: e.target.value })} />
                </div>
              </div>
              {message && <p className={`text-sm ${message.kind === "ok" ? "text-primary" : "text-destructive"}`}>{message.text}</p>}
              <Button type="submit" disabled={submitting} className="w-full h-10">{submitting ? "Requesting…" : "Request withdrawal"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your withdrawals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.length === 0 && <p className="text-sm text-muted-foreground">No withdrawals yet.</p>}
            {rows.map((w) => (
              <div key={w.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{w.currency} {Number(w.amount).toFixed(2)} to {w.bankName} ••••{w.accountLast4}</p>
                  <p className="text-xs text-muted-foreground">{new Date(w.createdAt).toLocaleDateString()} · {w.status}{w.reviewNote ? ` · ${w.reviewNote}` : ""}</p>
                </div>
                {w.status === "pending" && (
                  <Button variant="outline" size="sm" className="h-8 text-xs flex-shrink-0" onClick={() => cancel(w.id)}>Cancel</Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
