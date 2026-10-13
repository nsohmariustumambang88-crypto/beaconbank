"use client"

import { AdminShell } from "@/components/admin-shell"
import { AdminList, Column } from "@/components/admin-list"

type Row = { id: string; storeName: string; storeSlug: string; status: string; totalSales: string; createdAt: string; user: { email: string; name: string } }

const columns: Column<Row>[] = [
  { label: "Store", render: (r) => <span>{r.storeName}<br /><span className="text-muted-foreground">/{r.storeSlug}</span></span> },
  { label: "Owner", render: (r) => <span>{r.user.name}<br /><span className="text-muted-foreground">{r.user.email}</span></span> },
  { label: "Sales", render: (r) => Number(r.totalSales).toFixed(2) },
  { label: "Created", render: (r) => new Date(r.createdAt).toLocaleDateString() },
]

export default function AdminStoresPage() {
  return (
    <AdminShell title="Marketplace stores" description="Activate, pause, or suspend seller stores">
      <AdminList<Row>
        endpoint="/api/admin/stores"
        columns={columns}
        statusOptions={["active", "inactive", "suspended"]}
        statusEndpoint="/api/admin/stores"
      />
    </AdminShell>
  )
}
