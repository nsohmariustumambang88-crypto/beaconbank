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

    // Get user profile with related data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profileImage: true,
        accountType: true,
        kycStatus: true,
        amlVerified: true,
        wallets: {
          select: {
            id: true,
            currency: true,
            balance: true,
          },
        },
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found", error: "NOT_FOUND" },
        { status: 404 }
      )
    }

    // Calculate total balance
    const totalBalance = user.wallets.reduce((sum, w) => sum + Number(w.balance), 0)

    return NextResponse.json(
      successResponse("User profile retrieved", {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          profileImage: user.profileImage,
          accountType: user.accountType,
          kycStatus: user.kycStatus,
          amlVerified: user.amlVerified,
          createdAt: user.createdAt,
        },
        wallets: user.wallets.map(w => ({
          id: w.id,
          currency: w.currency,
          balance: w.balance.toString(),
        })),
        totalBalance: totalBalance.toFixed(2),
      })
    )
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to retrieve profile", error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json()

    // Update user profile
    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        name: body.name || undefined,
        phone: body.phone || undefined,
        profileImage: body.profileImage || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profileImage: true,
      },
    })

    return NextResponse.json(
      successResponse("Profile updated successfully", { user })
    )
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update profile", error: "Internal server error" },
      { status: 500 }
    )
  }
}
