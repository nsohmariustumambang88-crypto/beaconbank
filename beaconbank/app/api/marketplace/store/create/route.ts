import { prisma } from "@/lib/prisma"
import { kycBlock } from "@/lib/kyc"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { successResponse, errorResponse, unauthorizedError, validationError } from "@/lib/api-response"
import { NextRequest, NextResponse } from "next/server"

interface CreateStoreRequest {
  storeName: string
  description?: string
  logo?: string
}

function generateStoreSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 50)
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return NextResponse.json(unauthorizedError(), { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(unauthorizedError(), { status: 401 })
    }

    const blocked = await kycBlock(payload.userId)
    if (blocked) return blocked

    const body: CreateStoreRequest = await request.json()

    // Validation
    const errors: Record<string, string> = {}
    if (!body.storeName) errors.storeName = "Store name is required"
    if (body.storeName && body.storeName.length < 3) errors.storeName = "Store name must be at least 3 characters"
    if (body.storeName && body.storeName.length > 100) errors.storeName = "Store name must be less than 100 characters"

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(validationError(errors), { status: 422 })
    }

    // Check if user already has a store
    const existingStore = await prisma.marketplaceStore.findUnique({
      where: { userId: payload.userId },
    })

    if (existingStore) {
      return NextResponse.json(
        errorResponse("Store creation failed", "User already has a store"),
        { status: 400 }
      )
    }

    // Generate unique slug
    let storeSlug = generateStoreSlug(body.storeName)
    let slugExists = await prisma.marketplaceStore.findUnique({
      where: { storeSlug },
    })

    if (slugExists) {
      storeSlug = `${storeSlug}-${Math.random().toString(36).substring(7)}`
    }

    // Create store
    const store = await prisma.marketplaceStore.create({
      data: {
        userId: payload.userId,
        storeName: body.storeName,
        storeSlug,
        description: body.description,
        logo: body.logo,
        status: "active",
      },
    })

    return NextResponse.json(
      successResponse("Store created successfully", {
        storeId: store.id,
        storeName: store.storeName,
        storeSlug: store.storeSlug,
        status: store.status,
        createdAt: store.createdAt,
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error("Create store error:", error)
    return NextResponse.json(
      errorResponse("Store creation failed", "Internal server error"),
      { status: 500 }
    )
  }
}
