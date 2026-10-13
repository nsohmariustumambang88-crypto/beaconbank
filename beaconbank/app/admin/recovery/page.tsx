"use client"

import { AdminShell } from "@/components/admin-shell"
import { AdminList, Column } from "@/components/admin-list"

type Row = { id: string; caseNumber: string; fraudType: string; amount: string; currency: string; severity: string; status: string; description: string; createdAt: string; user: { email: string; name: string } }

const columns: Column<Row>[] = [
  { label: "Case", render: (r) => r.caseNumber },
  { label: "Customer", render: (r) => <span>{r.user.name}<br /><span className="text-muted-foreground">{r.user.email}</span></span> },
  { label: "Issue", render: (r) => r.fraudType.replace(/_/g, " ") },
  { label: "Amount", render: (r) => `${r.currency} ${Number(r.amount).toFixed(2)}` },
  { label: "Severity", render: (r) => r.severity },
  { label: "Details", render: (r) => <span className="max-w-xs block">{r.description}</span> },
  { label: "Opened", render: (r) => new Date(r.createdAt).toLocaleDateString() },
]

export default function AdminRecoveryPage() {
  return (
    <AdminShell title="Fund recovery" description="Track and close recovery cases">
      <AdminList<Row>
        endpoint="/api/admin/recovery"
        columns={columns}
        statusOptions={["open", "investigating", "recovered", "closed", "rejected"]}
        statusEndpoint="/api/admin/recovery"
      />
    </AdminShell>
  )
}
