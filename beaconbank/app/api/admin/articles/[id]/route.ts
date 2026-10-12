import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { successResponse, errorResponse, unauthorizedError, forbiddenError, notFoundError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"


type Params = { params: Promise<{ id: string }> }

const EDITABLE = ["title", "excerpt", "body", "category", "image", "published"] as const

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin(request)
  if (!admin) {
    return NextResponse.json(request.headers.get("authorization") ? forbiddenError() : unauthorizedError(), {
      status: request.headers.get("authorization") ? 403 : 401,
    })
  }
  try {
    const { id } = await params
    const body = await request.json()
    const data: Record<string, unknown> = {}
    for (const key of EDITABLE) {
      if (body[key] !== undefined) data[key] = key === "published" ? Boolean(body[key]) : body[key]
    }
    const article = await prisma.article.update({ where: { id }, data })
    return NextResponse.json(successResponse("Article updated", { article }))
  } catch (error) {
    console.error("Update article error:", error)
    return NextResponse.json(notFoundError("Article"), { status: 404 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await requireAdmin(request)
  if (!admin) {
    return NextResponse.json(request.headers.get("authorization") ? forbiddenError() : unauthorizedError(), {
      status: request.headers.get("authorization") ? 403 : 401,
    })
  }
  try {
    const { id } = await params
    await prisma.article.delete({ where: { id } })
    return NextResponse.json(successResponse("Article deleted", {}))
  } catch (error) {
    console.error("Delete article error:", error)
    return NextResponse.json(errorResponse("Could not delete article", "Not found"), { status: 404 })
  }
}
