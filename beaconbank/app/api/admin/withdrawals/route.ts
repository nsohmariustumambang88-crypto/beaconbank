import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/admin"
import { successResponse } from "@/lib/api-response"

const STATUSES = ["pending", "completed", "rejected", "cancelled"]

export async function GET(request: NextRequest) {
  const { denied } = await checkAdmin(request)
  if (denied) return denied
  const status = request.nextUrl.searchParams.get("status")
  const rows = await prisma.withdrawal.findMany({
    where: status && STATUSES.includes(status) ? { status } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true, amount: true, fee: true, currency: true, bankName: true, accountHolder: true, accountLast4: true,
      status: true, createdAt: true, reviewedAt: true, user: { select: { email: true, name: true } },
    },
  })
  return NextResponse.json(successResponse("Loaded", { rows }))
}
