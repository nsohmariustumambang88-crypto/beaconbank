"use client"

import { AdminShell } from "@/components/admin-shell"
import { AdminList, Column } from "@/components/admin-list"

type UserRow = { id: string; email: string; name: string; role: string; accountType: string; createdAt: string; wallets: { currency: string; balance: string }[] }

const columns: Column<UserRow>[] = [
  { label: "Name", render: (u) => u.name },
  { label: "Email / username", render: (u) => <span className="break-all">{u.email}</span> },
  { label: "Role", render: (u) => u.role },
  { label: "Balances", render: (u) => (u.wallets.length ? u.wallets.map((w) => `${w.currency} ${Number(w.balance).toFixed(2)}`).join(" · ") : "No account") },
  { label: "Joined", render: (u) => new Date(u.createdAt).toLocaleDateString() },
]

export default function AdminUsersPage() {
  return (
    <AdminShell title="Users & balances" description="Open a user to see their history and add or remove funds">
      <AdminList<UserRow> endpoint="/api/admin/users" dataKey="users" columns={columns} rowHref={(u) => `/admin/users/${u.id}`} />
    </AdminShell>
  )
}
