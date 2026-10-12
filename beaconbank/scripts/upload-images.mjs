import { v2 as cloudinary } from "cloudinary"
import { config } from "dotenv"
import { readdir } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
config({ path: path.join(root, ".env.local") })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const sources = [path.join(root, "public", "images"), path.join(root, "..", "design", "study")]
const extensions = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp"])

for (const dir of sources) {
  for (const file of await readdir(dir)) {
    const ext = path.extname(file).toLowerCase()
    if (!extensions.has(ext)) continue
    const name = path.basename(file, path.extname(file))
    const result = await cloudinary.uploader.upload(path.join(dir, file), {
      public_id: `beaconbank/${name}`,
      overwrite: true,
      resource_type: "image",
    })
    console.log(`${file} -> ${result.public_id}`)
  }
}
