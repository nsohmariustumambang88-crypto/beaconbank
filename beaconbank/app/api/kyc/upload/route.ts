import { NextRequest, NextResponse } from "next/server"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { cloudinary } from "@/lib/cloudinary"
import { KYC_IMAGE_TYPES, KYC_MAX_BYTES } from "@/lib/kyc"
import { successResponse, errorResponse, unauthorizedError, validationError } from "@/lib/api-response"

export async function POST(request: NextRequest) {
  const payload = verifyToken(extractTokenFromHeader(request.headers.get("authorization")) ?? "")
  if (!payload) return NextResponse.json(unauthorizedError(), { status: 401 })

  const form = await request.formData()
  const file = form.get("file")
  const kind = form.get("kind")
  if (!(file instanceof File)) return NextResponse.json(validationError({ file: "Choose a file" }), { status: 422 })
  if (kind !== "id" && kind !== "selfie") return NextResponse.json(validationError({ kind: "Invalid upload type" }), { status: 422 })
  if (!(KYC_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json(validationError({ file: "Use a JPG, PNG, or WEBP image" }), { status: 422 })
  }
  if (file.size > KYC_MAX_BYTES) return NextResponse.json(validationError({ file: "Image must be 5 MB or smaller" }), { status: 422 })

  try {
    const bytes = Buffer.from(await file.arrayBuffer())
    const result = await cloudinary.uploader.upload(`data:${file.type};base64,${bytes.toString("base64")}`, {
      folder: `beaconbank/kyc/${payload.userId}`,
      public_id: kind,
      overwrite: true,
      type: "private",
      resource_type: "image",
    })
    return NextResponse.json(successResponse("Uploaded", { publicId: result.public_id }))
  } catch (error) {
    console.error("KYC upload error:", error)
    return NextResponse.json(errorResponse("Upload failed", "Could not store the file. Try again."), { status: 500 })
  }
}
