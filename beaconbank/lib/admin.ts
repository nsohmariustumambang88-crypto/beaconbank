import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { unauthorizedError, forbiddenError } from "@/lib/api-response"

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

export async function checkAdmin(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (admin) return { admin, denied: null }
  const hasAuth = Boolean(request.headers.get("authorization"))
  const denied = hasAuth
    ? NextResponse.json(forbiddenError(), { status: 403 })
    : NextResponse.json(unauthorizedError(), { status: 401 })
  return { admin: null, denied }
}
