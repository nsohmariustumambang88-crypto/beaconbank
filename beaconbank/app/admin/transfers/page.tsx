"use client"

import { AdminShell } from "@/components/admin-shell"
import { AdminList, Column } from "@/components/admin-list"

type Row = { id: string; recipientEmail: string; amount: string; currency: string; fee: string; status: string; createdAt: string; sender: { email: string; name: string } }

const columns: Column<Row>[] = [
  { label: "Sender", render: (r) => <span>{r.sender.name}<br /><span className="text-muted-foreground">{r.sender.email}</span></span> },
  { label: "Recipient", render: (r) => r.recipientEmail },
  { label: "Amount", render: (r) => `${r.currency} ${Number(r.amount).toFixed(2)}` },
  { label: "Fee", render: (r) => Number(r.fee).toFixed(2) },
  { label: "Date", render: (r) => new Date(r.createdAt).toLocaleString() },
]

export default function AdminTransfersPage() {
  return (
    <AdminShell title="Transfers" description="Every transfer sent through BeaconBank">
      <AdminList<Row>
        endpoint="/api/admin/transfers"
        columns={columns}
        statusOptions={["pending", "processing", "completed", "failed", "cancelled"]}
        statusEndpoint="/api/admin/transfers"
      />
    </AdminShell>
  )
}
