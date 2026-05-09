export async function getBlogBySlug(slug: string) {
  const res = await fetch(`/api/shop/blogs/${encodeURIComponent(slug)}`)
  if (!res.ok) throw new Error('Failed to get blog')
  return res.json()
}
