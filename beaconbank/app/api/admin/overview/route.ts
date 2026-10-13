import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/admin"
import { successResponse } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { denied } = await checkAdmin(request)
  if (denied) return denied
  const [users, transfers, refunds, openRecovery, stores, articles] = await Promise.all([
    prisma.user.count(),
    prisma.transfer.count(),
    prisma.refund.count({ where: { status: "pending" } }),
    prisma.fundRecovery.count({ where: { status: { in: ["open", "investigating"] } } }),
    prisma.marketplaceStore.count(),
    prisma.article.count(),
  ])
  return NextResponse.json(successResponse("Overview", { users, transfers, pendingRefunds: refunds, openRecovery, stores, articles }))
}
