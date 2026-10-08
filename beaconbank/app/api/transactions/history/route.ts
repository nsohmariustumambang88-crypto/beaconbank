import { prisma } from "@/lib/prisma"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { successResponse, unauthorizedError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
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

    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50", 10)
    const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0", 10)

    // Get transaction history
    const transactions = await prisma.transaction.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        type: true,
        amount: true,
        currency: true,
        status: true,
        description: true,
        referenceId: true,
        createdAt: true,
        wallet: {
          select: { accountNumber: true },
        },
      },
    })

    const total = await prisma.transaction.count({
      where: { userId: payload.userId },
    })

    return NextResponse.json(
      successResponse("Transaction history retrieved", {
        transactions: transactions.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount.toString(),
          currency: t.currency,
          status: t.status,
          description: t.description,
          referenceId: t.referenceId,
          accountNumber: t.wallet.accountNumber,
          createdAt: t.createdAt,
        })),
        pagination: {
          limit,
          offset,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    )
  } catch (error) {
    console.error("Get transaction history error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to retrieve transactions", error: "Internal server error" },
      { status: 500 }
    )
  }
}
