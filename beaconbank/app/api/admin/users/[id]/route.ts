import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/admin"
import { successResponse, notFoundError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  const { denied } = await checkAdmin(request)
  if (denied) return denied
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, name: true, phone: true, role: true, accountType: true, kycStatus: true, createdAt: true,
      wallets: { select: { id: true, currency: true, balance: true, accountNumber: true } },
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { id: true, type: true, amount: true, currency: true, status: true, description: true, createdAt: true },
      },
    },
  })
  if (!user) return NextResponse.json(notFoundError("User"), { status: 404 })
  return NextResponse.json(successResponse("User", { user }))
}
