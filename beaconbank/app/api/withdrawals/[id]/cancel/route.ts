import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { releaseHold } from "@/lib/withdrawal-ledger"
import { successResponse, errorResponse, unauthorizedError, notFoundError } from "@/lib/api-response"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = verifyToken(extractTokenFromHeader(request.headers.get("authorization")) ?? "")
  if (!payload) return NextResponse.json(unauthorizedError(), { status: 401 })
  const { id } = await params

  const w = await prisma.withdrawal.findFirst({ where: { id, userId: payload.userId } })
  if (!w) return NextResponse.json(notFoundError("Withdrawal"), { status: 404 })
  if (w.status !== "pending") {
    return NextResponse.json(errorResponse("Cannot cancel", "Only pending withdrawals can be cancelled"), { status: 409 })
  }

  await prisma.$transaction(async (tx) => {
    const claimed = await tx.withdrawal.updateMany({ where: { id, status: "pending" }, data: { status: "cancelled", reviewNote: "Cancelled by customer" } })
    if (claimed.count === 0) throw new Error("ALREADY")
    await releaseHold(tx, w, "cancelled by you")
  }).catch((e) => {
    if (e instanceof Error && e.message === "ALREADY") return
    throw e
  })

  return NextResponse.json(successResponse("Withdrawal cancelled and funds returned", { id, status: "cancelled" }))
}
