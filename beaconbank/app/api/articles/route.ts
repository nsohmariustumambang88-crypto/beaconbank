import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { NextResponse, connection } from "next/server"


export async function GET() {
  await connection()
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { slug: true, title: true, excerpt: true, category: true, image: true, createdAt: true },
    })
    return NextResponse.json(successResponse("Articles retrieved", { articles }))
  } catch (error) {
    console.error("List articles error:", error)
    return NextResponse.json(errorResponse("Failed to load articles", "Internal server error"), { status: 500 })
  }
}
