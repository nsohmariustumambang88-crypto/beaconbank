import { prisma } from "@/lib/prisma"
import { verifyToken, extractTokenFromHeader, generateCaseNumber } from "@/lib/auth"
import { successResponse, errorResponse, unauthorizedError, validationError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

interface CreateRecoveryRequest {
  fraudType: string
  amount: number
  currency: string
  description: string
  evidence?: string[]
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

    const body: CreateRecoveryRequest = await request.json()

    // Validation
    const errors: Record<string, string> = {}
    if (!body.fraudType) errors.fraudType = "Fraud type is required"
    if (!body.amount || body.amount <= 0) errors.amount = "Amount must be greater than 0"
    if (!body.currency) errors.currency = "Currency is required"
    if (!body.description) errors.description = "Description is required"

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(validationError(errors), { status: 422 })
    }

    // Create recovery case
    const recovery = await prisma.fundRecovery.create({
      data: {
        userId: payload.userId,
        caseNumber: generateCaseNumber(),
        fraudType: body.fraudType,
        amount: body.amount,
        currency: body.currency,
        description: body.description,
        evidence: body.evidence || [],
        status: "open",
        severity: body.amount > 10000 ? "high" : body.amount > 5000 ? "medium" : "low",
      },
    })

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId: payload.userId,
        eventType: "fraud_report",
        status: "success",
        riskScore: body.amount > 10000 ? 85 : 60,
        details: {
          fraudType: body.fraudType,
          amount: body.amount,
          caseNumber: recovery.caseNumber,
        },
      },
    })

    return NextResponse.json(
      successResponse("Recovery case created", {
        caseId: recovery.id,
        caseNumber: recovery.caseNumber,
        status: recovery.status,
        amount: recovery.amount.toString(),
        fraudType: recovery.fraudType,
        severity: recovery.severity,
        createdAt: recovery.createdAt,
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error("Create recovery error:", error)
    return NextResponse.json(
      errorResponse("Recovery case creation failed", "Internal server error"),
      { status: 500 }
    )
  }
}
