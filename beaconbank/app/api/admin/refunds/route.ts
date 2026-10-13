import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/admin"
import { successResponse } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { denied } = await checkAdmin(request)
  if (denied) return denied
  const rows = await prisma.refund.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, originalOrderId: true, amount: true, currency: true, refundType: true, reason: true, status: true, createdAt: true, user: { select: { email: true, name: true } } } })
  return NextResponse.json(successResponse("Loaded", { rows }))
}
