export const KYC_ID_TYPES = ["passport", "national_id", "drivers_license"] as const
export const KYC_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
export const KYC_MAX_BYTES = 5 * 1024 * 1024

export function requiresKyc() {
  return process.env.REQUIRE_KYC !== "false"
}

export function validateKycDetails(body: Record<string, unknown>) {
  const errors: Record<string, string> = {}
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "")
  if (str("fullName").length < 3) errors.fullName = "Enter your full legal name"
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str("dateOfBirth"))) errors.dateOfBirth = "Enter your date of birth"
  else {
    const dob = new Date(str("dateOfBirth"))
    const ageYears = (Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000)
    if (Number.isNaN(dob.getTime()) || ageYears < 18 || ageYears > 120) errors.dateOfBirth = "You must be 18 or older"
  }
  if (str("country").length < 2) errors.country = "Enter your country"
  if (str("addressLine").length < 5) errors.addressLine = "Enter your street address"
  if (str("city").length < 2) errors.city = "Enter your city"
  if (str("postalCode").length < 2) errors.postalCode = "Enter your postal code"
  if (!(KYC_ID_TYPES as readonly string[]).includes(str("idType"))) errors.idType = "Choose an ID type"
  const idNumber = str("idNumber").replace(/\s+/g, "")
  if (idNumber.length < 4) errors.idNumber = "Enter your ID number"
  if (!str("idDocumentId")) errors.idDocumentId = "Upload a photo of your ID"
  if (!str("selfieId")) errors.selfieId = "Upload a selfie holding your ID"
  return { errors, cleaned: { fullName: str("fullName"), dateOfBirth: str("dateOfBirth"), country: str("country"), addressLine: str("addressLine"), city: str("city"), postalCode: str("postalCode"), idType: str("idType"), idNumberLast4: idNumber.slice(-4), idDocumentId: str("idDocumentId"), selfieId: str("selfieId") } }
}

export async function kycBlock(userId: string) {
  if (!requiresKyc()) return null
  const { prisma } = await import("@/lib/prisma")
  const { NextResponse } = await import("next/server")
  const me = await prisma.user.findUnique({ where: { id: userId }, select: { kycStatus: true } })
  if (me?.kycStatus === "verified") return null
  return NextResponse.json(
    { success: false, message: "Verification required", error: "Verify your identity in the Verification page first", code: 403 },
    { status: 403 }
  )
}
