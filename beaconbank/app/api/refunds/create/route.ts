import { prisma } from "@/lib/prisma"
import { kycBlock } from "@/lib/kyc"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { successResponse, errorResponse, unauthorizedError, validationError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

interface CreateRefundRequest {
  originalOrderId: string
  amount: number
  currency: string
  reason: string
  refundType: "full" | "partial" | "store_credit" | "scheduled"
  scheduledDate?: string
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

    const blocked = await kycBlock(payload.userId)
    if (blocked) return blocked

    const body: CreateRefundRequest = await request.json()

    // Validation
    const errors: Record<string, string> = {}
    if (!body.originalOrderId) errors.originalOrderId = "Original order ID is required"
    if (!body.amount || body.amount <= 0) errors.amount = "Amount must be greater than 0"
    if (!body.currency) errors.currency = "Currency is required"
    if (!body.reason) errors.reason = "Reason is required"
    if (!body.refundType) errors.refundType = "Refund type is required"

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(validationError(errors), { status: 422 })
    }

    // Create refund
    const refund = await prisma.refund.create({
      data: {
        userId: payload.userId,
        originalOrderId: body.originalOrderId,
        amount: body.amount,
        currency: body.currency,
        reason: body.reason,
        refundType: body.refundType,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
        status: "pending",
      },
    })

    // Log transaction
    await prisma.transaction.create({
      data: {
        userId: payload.userId,
        walletId: (
          await prisma.wallet.findFirst({
            where: { userId: payload.userId, currency: body.currency },
          })
        )?.id || "",
        type: "refund_in",
        amount: body.amount,
        currency: body.currency,
        status: "pending",
        description: `Refund for order ${body.originalOrderId}`,
        referenceId: refund.id,
      },
    })

    return NextResponse.json(
      successResponse("Refund created", {
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount.toString(),
        reason: refund.reason,
        refundType: refund.refundType,
        createdAt: refund.createdAt,
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error("Create refund error:", error)
    return NextResponse.json(
      errorResponse("Refund creation failed", "Internal server error"),
      { status: 500 }
    )
  }
}
