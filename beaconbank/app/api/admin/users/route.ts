import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { successResponse, unauthorizedError, forbiddenError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (!admin) {
    return NextResponse.json(request.headers.get("authorization") ? forbiddenError() : unauthorizedError(), {
      status: request.headers.get("authorization") ? 403 : 401,
    })
  }
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, email: true, name: true, role: true, accountType: true, createdAt: true, wallets: { select: { currency: true, balance: true } } },
  })
  return NextResponse.json(successResponse("Users retrieved", { users }))
}
