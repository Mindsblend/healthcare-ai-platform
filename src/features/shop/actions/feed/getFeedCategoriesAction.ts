export async function getFeedCategories() {
  const res = await fetch('/api/shop/feed')
  if (!res.ok) throw new Error('Failed to get feed categories')
  return res.json()
}
