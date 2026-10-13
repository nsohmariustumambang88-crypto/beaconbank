"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin-shell"
import { Button } from "@/components/ui/button"
import { authHeaders } from "@/lib/session"

type Row = { id: string; amount: string; fee: string; currency: string; bankName: string; accountHolder: string; accountLast4: string; status: string; createdAt: string; user: { email: string; name: string } }
type Detail = { id: string; accountNumber: string; iban: string | null; bankName: string; accountHolder: string; amount: string; fee: string; currency: string; status: string; reviewNote: string | null; user: { email: string; name: string } }

const FILTERS = ["pending", "completed", "rejected", "cancelled", "all"] as const
const field = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"

export default function AdminWithdrawalsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("pending")
  const [rows, setRows] = useState<Row[] | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [note, setNote] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  async function load() {
    const q = filter === "all" ? "" : `?status=${filter}`
    const r = await fetch(`/api/admin/withdrawals${q}`, { headers: authHeaders() })
    const j = await r.json()
    setRows(j.success ? j.data.rows : [])
  }

  useEffect(() => {
    setRows(null)
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  async function open(id: string) {
    if (openId === id) {
      setOpenId(null)
      setDetail(null)
      return
    }
    setOpenId(id)
    setDetail(null)
    setNote("")
    setMessage("")
    const r = await fetch(`/api/admin/withdrawals/${id}`, { headers: authHeaders() })
    const j = await r.json()
    if (r.ok && j.success) setDetail(j.data.withdrawal)
    else setMessage(j.error || "Could not load details")
  }

  async function decide(decision: "completed" | "rejected") {
    if (!openId) return
    setBusy(true)
    setMessage("")
    try {
      const r = await fetch(`/api/admin/withdrawals/${openId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ decision, note }),
      })
      const j = await r.json()
      if (!r.ok || !j.success) {
        const err = j.error?.startsWith("{") ? Object.values(JSON.parse(j.error)).join(". ") : j.error
        setMessage(err || "Could not save")
        return
      }
      setMessage(decision === "completed" ? "Marked as paid." : "Rejected and funds returned to the customer.")
      setOpenId(null)
      setDetail(null)
      load()
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminShell title="Withdrawals" description="Pay out approved withdrawals, or reject and return the funds">
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm border capitalize ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
          >
            {f}
          </button>
        ))}
      </div>
      {message && <p className="text-sm text-muted-foreground mb-3">{message}</p>}
      {rows === null && <p className="text-sm text-muted-foreground">Loading…</p>}
      {rows?.length === 0 && <p className="text-sm text-muted-foreground">No withdrawals in this list.</p>}
      <div className="space-y-3">
        {rows?.map((w) => (
          <div key={w.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium">{w.user.name} · {w.user.email}</p>
                <p className="text-xs text-muted-foreground">{w.currency} {Number(w.amount).toFixed(2)} (fee {Number(w.fee).toFixed(2)}) to {w.accountHolder}, {w.bankName} ••••{w.accountLast4} · {new Date(w.createdAt).toLocaleString()} · {w.status}</p>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => open(w.id)}>{openId === w.id ? "Close" : "Review"}</Button>
            </div>
            {openId === w.id && (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                {!detail && <p className="text-sm text-muted-foreground">Loading payout details…</p>}
                {detail && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <p><span className="text-muted-foreground">Account number:</span> <span className="font-mono">{detail.accountNumber}</span></p>
                      <p><span className="text-muted-foreground">IBAN:</span> <span className="font-mono">{detail.iban ?? "—"}</span></p>
                      <p><span className="text-muted-foreground">Pay to:</span> {detail.accountHolder}</p>
                      <p><span className="text-muted-foreground">Amount to pay out:</span> {detail.currency} {Number(detail.amount).toFixed(2)}</p>
                    </div>
                    {detail.status === "pending" ? (
                      <>
                        <textarea className={`${field} min-h-16`} placeholder="Note (required when rejecting)" value={note} onChange={(e) => setNote(e.target.value)} />
                        <div className="flex gap-2">
                          <Button disabled={busy} onClick={() => decide("completed")} className="flex-1 h-10">Mark as paid</Button>
                          <Button disabled={busy || note.trim().length < 3} onClick={() => decide("rejected")} variant="outline" className="flex-1 h-10">Reject and return funds</Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Already {detail.status}{detail.reviewNote ? `: ${detail.reviewNote}` : ""}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
