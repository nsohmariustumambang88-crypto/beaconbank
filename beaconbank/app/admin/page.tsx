"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authHeaders, clearSession, getToken } from "@/lib/session"

type AdminUser = { id: string; email: string; name: string; role: string; accountType: string; createdAt: string }

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[] | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login")
      return
    }
    fetch("/api/admin/users", { headers: authHeaders() })
      .then(async (r) => {
        if (r.status === 401) {
          clearSession()
          router.replace("/login")
          return
        }
        if (r.status === 403) {
          setError("You do not have admin access.")
          return
        }
        const j = await r.json()
        setUsers(j.data.users)
      })
      .catch(() => setError("Could not load users."))
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Admin</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Manage users and content</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/articles"><Button size="sm" className="h-9 md:h-10 text-xs md:text-sm">Articles</Button></Link>
            <Link href="/dashboard"><Button size="sm" variant="outline" className="h-9 md:h-10 text-xs md:text-sm">Dashboard</Button></Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {error && <p className="text-sm text-destructive mb-4">{error}</p>}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Users {users ? `(${users.length})` : ""}</CardTitle>
          </CardHeader>
          <CardContent>
            {!users && !error && <p className="text-sm text-muted-foreground">Loading…</p>}
            {users && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-border">
                      <th className="py-2 pr-4 font-medium">Name</th>
                      <th className="py-2 pr-4 font-medium">Email / username</th>
                      <th className="py-2 pr-4 font-medium">Role</th>
                      <th className="py-2 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground">{u.name}</td>
                        <td className="py-2 pr-4 text-foreground break-all">{u.email}</td>
                        <td className="py-2 pr-4">{u.role}</td>
                        <td className="py-2 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
