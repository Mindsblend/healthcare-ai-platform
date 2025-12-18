export default function generateSlug(name: string) {
  return name
    .trim()
    .replace(/\s+/g, '-') // spaces → dash
    .replace(/[^\p{L}\p{N}-]+/gu, '') // remove symbols
}
