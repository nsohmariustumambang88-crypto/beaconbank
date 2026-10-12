import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { successResponse, errorResponse, unauthorizedError, forbiddenError, validationError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"


function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80)
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (!admin) {
    return NextResponse.json(request.headers.get("authorization") ? forbiddenError() : unauthorizedError(), {
      status: request.headers.get("authorization") ? 403 : 401,
    })
  }
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  })
  return NextResponse.json(successResponse("Articles retrieved", { articles }))
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (!admin) {
    return NextResponse.json(request.headers.get("authorization") ? forbiddenError() : unauthorizedError(), {
      status: request.headers.get("authorization") ? 403 : 401,
    })
  }
  try {
    const body = await request.json()
    const errors: Record<string, string> = {}
    if (!body.title) errors.title = "Title is required"
    if (!body.excerpt) errors.excerpt = "Excerpt is required"
    if (!body.body) errors.body = "Body is required"
    if (!body.category) errors.category = "Category is required"
    if (!body.image) errors.image = "Image is required"
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(validationError(errors), { status: 422 })
    }

    const slug = slugify(body.slug || body.title)
    const exists = await prisma.article.findUnique({ where: { slug } })
    if (exists) {
      return NextResponse.json(errorResponse("Could not create article", "An article with this slug already exists"), {
        status: 409,
      })
    }

    const article = await prisma.article.create({
      data: {
        slug,
        title: body.title,
        excerpt: body.excerpt,
        body: body.body,
        category: body.category,
        image: body.image,
        published: Boolean(body.published),
      },
    })
    return NextResponse.json(successResponse("Article created", { article }), { status: 201 })
  } catch (error) {
    console.error("Create article error:", error)
    return NextResponse.json(errorResponse("Could not create article", "Internal server error"), { status: 500 })
  }
}
