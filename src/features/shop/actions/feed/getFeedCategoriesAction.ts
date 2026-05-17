import { GetFeedCategoriesResponse } from '../../shop.types'

export async function getFeedCategories(): Promise<GetFeedCategoriesResponse> {
  const res = await fetch('/api/shop/feed')
  if (!res.ok) throw new Error('Failed to get feed categories')
  return res.json()
}
