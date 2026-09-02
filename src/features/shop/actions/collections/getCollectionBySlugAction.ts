// features/shop/actions/collections/getCollectionBySlugAction.ts
import { CollectionDetail } from '../../shop.types'

export async function getCollectionBySlugAction(
  slug: string,
): Promise<CollectionDetail> {
  // Add timestamp to prevent caching
  const res = await fetch(`/api/shop/collections/${slug}?t=${Date.now()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch collection')
  }

  return res.json()
}
