import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/admin"
import { decryptText } from "@/lib/crypto"
import { completeHold, releaseHold } from "@/lib/withdrawal-ledger"
import { successResponse, errorResponse, notFoundError, validationError } from "@/lib/api-response"

type Params = { params: Promise<{ id: string }> }

// Admin view: includes the full account number so the payout can be made.
export async function GET(request: NextRequest, { params }: Params) {
  const { admin, denied } = await checkAdmin(request)
  if (denied) return denied
  const { id } = await params
  const w = await prisma.withdrawal.findUnique({
    where: { id },
    include: { user: { select: { email: true, name: true } } },
  })
  if (!w) return NextResponse.json(notFoundError("Withdrawal"), { status: 404 })
  await prisma.securityLog.create({
    data: { userId: w.userId, eventType: "withdrawal_details_viewed", status: "success", details: { withdrawalId: id, viewedBy: admin!.email } },
  })
  return NextResponse.json(successResponse("Loaded", {
    withdrawal: {
      id: w.id, status: w.status, amount: w.amount.toString(), fee: w.fee.toString(), currency: w.currency,
      bankName: w.bankName, accountHolder: w.accountHolder, accountNumber: decryptText(w.accountNumberEnc), iban: w.iban,
      reviewNote: w.reviewNote, reviewedBy: w.reviewedBy, reviewedAt: w.reviewedAt, createdAt: w.createdAt,
      user: w.user,
    },
  }))
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { admin, denied } = await checkAdmin(request)
  if (denied) return denied
  const { id } = await params
  const body = await request.json()
  const decision = body.decision
  const note = typeof body.note === "string" ? body.note.trim() : ""
  if (!["completed", "rejected"].includes(decision)) {
    return NextResponse.json(validationError({ decision: "Choose paid or reject" }), { status: 422 })
  }
  if (decision === "rejected" && note.length < 3) {
    return NextResponse.json(validationError({ note: "Give the customer a reason for rejecting" }), { status: 422 })
  }

  const w = await prisma.withdrawal.findUnique({ where: { id } })
  if (!w) return NextResponse.json(notFoundError("Withdrawal"), { status: 404 })
  if (w.status !== "pending") {
    return NextResponse.json(errorResponse("Already processed", `This withdrawal is already ${w.status}`), { status: 409 })
  }

  try {
    await prisma.$transaction(async (tx) => {
      const claimed = await tx.withdrawal.updateMany({
        where: { id, status: "pending" },
        data: { status: decision, reviewNote: note || null, reviewedBy: admin!.email, reviewedAt: new Date() },
      })
      if (claimed.count === 0) throw new Error("ALREADY")
      if (decision === "rejected") await releaseHold(tx, w, note)
      else await completeHold(tx, w)
      await tx.securityLog.create({
        data: {
          userId: w.userId,
          eventType: decision === "completed" ? "withdrawal_paid" : "withdrawal_rejected",
          status: "success",
          details: { withdrawalId: id, reviewedBy: admin!.email, note: note || null },
        },
      })
    })
    return NextResponse.json(successResponse("Withdrawal " + decision, { id, status: decision }))
  } catch (error) {
    if (error instanceof Error && error.message === "ALREADY") {
      return NextResponse.json(errorResponse("Already processed", "This withdrawal was just processed"), { status: 409 })
    }
    throw error
  }
}
