"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AdminShell } from "@/components/admin-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authHeaders } from "@/lib/session"

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    fetch("/api/admin/overview", { headers: authHeaders() })
      .then((r) => r.json())
      .then((j) => j.success && setStats(j.data))
      .catch(() => {})
  }, [])

  const tiles = [
    { key: "users", label: "Users", href: "/admin/users" },
    { key: "transfers", label: "Transfers", href: "/admin/transfers" },
    { key: "pendingRefunds", label: "Pending refunds", href: "/admin/refunds" },
    { key: "openRecovery", label: "Open recovery cases", href: "/admin/recovery" },
    { key: "stores", label: "Marketplace stores", href: "/admin/stores" },
    { key: "articles", label: "Articles", href: "/admin/articles" },
  ]

  return (
    <AdminShell title="Admin overview" description="Everything you control, in one place">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <Link key={t.key} href={t.href}>
            <Card className="h-full hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="text-xs md:text-sm text-muted-foreground font-medium">{t.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stats ? stats[t.key] ?? 0 : "…"}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AdminShell>
  )
}
