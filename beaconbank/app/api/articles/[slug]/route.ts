import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundError } from "@/lib/api-response"
import { NextResponse, connection } from "next/server"


export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  await connection()
  try {
    const { slug } = await params
    const article = await prisma.article.findFirst({
      where: { slug, published: true },
      select: { slug: true, title: true, excerpt: true, body: true, category: true, image: true, createdAt: true },
    })
    if (!article) {
      return NextResponse.json(notFoundError("Article"), { status: 404 })
    }
    return NextResponse.json(successResponse("Article retrieved", { article }))
  } catch (error) {
    console.error("Get article error:", error)
    return NextResponse.json(errorResponse("Failed to load article", "Internal server error"), { status: 500 })
  }
}
