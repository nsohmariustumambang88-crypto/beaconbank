"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { authHeaders, getToken } from "@/lib/session"

export type FormField = {
  name: string
  label: string
  type?: "text" | "email" | "number" | "select" | "textarea"
  options?: string[]
  required?: boolean
}

type Props = {
  title: string
  description: string
  endpoint: string
  fields: FormField[]
  submitLabel: string
  successMessage: string
  numberFields?: string[]
}

function readError(json: { error?: string; message?: string }) {
  if (json.error?.startsWith("{")) {
    try {
      return Object.values(JSON.parse(json.error)).join(". ")
    } catch {}
  }
  return json.error || json.message || "Something went wrong"
}

export function ServiceForm({ title, description, endpoint, fields, submitLabel, successMessage, numberFields = [] }: Props) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, f.type === "select" ? f.options?.[0] ?? "" : ""]))
  )
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!getToken()) router.replace("/login")
  }, [router])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    setLoading(true)
    try {
      const body = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, numberFields.includes(k) ? Number(v) : v])
      )
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setStatus({ kind: "ok", text: successMessage })
        setValues(Object.fromEntries(fields.map((f) => [f.name, f.type === "select" ? f.options?.[0] ?? "" : ""])))
      } else {
        setStatus({ kind: "error", text: readError(json) })
      }
    } catch {
      setStatus({ kind: "error", text: "Could not reach the server. Try again." })
    } finally {
      setLoading(false)
    }
  }

  const input = "w-full px-3 md:px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 touch-target"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-6 text-xs md:text-sm">
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Back to dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
            <CardDescription className="text-xs md:text-sm">{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              {fields.map((f) => (
                <div key={f.name} className="space-y-2">
                  <label htmlFor={f.name} className="text-xs md:text-sm font-medium">{f.label}</label>
                  {f.type === "select" ? (
                    <select id={f.name} className={input} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea id={f.name} className={`${input} min-h-24`} required={f.required} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
                  ) : (
                    <input id={f.name} type={f.type ?? "text"} step={f.type === "number" ? "0.01" : undefined} min={f.type === "number" ? "0.01" : undefined} required={f.required} className={input} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
                  )}
                </div>
              ))}
              {status && (
                <p className={`text-sm ${status.kind === "ok" ? "text-primary" : "text-destructive"}`}>{status.text}</p>
              )}
              <Button type="submit" disabled={loading} className="w-full h-10 md:h-11 text-sm md:text-base">
                {loading ? "Submitting…" : submitLabel}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
