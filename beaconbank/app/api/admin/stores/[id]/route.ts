import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/admin"
import { successResponse, errorResponse, validationError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

const ALLOWED = ["active","inactive","suspended"]

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await checkAdmin(request)
  if (denied) return denied
  const { id } = await params
  const body = await request.json()
  if (!ALLOWED.includes(body.status)) return NextResponse.json(validationError({ status: "Invalid status" }), { status: 422 })
  try {
    const row = await prisma.marketplaceStore.update({ where: { id }, data: { status: body.status } })
    return NextResponse.json(successResponse("Status updated", { row }))
  } catch {
    return NextResponse.json(errorResponse("Could not update", "Not found"), { status: 404 })
  }
}
