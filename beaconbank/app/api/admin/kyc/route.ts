import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/admin"
import { successResponse } from "@/lib/api-response"


const STATUSES = ["pending", "approved", "rejected"]

export async function GET(request: NextRequest) {
  const { denied } = await checkAdmin(request)
  if (denied) return denied
  const status = request.nextUrl.searchParams.get("status")
  const where = status && STATUSES.includes(status) ? { status } : {}
  const rows = await prisma.kycSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true, fullName: true, country: true, idType: true, status: true, createdAt: true, reviewedAt: true,
      user: { select: { email: true } },
    },
  })
  return NextResponse.json(successResponse("Loaded", { rows }))
}
