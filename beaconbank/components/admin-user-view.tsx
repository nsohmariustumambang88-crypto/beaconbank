"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authHeaders } from "@/lib/session"

type Wallet = { id: string; currency: string; balance: string; accountNumber: string }
type Tx = { id: string; type: string; amount: string; currency: string; status: string; description: string | null; createdAt: string }
type UserDetail = {
  id: string; email: string; name: string; phone: string | null; role: string; accountType: string; kycStatus: string; createdAt: string
  wallets: Wallet[]; transactions: Tx[]
}

function readError(error?: string) {
  if (!error) return "Could not update balance"
  if (error.startsWith("{")) {
    try { return Object.values(JSON.parse(error)).join(". ") } catch {}
  }
  return error
}

const field = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"

export function AdminUserView({ id }: { id: string }) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ currency: "USD", direction: "credit", amount: "", reason: "" })
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  async function load() {
    const r = await fetch(`/api/admin/users/${id}`, { headers: authHeaders() })
    const j = await r.json()
    if (!r.ok || !j.success) {
      setError(j.error || "Could not load user")
      return
    }
    setUser(j.data.user)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    setSaving(true)
    try {
      const r = await fetch(`/api/admin/users/${id}/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      })
      const j = await r.json()
      if (!r.ok || !j.success) {
        setMessage(readError(j.error))
        return
      }
      setMessage(`Done. New ${j.data.wallet.currency} balance: ${Number(j.data.wallet.balance).toFixed(2)}`)
      setForm({ ...form, amount: "", reason: "" })
      load()
    } catch {
      setMessage("Could not reach the server")
    } finally {
      setSaving(false)
    }
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>
  if (!user) return <p className="text-sm text-muted-foreground">Loading…</p>

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="text-sm text-primary hover:underline">← All users</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{user.name}</CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground break-all">{user.email} · {user.phone ?? "no phone"} · {user.role} · KYC {user.kycStatus}</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.wallets.length === 0 && <p className="text-sm text-muted-foreground">No accounts yet. Adding funds will create a {form.currency} account.</p>}
            {user.wallets.map((w) => (
              <div key={w.id} className="rounded-lg bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">{w.currency} account · {w.accountNumber}</p>
                <p className="text-xl md:text-2xl font-bold text-foreground">{Number(w.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Add or remove funds</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              <select className={field} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option>USD</option><option>EUR</option><option>GBP</option>
              </select>
              <select className={field} value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}>
                <option value="credit">Add funds (credit)</option>
                <option value="debit">Remove funds (debit)</option>
              </select>
              <input className={field} type="number" min="0.01" step="0.01" placeholder="Amount" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <input className={field} placeholder="Reason (shown in history)" required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
              <Button type="submit" disabled={saving} className="w-full h-10">{saving ? "Saving…" : "Apply change"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Transaction history</CardTitle>
        </CardHeader>
        <CardContent>
          {user.transactions.length === 0 && <p className="text-sm text-muted-foreground">No transactions yet.</p>}
          {user.transactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-2 pr-3 font-medium">Date</th>
                    <th className="py-2 pr-3 font-medium">Type</th>
                    <th className="py-2 pr-3 font-medium">Amount</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {user.transactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50">
                      <td className="py-2 pr-3 whitespace-nowrap">{new Date(t.createdAt).toLocaleString()}</td>
                      <td className="py-2 pr-3">{t.type.replace(/_/g, " ")}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{t.currency} {Number(t.amount).toFixed(2)}</td>
                      <td className="py-2 pr-3">{t.status}</td>
                      <td className="py-2">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
