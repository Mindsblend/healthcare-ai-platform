import { CollectionSummary } from '../../shop.types'

export async function getCollectionsAction(): Promise<CollectionSummary[]> {
  const res = await fetch('/api/shop/collections', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('API Error Response:', res.status, errorText)
    throw new Error(`Failed to fetch collections: ${res.status} ${errorText}`)
  }

  return res.json()
}
