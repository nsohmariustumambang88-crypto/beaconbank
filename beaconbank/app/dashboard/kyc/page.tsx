"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { authHeaders, getToken } from "@/lib/session"

type Status = {
  kycStatus: string
  required: boolean
  submission: { status: string; reviewNote: string | null; createdAt: string } | null
}

const input = "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"

const EMPTY_FORM = { fullName: "", dateOfBirth: "", country: "", addressLine: "", city: "", postalCode: "", idType: "passport", idNumber: "" }

function readError(j: { error?: string; message?: string }) {
  if (j.error?.startsWith("{")) {
    try {
      return Object.values(JSON.parse(j.error)).join(". ")
    } catch {}
  }
  return j.error || j.message || "Something went wrong"
}

export default function KycPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [docs, setDocs] = useState({ idDocumentId: "", selfieId: "" })
  const [uploading, setUploading] = useState<"id" | "selfie" | null>(null)
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const r = await fetch("/api/kyc/status", { headers: authHeaders() })
    if (r.status === 401) {
      router.replace("/login")
      return
    }
    const j = await r.json()
    if (j.success) setStatus(j.data)
  }

  useEffect(() => {
    if (!getToken()) router.replace("/login")
    else load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  async function upload(kind: "id" | "selfie", file: File | undefined) {
    if (!file) return
    setMessage(null)
    setUploading(kind)
    const body = new FormData()
    body.append("file", file)
    body.append("kind", kind)
    try {
      const r = await fetch("/api/kyc/upload", { method: "POST", headers: authHeaders(), body })
      const j = await r.json()
      if (!r.ok || !j.success) {
        setMessage({ kind: "error", text: readError(j) })
        return
      }
      setDocs((d) => ({ ...d, [kind === "id" ? "idDocumentId" : "selfieId"]: j.data.publicId }))
    } catch {
      setMessage({ kind: "error", text: "Upload failed. Check your connection and try again." })
    } finally {
      setUploading(null)
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setSubmitting(true)
    try {
      const r = await fetch("/api/kyc/status", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ...form, ...docs }),
      })
      const j = await r.json()
      if (!r.ok || !j.success) {
        setMessage({ kind: "error", text: readError(j) })
        return
      }
      setMessage({ kind: "ok", text: "Submitted. We will review it and let you know." })
      setForm(EMPTY_FORM)
      setDocs({ idDocumentId: "", selfieId: "" })
      load()
    } catch {
      setMessage({ kind: "error", text: "Could not reach the server. Try again." })
    } finally {
      setSubmitting(false)
    }
  }

  const sub = status?.submission
  const verified = status?.kycStatus === "verified"
  const pending = sub?.status === "pending"
  const rejected = !verified && sub?.status === "rejected"
  const canSubmit = !verified && !pending

  const description = verified
    ? "Your identity is verified. You can send money."
    : pending
      ? "Your details are under review. This usually takes one business day."
      : rejected
        ? "Your last submission was not approved. Correct the details below and submit again."
        : "Verify your identity before sending money. Your documents are stored privately."

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-xs md:text-sm">
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Back to dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Identity verification</CardTitle>
            <CardDescription className="text-xs md:text-sm">{description}</CardDescription>
          </CardHeader>
          {rejected && sub?.reviewNote && (
            <CardContent>
              <p className="text-sm text-destructive">Reason: {sub.reviewNote}</p>
            </CardContent>
          )}
        </Card>

        {canSubmit && (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-xs md:text-sm font-medium">Full legal name</label>
                  <input id="fullName" required className={input} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="dob" className="text-xs md:text-sm font-medium">Date of birth</label>
                    <input id="dob" type="date" required className={input} value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="country" className="text-xs md:text-sm font-medium">Country</label>
                    <input id="country" required className={input} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="addressLine" className="text-xs md:text-sm font-medium">Street address</label>
                  <input id="addressLine" required className={input} value={form.addressLine} onChange={(e) => setForm({ ...form, addressLine: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-xs md:text-sm font-medium">City</label>
                    <input id="city" required className={input} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="text-xs md:text-sm font-medium">Postal code</label>
                    <input id="postalCode" required className={input} value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="idType" className="text-xs md:text-sm font-medium">ID type</label>
                    <select id="idType" className={input} value={form.idType} onChange={(e) => setForm({ ...form, idType: e.target.value })}>
                      <option value="passport">Passport</option>
                      <option value="national_id">National ID card</option>
                      <option value="drivers_license">Driver&apos;s license</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="idNumber" className="text-xs md:text-sm font-medium">ID number</label>
                    <input id="idNumber" required className={input} value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="idFile" className="text-xs md:text-sm font-medium">Photo of your ID (JPG, PNG or WEBP, max 5 MB)</label>
                  <input id="idFile" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" onChange={(e) => upload("id", e.target.files?.[0])} />
                  {docs.idDocumentId && <p className="text-xs text-primary">ID uploaded</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="selfieFile" className="text-xs md:text-sm font-medium">Selfie holding your ID (JPG, PNG or WEBP, max 5 MB)</label>
                  <input id="selfieFile" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" onChange={(e) => upload("selfie", e.target.files?.[0])} />
                  {docs.selfieId && <p className="text-xs text-primary">Selfie uploaded</p>}
                </div>
                {uploading && <p className="text-xs text-muted-foreground">Uploading {uploading === "id" ? "ID" : "selfie"}…</p>}
                {message && <p className={`text-sm ${message.kind === "ok" ? "text-primary" : "text-destructive"}`}>{message.text}</p>}
                <Button type="submit" disabled={submitting || !docs.idDocumentId || !docs.selfieId || Boolean(uploading)} className="w-full h-10">
                  {submitting ? "Submitting…" : "Submit for review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {!canSubmit && message && <p className={`text-sm ${message.kind === "ok" ? "text-primary" : "text-destructive"}`}>{message.text}</p>}
      </div>
    </div>
  )
}
