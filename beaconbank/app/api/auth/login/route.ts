import { prisma } from "@/lib/prisma"
import { verifyPassword, generateToken } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    if (!body.email || !body.password) {
      return NextResponse.json(
        errorResponse("Login failed", "Email and password are required"),
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: { wallets: true },
    })

    if (!user) {
      return NextResponse.json(
        errorResponse("Login failed", "Invalid email or password"),
        { status: 401 }
      )
    }

    // Verify password
    const passwordMatch = await verifyPassword(body.password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        errorResponse("Login failed", "Invalid email or password"),
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      accountType: user.accountType,
    })

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        eventType: "login",
        status: "success",
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      },
    })

    return NextResponse.json(
      successResponse("Login successful", {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          accountType: user.accountType,
          kycStatus: user.kycStatus,
        },
        wallets: user.wallets.map(w => ({
          id: w.id,
          currency: w.currency,
          balance: w.balance.toString(),
          accountNumber: w.accountNumber,
        })),
        token,
      })
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      errorResponse("Login failed", "Internal server error"),
      { status: 500 }
    )
  }
}
