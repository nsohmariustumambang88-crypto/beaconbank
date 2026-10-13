import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto"

function key() {
  const secret = process.env.ENCRYPTION_KEY
  if (!secret) throw new Error("ENCRYPTION_KEY is not set")
  return createHash("sha256").update(secret).digest()
}

export function encryptText(plain: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key(), iv)
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv, tag, data].map((b) => b.toString("base64")).join(".")
}

export function decryptText(payload: string) {
  const [iv, tag, data] = payload.split(".").map((p) => Buffer.from(p, "base64"))
  const decipher = createDecipheriv("aes-256-gcm", key(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8")
}
