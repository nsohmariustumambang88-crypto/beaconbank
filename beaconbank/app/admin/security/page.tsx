"use client"

import { AdminShell } from "@/components/admin-shell"
import { AdminList, Column } from "@/components/admin-list"

type Row = { id: string; eventType: string; status: string; riskScore: number; ipAddress: string | null; createdAt: string; user: { email: string } | null }

const columns: Column<Row>[] = [
  { label: "When", render: (r) => new Date(r.createdAt).toLocaleString() },
  { label: "Event", render: (r) => r.eventType.replace(/_/g, " ") },
  { label: "User", render: (r) => r.user?.email ?? "—" },
  { label: "Status", render: (r) => r.status },
  { label: "Risk", render: (r) => r.riskScore },
  { label: "IP", render: (r) => r.ipAddress ?? "—" },
]

export default function AdminSecurityPage() {
  return (
    <AdminShell title="Security log" description="Most recent 100 security events">
      <AdminList<Row> endpoint="/api/admin/security-logs" columns={columns} emptyText="No security events recorded." />
    </AdminShell>
  )
}
