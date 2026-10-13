"use client"

import { useState } from "react"
import { AdminShell } from "@/components/admin-shell"
import { AdminList, Column } from "@/components/admin-list"

type Row = { id: string; fullName: string; country: string; idType: string; status: string; createdAt: string; user: { email: string } }

const columns: Column<Row>[] = [
  { label: "Name", render: (r) => <span>{r.fullName}<br /><span className="text-muted-foreground">{r.user.email}</span></span> },
  { label: "Country", render: (r) => r.country },
  { label: "ID type", render: (r) => r.idType.replace(/_/g, " ") },
  { label: "Status", render: (r) => r.status },
  { label: "Submitted", render: (r) => new Date(r.createdAt).toLocaleString() },
]

const FILTERS = ["pending", "approved", "rejected", "all"] as const

export default function AdminKycPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("pending")
  return (
    <AdminShell title="Identity verification" description="Review submitted identity documents">
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm border capitalize ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <AdminList<Row>
        key={filter}
        endpoint={filter === "all" ? "/api/admin/kyc" : `/api/admin/kyc?status=${filter}`}
        columns={columns}
        rowHref={(r) => `/admin/kyc/${r.id}`}
        emptyText="No verifications in this list."
      />
    </AdminShell>
  )
}
