import { GetCategoriesResponse } from '../../shop.types'

export async function getCategories(): Promise<GetCategoriesResponse> {
  const res = await fetch('/api/shop/categories')
  if (!res.ok) throw new Error('Failed to get categories')
  return res.json()
}
