import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/admin"
import { cloudinary } from "@/lib/cloudinary"
import { successResponse, errorResponse, notFoundError, validationError } from "@/lib/api-response"


type Params = { params: Promise<{ id: string }> }

function signedUrl(publicId: string) {
  return cloudinary.url(publicId, { type: "private", sign_url: true, secure: true, resource_type: "image" })
}

export async function GET(request: NextRequest, { params }: Params) {
  const { denied } = await checkAdmin(request)
  if (denied) return denied
  const { id } = await params
  const s = await prisma.kycSubmission.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true, name: true, kycStatus: true } } },
  })
  if (!s) return NextResponse.json(notFoundError("Verification"), { status: 404 })
  return NextResponse.json(successResponse("Loaded", {
    submission: {
      id: s.id, status: s.status, reviewNote: s.reviewNote, reviewedAt: s.reviewedAt, createdAt: s.createdAt,
      fullName: s.fullName, dateOfBirth: s.dateOfBirth, country: s.country, addressLine: s.addressLine,
      city: s.city, postalCode: s.postalCode, idType: s.idType, idNumberLast4: s.idNumberLast4,
      idDocumentUrl: signedUrl(s.idDocumentId), selfieUrl: signedUrl(s.selfieId),
      user: s.user,
    },
  }))
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { admin, denied } = await checkAdmin(request)
  if (denied) return denied
  const { id } = await params
  const body = await request.json()
  const decision = body.decision
  const note = typeof body.note === "string" ? body.note.trim() : ""
  if (!["approved", "rejected"].includes(decision)) {
    return NextResponse.json(validationError({ decision: "Choose approve or reject" }), { status: 422 })
  }
  if (decision === "rejected" && note.length < 3) {
    return NextResponse.json(validationError({ note: "Give the customer a reason for rejecting" }), { status: 422 })
  }

  const s = await prisma.kycSubmission.findUnique({ where: { id }, select: { id: true, status: true, userId: true } })
  if (!s) return NextResponse.json(notFoundError("Verification"), { status: 404 })
  if (s.status !== "pending") {
    return NextResponse.json(errorResponse("Already reviewed", "This verification was already reviewed"), { status: 409 })
  }

  await prisma.$transaction([
    prisma.kycSubmission.update({
      where: { id },
      data: { status: decision, reviewNote: note || null, reviewedBy: admin!.email, reviewedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: s.userId },
      data: { kycStatus: decision === "approved" ? "verified" : "rejected", amlVerified: decision === "approved" },
    }),
    prisma.securityLog.create({
      data: {
        userId: s.userId,
        eventType: decision === "approved" ? "kyc_approved" : "kyc_rejected",
        status: "success",
        details: { submissionId: id, reviewedBy: admin!.email, note: note || null },
      },
    }),
  ])
  return NextResponse.json(successResponse("Verification " + decision, { id, status: decision }))
}
