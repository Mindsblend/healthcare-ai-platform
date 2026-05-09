export async function getProductsByCategory(categoryId: number) {
  const res = await fetch(`/api/shop/products?categoryId=${categoryId}`)
  if (!res.ok) throw new Error('Failed to get products by category')
  return res.json()
}
