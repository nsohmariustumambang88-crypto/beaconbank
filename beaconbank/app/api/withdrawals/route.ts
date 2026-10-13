import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { encryptText } from "@/lib/crypto"
import { kycBlock } from "@/lib/kyc"
import { validateWithdrawal, withdrawalFee } from "@/lib/withdrawals"
import { successResponse, errorResponse, unauthorizedError, validationError } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  const payload = verifyToken(extractTokenFromHeader(request.headers.get("authorization")) ?? "")
  if (!payload) return NextResponse.json(unauthorizedError(), { status: 401 })
  const rows = await prisma.withdrawal.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, amount: true, fee: true, currency: true, bankName: true, accountLast4: true, status: true, reviewNote: true, createdAt: true },
  })
  return NextResponse.json(successResponse("Withdrawals", { rows }))
}

export async function POST(request: NextRequest) {
  const payload = verifyToken(extractTokenFromHeader(request.headers.get("authorization")) ?? "")
  if (!payload) return NextResponse.json(unauthorizedError(), { status: 401 })

  const blocked = await kycBlock(payload.userId)
  if (blocked) return blocked

  const body = await request.json()
  const { errors, cleaned } = validateWithdrawal(body)
  if (Object.keys(errors).length > 0) return NextResponse.json(validationError(errors), { status: 422 })

  const fee = withdrawalFee(cleaned.amount)
  const total = (Math.round((cleaned.amount + fee) * 100) / 100).toFixed(2)

  const wallet = await prisma.wallet.findUnique({ where: { userId_currency: { userId: payload.userId, currency: cleaned.currency } } })
  if (!wallet) return NextResponse.json(errorResponse("No account", `You have no ${cleaned.currency} account`), { status: 400 })

  try {
    const withdrawal = await prisma.$transaction(async (tx) => {
      const held = await tx.wallet.updateMany({
        where: { id: wallet.id, balance: { gte: total } },
        data: { balance: { decrement: total } },
      })
      if (held.count === 0) throw new Error("INSUFFICIENT")

      const w = await tx.withdrawal.create({
        data: {
          userId: payload.userId,
          walletId: wallet.id,
          amount: cleaned.amount.toFixed(2),
          fee: fee.toFixed(2),
          currency: cleaned.currency,
          bankName: cleaned.bankName,
          accountHolder: cleaned.accountHolder,
          accountLast4: cleaned.account.slice(-4),
          accountNumberEnc: encryptText(cleaned.account),
          iban: cleaned.iban,
          status: "pending",
        },
      })
      await tx.transaction.create({
        data: {
          userId: payload.userId,
          walletId: wallet.id,
          type: "withdrawal",
          amount: total,
          currency: cleaned.currency,
          status: "pending",
          description: `Withdrawal to ${cleaned.bankName} ••••${cleaned.account.slice(-4)}`,
          referenceId: w.id,
        },
      })
      return w
    })
    return NextResponse.json(
      successResponse("Withdrawal requested", {
        withdrawal: { id: withdrawal.id, status: withdrawal.status, amount: withdrawal.amount.toString(), fee: withdrawal.fee.toString(), total },
      }),
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT") {
      return NextResponse.json(errorResponse("Insufficient balance", `You need ${total} ${cleaned.currency} including the fee`), { status: 400 })
    }
    console.error("Withdrawal error:", error)
    return NextResponse.json(errorResponse("Could not request withdrawal", "Internal server error"), { status: 500 })
  }
}
