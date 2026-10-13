import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { requiresKyc, validateKycDetails } from "@/lib/kyc"
import { successResponse, errorResponse, unauthorizedError, validationError } from "@/lib/api-response"


function summarize(s: { id: string; status: string; reviewNote: string | null; createdAt: Date; reviewedAt: Date | null }) {
  return { id: s.id, status: s.status, reviewNote: s.reviewNote, createdAt: s.createdAt, reviewedAt: s.reviewedAt }
}

export async function GET(request: NextRequest) {
  const payload = verifyToken(extractTokenFromHeader(request.headers.get("authorization")) ?? "")
  if (!payload) return NextResponse.json(unauthorizedError(), { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { kycStatus: true } })
  const latest = await prisma.kycSubmission.findFirst({ where: { userId: payload.userId }, orderBy: { createdAt: "desc" } })
  return NextResponse.json(successResponse("KYC status", { kycStatus: user?.kycStatus ?? "pending", required: requiresKyc(), submission: latest ? summarize(latest) : null }))
}

export async function POST(request: NextRequest) {
  const payload = verifyToken(extractTokenFromHeader(request.headers.get("authorization")) ?? "")
  if (!payload) return NextResponse.json(unauthorizedError(), { status: 401 })

  const body = await request.json()
  const { errors, cleaned } = validateKycDetails(body)
  if (Object.keys(errors).length > 0) return NextResponse.json(validationError(errors), { status: 422 })

  const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { kycStatus: true } })
  if (!user) return NextResponse.json(unauthorizedError(), { status: 401 })
  if (user.kycStatus === "verified") {
    return NextResponse.json(errorResponse("Already verified", "Your identity is already verified"), { status: 409 })
  }
  const open = await prisma.kycSubmission.findFirst({ where: { userId: payload.userId, status: "pending" } })
  if (open) {
    return NextResponse.json(errorResponse("Already submitted", "Your verification is already under review"), { status: 409 })
  }

  const expectedPrefix = `beaconbank/kyc/${payload.userId}/`
  if (!cleaned.idDocumentId.startsWith(expectedPrefix) || !cleaned.selfieId.startsWith(expectedPrefix)) {
    return NextResponse.json(validationError({ idDocumentId: "Uploads are invalid. Upload them again." }), { status: 422 })
  }

  const [submission] = await prisma.$transaction([
    prisma.kycSubmission.create({ data: { ...cleaned, userId: payload.userId, status: "pending" } }),
    prisma.user.update({ where: { id: payload.userId }, data: { kycStatus: "pending" } }),
  ])
  return NextResponse.json(successResponse("Verification submitted", { submission: summarize(submission) }), { status: 201 })
}
