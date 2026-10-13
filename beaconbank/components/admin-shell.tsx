"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authHeaders, clearSession, getToken } from "@/lib/session"

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users & balances" },
  { href: "/admin/transfers", label: "Transfers" },
  { href: "/admin/refunds", label: "Refunds" },
  { href: "/admin/recovery", label: "Recovery" },
  { href: "/admin/stores", label: "Stores" },
  { href: "/admin/kyc", label: "Verification" },
  { href: "/admin/withdrawals", label: "Withdrawals" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/security", label: "Security log" },
]

export function AdminShell({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking")

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login")
      return
    }
    fetch("/api/admin/overview", { headers: authHeaders() }).then((r) => {
      if (r.status === 401) {
        clearSession()
        router.replace("/login")
      } else if (r.status === 403) {
        setState("denied")
      } else {
        setState("ok")
      }
    })
  }, [router])

  if (state === "checking") return <div className="p-8 text-sm text-muted-foreground">Checking access…</div>
  if (state === "denied") {
    return (
      <div className="p-8">
        <p className="text-sm text-destructive">You do not have admin access.</p>
        <Link href="/dashboard" className="text-primary text-sm">Back to dashboard</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
              {description && <p className="text-xs md:text-sm text-muted-foreground">{description}</p>}
            </div>
            <Link href="/dashboard" className="text-xs md:text-sm text-primary hover:underline flex-shrink-0">Customer view</Link>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {NAV.map((n) => {
              const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs md:text-sm border transition ${active ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">{children}</div>
    </div>
  )
}
