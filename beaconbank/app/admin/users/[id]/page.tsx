import { Suspense } from "react"
import { connection } from "next/server"
import { AdminShell } from "@/components/admin-shell"
import { AdminUserView } from "@/components/admin-user-view"

async function UserLoader({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  return (
    <AdminShell title="User account" description="Balances, transaction history, and manual adjustments">
      <AdminUserView id={id} />
    </AdminShell>
  )
}

export default function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Loading…</p>}>
      <UserLoader params={params} />
    </Suspense>
  )
}
