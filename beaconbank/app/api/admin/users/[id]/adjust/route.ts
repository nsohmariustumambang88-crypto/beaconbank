import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/admin"
import { generateAccountNumber, generateRoutingNumber } from "@/lib/auth"
import { successResponse, errorResponse, notFoundError, validationError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

class InsufficientFunds extends Error {}

export async function POST(request: NextRequest, { params }: Params) {
  const { admin, denied } = await checkAdmin(request)
  if (denied) return denied
  const { id } = await params
  const body = await request.json()

  const errors: Record<string, string> = {}
  const amount = Number(body.amount)
  if (!["credit", "debit"].includes(body.direction)) errors.direction = "Choose credit or debit"
  if (!Number.isFinite(amount) || amount <= 0) errors.amount = "Amount must be greater than 0"
  if (amount > 1_000_000_000) errors.amount = "Amount is too large"
  if (!["USD", "EUR", "GBP"].includes(body.currency)) errors.currency = "Choose a currency"
  if (!body.reason || String(body.reason).trim().length < 3) errors.reason = "Give a short reason for the change"
  if (Object.keys(errors).length > 0) return NextResponse.json(validationError(errors), { status: 422 })

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
  if (!user) return NextResponse.json(notFoundError("User"), { status: 404 })

  const value = amount.toFixed(2)
  try {
    const result = await prisma.$transaction(async (tx) => {
      let wallet = await tx.wallet.findUnique({ where: { userId_currency: { userId: id, currency: body.currency } } })
      if (!wallet) {
        if (body.direction === "debit") throw new InsufficientFunds("This user has no " + body.currency + " account")
        wallet = await tx.wallet.create({
          data: { userId: id, currency: body.currency, balance: 0, accountNumber: generateAccountNumber(), routingNumber: generateRoutingNumber() },
        })
      }

      if (body.direction === "debit") {
        const debited = await tx.wallet.updateMany({
          where: { id: wallet.id, balance: { gte: value } },
          data: { balance: { decrement: value } },
        })
        if (debited.count === 0) throw new InsufficientFunds("Balance is too low for this debit")
      } else {
        await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: value } } })
      }

      await tx.transaction.create({
        data: {
          userId: id,
          walletId: wallet.id,
          type: body.direction === "credit" ? "admin_credit" : "admin_debit",
          amount: value,
          currency: body.currency,
          status: "completed",
          description: String(body.reason).trim(),
          metadata: { adminId: admin!.id, adminEmail: admin!.email },
        },
      })

      return tx.wallet.findUnique({ where: { id: wallet.id }, select: { id: true, currency: true, balance: true } })
    })
    return NextResponse.json(successResponse("Balance updated", { wallet: result }))
  } catch (error) {
    if (error instanceof InsufficientFunds) {
      return NextResponse.json(errorResponse("Could not update balance", error.message), { status: 400 })
    }
    console.error("Adjust balance error:", error)
    return NextResponse.json(errorResponse("Could not update balance", "Internal server error"), { status: 500 })
  }
}
