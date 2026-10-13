"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminShell } from "@/components/admin-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authHeaders } from "@/lib/session"

type Detail = {
  id: string; status: string; reviewNote: string | null; reviewedAt: string | null; createdAt: string
  fullName: string; dateOfBirth: string; country: string; addressLine: string; city: string; postalCode: string
  idType: string; idNumberLast4: string; idDocumentUrl: string; selfieUrl: string
  user: { id: string; email: string; name: string; kycStatus: string }
}

const field = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"

export function AdminKycDetail({ id }: { id: string }) {
  const [item, setItem] = useState<Detail | null>(null)
  const [error, setError] = useState("")
  const [note, setNote] = useState("")
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  async function load() {
    const r = await fetch(`/api/admin/kyc/${id}`, { headers: authHeaders() })
    const j = await r.json()
    if (!r.ok || !j.success) {
      setError(j.error || "Could not load")
      return
    }
    setItem(j.data.submission)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function decide(decision: "approved" | "rejected") {
    setMessage("")
    setSaving(true)
    try {
      const r = await fetch(`/api/admin/kyc/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ decision, note }),
      })
      const j = await r.json()
      if (!r.ok || !j.success) {
        const err = j.error?.startsWith("{") ? Object.values(JSON.parse(j.error)).join(". ") : j.error
        setMessage(err || "Could not save decision")
        return
      }
      setMessage(decision === "approved" ? "Approved. The customer can now send money." : "Rejected. The customer has been told the reason.")
      load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell title="Review verification" description="Compare the documents with the details the customer entered">
      <Link href="/admin/kyc" className="text-sm text-primary hover:underline">← All verifications</Link>
      {error && <p className="text-sm text-destructive mt-4">{error}</p>}
      {!item && !error && <p className="text-sm text-muted-foreground mt-4">Loading…</p>}
      {item && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">{item.fullName}</CardTitle>
              <p className="text-xs text-muted-foreground break-all">{item.user.email} · account status: {item.user.kycStatus}</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p><span className="text-muted-foreground">Date of birth:</span> {item.dateOfBirth}</p>
              <p><span className="text-muted-foreground">Country:</span> {item.country}</p>
              <p className="sm:col-span-2"><span className="text-muted-foreground">Address:</span> {item.addressLine}, {item.city} {item.postalCode}</p>
              <p><span className="text-muted-foreground">ID type:</span> {item.idType.replace(/_/g, " ")}</p>
              <p><span className="text-muted-foreground">ID number ends in:</span> {item.idNumberLast4}</p>
              <p><span className="text-muted-foreground">Submitted:</span> {new Date(item.createdAt).toLocaleString()}</p>
              <p><span className="text-muted-foreground">Status:</span> {item.status}{item.reviewNote ? ` · ${item.reviewNote}` : ""}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.status !== "pending" ? (
                <p className="text-sm text-muted-foreground">This verification was already {item.status}.</p>
              ) : (
                <>
                  <textarea className={`${field} min-h-20`} placeholder="Note for the customer (required when rejecting)" value={note} onChange={(e) => setNote(e.target.value)} />
                  <div className="flex gap-2">
                    <Button disabled={saving} onClick={() => decide("approved")} className="flex-1 h-10">Approve</Button>
                    <Button disabled={saving || note.trim().length < 3} onClick={() => decide("rejected")} variant="outline" className="flex-1 h-10">Reject</Button>
                  </div>
                </>
              )}
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">ID document</p>
                <img src={item.idDocumentUrl} alt="Submitted ID document" className="w-full rounded-lg border border-border bg-muted/30" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Selfie with ID</p>
                <img src={item.selfieUrl} alt="Submitted selfie holding ID" className="w-full rounded-lg border border-border bg-muted/30" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminShell>
  )
}
