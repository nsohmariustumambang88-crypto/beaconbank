"use client"

import { ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { authHeaders } from "@/lib/session"

export type Column<T> = { label: string; render: (row: T) => ReactNode; className?: string }

type Props<T extends { id: string }> = {
  endpoint: string
  dataKey?: string
  columns: Column<T>[]
  searchable?: boolean
  statusOptions?: string[]
  statusEndpoint?: string
  rowHref?: (row: T) => string
  emptyText?: string
}

export function AdminList<T extends { id: string }>({
  endpoint,
  dataKey = "rows",
  columns,
  searchable = true,
  statusOptions,
  statusEndpoint,
  rowHref,
  emptyText = "Nothing here yet.",
}: Props<T>) {
  const [rows, setRows] = useState<T[] | null>(null)
  const [query, setQuery] = useState("")
  const [message, setMessage] = useState("")

  async function load() {
    try {
      const r = await fetch(endpoint, { headers: authHeaders() })
      const j = await r.json()
      if (!r.ok || !j.success) {
        setMessage(j.error || "Could not load")
        setRows([])
        return
      }
      setRows(j.data[dataKey])
    } catch {
      setMessage("Could not reach the server")
      setRows([])
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint])

  async function changeStatus(row: T, status: string) {
    setMessage("")
    const r = await fetch(`${statusEndpoint}/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ status }),
    })
    const j = await r.json()
    if (!r.ok || !j.success) {
      setMessage(j.error || "Could not update status")
      return
    }
    setMessage("Status updated")
    load()
  }

  const q = query.trim().toLowerCase()
  const visible = rows?.filter((row) => !q || JSON.stringify(row).toLowerCase().includes(q)) ?? []

  return (
    <div className="space-y-4">
      {searchable && (
        <input
          type="search"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      )}
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      {rows === null && <p className="text-sm text-muted-foreground">Loading…</p>}
      {rows !== null && visible.length === 0 && <p className="text-sm text-muted-foreground">{emptyText}</p>}
      {visible.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border bg-muted/40">
                {columns.map((c) => (
                  <th key={c.label} className="py-2.5 px-3 font-medium whitespace-nowrap">{c.label}</th>
                ))}
                {statusOptions && <th className="py-2.5 px-3 font-medium">Status</th>}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className="border-b border-border/50 align-top">
                  {columns.map((c) => (
                    <td key={c.label} className={`py-2.5 px-3 ${c.className ?? ""}`}>
                      {rowHref && c === columns[0] ? <Link href={rowHref(row)} className="text-primary hover:underline">{c.render(row)}</Link> : c.render(row)}
                    </td>
                  ))}
                  {statusOptions && (
                    <td className="py-2.5 px-3">
                      <select
                        className="px-2 py-1 rounded-md border border-border bg-background text-xs"
                        value={(row as unknown as { status: string }).status}
                        onChange={(e) => changeStatus(row, e.target.value)}
                      >
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
