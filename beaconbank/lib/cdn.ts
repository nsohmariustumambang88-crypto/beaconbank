const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export function cdn(file: string): string {
  const id = file.replace(/\.[^.]+$/, "")
  const isSvg = file.endsWith(".svg")
  const transform = isSvg ? "" : "f_auto,q_auto/"
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}beaconbank/${id}`
}
