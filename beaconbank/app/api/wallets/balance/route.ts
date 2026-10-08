import { prisma } from "@/lib/prisma"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { successResponse, errorResponse, unauthorizedError } from "@/lib/api-response"
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

    // Get user wallets
    const wallets = await prisma.wallet.findMany({
      where: { userId: payload.userId },
      select: {
        id: true,
        currency: true,
        balance: true,
        accountNumber: true,
        routingNumber: true,
        iban: true,
        swiftCode: true,
        createdAt: true,
      },
    })

    // Calculate total balance in USD (simplified)
    const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)

    return NextResponse.json(
      successResponse("Wallet balance retrieved", {
        wallets: wallets.map(w => ({
          ...w,
          balance: w.balance.toString(),
        })),
        totalBalance: totalBalance.toFixed(2),
      })
    )
  } catch (error) {
    console.error("Get balance error:", error)
    return NextResponse.json(
      errorResponse("Failed to retrieve balance", "Internal server error"),
      { status: 500 }
    )
  }
}
