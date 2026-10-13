import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken, generateAccountNumber, generateRoutingNumber } from "@/lib/auth"
import { successResponse, errorResponse, validationError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

interface RegisterRequest {
  email: string
  name: string
  password: string
  passwordConfirm: string
  phone?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()

    // Validation
    const errors: Record<string, string> = {}
    if (!body.email) errors.email = "Email is required"
    if (!body.name) errors.name = "Name is required"
    if (!body.password) errors.password = "Password is required"
    if (!body.passwordConfirm) errors.passwordConfirm = "Password confirmation is required"
    if (body.password !== body.passwordConfirm) errors.passwordConfirm = "Passwords do not match"
    if (body.password && body.password.length < 8) errors.password = "Password must be at least 8 characters"
    if (!body.phone) errors.phone = "Phone number is required"
    else if (!/^\+?[0-9][0-9 ()-]{6,18}[0-9]$/.test(body.phone)) errors.phone = "Enter a valid phone number"

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(validationError(errors), { status: 422 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return NextResponse.json(
        errorResponse("Registration failed", "Email already in use"),
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        phone: body.phone,
        password: hashedPassword,
        accountType: "personal",
      },
    })

    // Create default USD wallet
    await prisma.wallet.create({
      data: {
        userId: user.id,
        currency: "USD",
        balance: 0,
        accountNumber: generateAccountNumber(),
        routingNumber: generateRoutingNumber(),
      },
    })

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      accountType: user.accountType,
    })

    return NextResponse.json(
      successResponse("Registration successful", {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          accountType: user.accountType,
        },
        token,
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      errorResponse("Registration failed", "Internal server error"),
      { status: 500 }
    )
  }
}
