export async function getCategories() {
  const res = await fetch('/api/shop/categories')
  if (!res.ok) throw new Error('Failed to get categories')
  return res.json()
}
