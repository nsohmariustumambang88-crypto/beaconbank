import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"

export async function getAuthUser(request: NextRequest) {
  const token = extractTokenFromHeader(request.headers.get("authorization"))
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload) return null
  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true, accountType: true },
  })
}

export async function requireAdmin(request: NextRequest) {
  const user = await getAuthUser(request)
  return user && user.role === "admin" ? user : null
}
