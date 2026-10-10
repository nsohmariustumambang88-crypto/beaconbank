import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-change-in-production"
const JWT_EXPIRY = (process.env.JWT_EXPIRY || "7d") as jwt.SignOptions["expiresIn"]

interface TokenPayload {
  userId: string
  email: string
  accountType: string
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    algorithm: "HS256",
  })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    return null
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}

export function generateApiKey(): { key: string; secret: string } {
  const key = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
  const secret = `secret_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
  return { key, secret }
}

export function generateAccountNumber(): string {
  return `ACC${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`
}

export function generateRoutingNumber(): string {
  return `${Math.floor(Math.random() * 900000000) + 100000000}`
}

export function generateCaseNumber(): string {
  return `CASE${new Date().getFullYear()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}
