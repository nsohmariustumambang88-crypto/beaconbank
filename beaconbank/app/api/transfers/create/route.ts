import { prisma } from "@/lib/prisma"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { successResponse, errorResponse, unauthorizedError, validationError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"
import { requiresKyc } from "@/lib/kyc"

interface CreateTransferRequest {
  recipientEmail: string
  amount: number
  currency: string
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return NextResponse.json(unauthorizedError(), { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(unauthorizedError(), { status: 401 })
    }

    if (requiresKyc()) {
      const me = await prisma.user.findUnique({ where: { id: payload.userId }, select: { kycStatus: true } })
      if (me?.kycStatus !== "verified") {
        return NextResponse.json(
          errorResponse("Verification required", "Verify your identity in the Verification page before sending money"),
          { status: 403 }
        )
      }
    }

    const body: CreateTransferRequest = await request.json()

    // Validation
    const errors: Record<string, string> = {}
    if (!body.recipientEmail) errors.recipientEmail = "Recipient email is required"
    if (!body.amount || body.amount <= 0) errors.amount = "Amount must be greater than 0"
    if (!body.currency) errors.currency = "Currency is required"

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(validationError(errors), { status: 422 })
    }

    // Get sender wallet
    const senderWallet = await prisma.wallet.findFirst({
      where: { userId: payload.userId, currency: body.currency },
    })

    if (!senderWallet) {
      return NextResponse.json(
        errorResponse("Transfer failed", `No wallet found for ${body.currency}`),
        { status: 400 }
      )
    }

    // Check balance
    if (Number(senderWallet.balance) < body.amount) {
      return NextResponse.json(
        errorResponse("Transfer failed", "Insufficient balance"),
        { status: 400 }
      )
    }

    // Calculate fee (1% of transfer amount)
    const fee = body.amount * 0.01

    // Create transfer
    const transfer = await prisma.transfer.create({
      data: {
        senderId: payload.userId,
        senderWalletId: senderWallet.id,
        recipientEmail: body.recipientEmail,
        amount: body.amount,
        currency: body.currency,
        fee: fee,
        status: "processing",
        notes: body.notes,
      },
    })

    // Deduct from sender's wallet (simplified - in production use transactions)
    await prisma.wallet.update({
      where: { id: senderWallet.id },
      data: { balance: { decrement: body.amount + fee } },
    })

    // Log transaction
    await prisma.transaction.create({
      data: {
        userId: payload.userId,
        walletId: senderWallet.id,
        type: "transfer_out",
        amount: body.amount,
        currency: body.currency,
        status: "pending",
        description: `Transfer to ${body.recipientEmail}`,
        referenceId: transfer.id,
      },
    })

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId: payload.userId,
        eventType: "transaction_initiated",
        status: "success",
        details: {
          type: "transfer",
          amount: body.amount,
          currency: body.currency,
          recipient: body.recipientEmail,
        },
      },
    })

    return NextResponse.json(
      successResponse("Transfer initiated", {
        transferId: transfer.id,
        status: transfer.status,
        amount: transfer.amount.toString(),
        fee: transfer.fee.toString(),
        total: (Number(transfer.amount) + Number(transfer.fee)).toFixed(2),
        recipient: transfer.recipientEmail,
        createdAt: transfer.createdAt,
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error("Create transfer error:", error)
    return NextResponse.json(
      errorResponse("Transfer failed", "Internal server error"),
      { status: 500 }
    )
  }
}
