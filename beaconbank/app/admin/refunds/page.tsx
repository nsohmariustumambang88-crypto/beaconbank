"use client"

import { AdminShell } from "@/components/admin-shell"
import { AdminList, Column } from "@/components/admin-list"

type Row = { id: string; originalOrderId: string; amount: string; currency: string; refundType: string; reason: string; status: string; createdAt: string; user: { email: string; name: string } }

const columns: Column<Row>[] = [
  { label: "Customer", render: (r) => <span>{r.user.name}<br /><span className="text-muted-foreground">{r.user.email}</span></span> },
  { label: "Order", render: (r) => r.originalOrderId },
  { label: "Amount", render: (r) => `${r.currency} ${Number(r.amount).toFixed(2)}` },
  { label: "Type", render: (r) => r.refundType.replace(/_/g, " ") },
  { label: "Reason", render: (r) => <span className="max-w-xs block">{r.reason}</span> },
  { label: "Date", render: (r) => new Date(r.createdAt).toLocaleDateString() },
]

export default function AdminRefundsPage() {
  return (
    <AdminShell title="Refunds" description="Approve, process, or reject refund requests">
      <AdminList<Row>
        endpoint="/api/admin/refunds"
        columns={columns}
        statusOptions={["pending", "approved", "processing", "completed", "rejected"]}
        statusEndpoint="/api/admin/refunds"
      />
    </AdminShell>
  )
}
