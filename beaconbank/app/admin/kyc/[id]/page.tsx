import { Suspense } from "react"
import { connection } from "next/server"
import { AdminKycDetail } from "@/components/admin-kyc-detail"

async function Loader({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  return <AdminKycDetail id={id} />
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Loading…</p>}>
      <Loader params={params} />
    </Suspense>
  )
}
