import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/admin"
import { generateAccountNumber, generateRoutingNumber } from "@/lib/auth"
import { successResponse, errorResponse, notFoundError, validationError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { admin, denied } = await checkAdmin(request)
  if (denied) return denied
  const { id } = await params
  const body = await request.json()

  const errors: Record<string, string> = {}
  const target = Number(body.balance)
  if (!Number.isFinite(target) || target < 0) errors.balance = "Balance must be 0 or more"
  if (target > 1_000_000_000) errors.balance = "Balance is too large"
  if (!["USD", "EUR", "GBP"].includes(body.currency)) errors.currency = "Choose a currency"
  if (!body.reason || String(body.reason).trim().length < 3) errors.reason = "Give a short reason for the change"
  if (Object.keys(errors).length > 0) return NextResponse.json(validationError(errors), { status: 422 })

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
  if (!user) return NextResponse.json(notFoundError("User"), { status: 404 })

  const newValue = target.toFixed(2)
  const reason = String(body.reason).trim()

  const result = await prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId_currency: { userId: id, currency: body.currency } } })
    if (!wallet) {
      wallet = await tx.wallet.create({
        data: { userId: id, currency: body.currency, balance: 0, accountNumber: generateAccountNumber(), routingNumber: generateRoutingNumber() },
      })
    }
    const current = Number(wallet.balance)
    const diff = Number((target - current).toFixed(2))
    if (diff === 0) return { wallet, changed: false }

    await tx.wallet.update({ where: { id: wallet.id }, data: { balance: newValue } })
    await tx.transaction.create({
      data: {
        userId: id,
        walletId: wallet.id,
        type: diff > 0 ? "admin_credit" : "admin_debit",
        amount: Math.abs(diff).toFixed(2),
        currency: body.currency,
        status: "completed",
        description: `Balance set to ${newValue}: ${reason}`,
        metadata: { adminId: admin!.id, adminEmail: admin!.email, setTo: newValue, previous: current.toFixed(2) },
      },
    })
    return { wallet: { ...wallet, balance: newValue }, changed: true }
  })

  return NextResponse.json(successResponse(result.changed ? "Balance updated" : "No change", { wallet: result.wallet }))
}
