export async function getProductBySlug(slug: string) {
  const res = await fetch(`/api/shop/products/${encodeURIComponent(slug)}`)
  if (!res.ok) throw new Error('Failed to get product')
  return res.json()
}
