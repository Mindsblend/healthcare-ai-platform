import { CreateCollectionInput, CollectionDetail } from '../../shop.types'

export async function createCollectionAction(
  input: CreateCollectionInput,
): Promise<CollectionDetail> {
  const res = await fetch('/api/shop/collections/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to create collection')
  }

  return res.json()
}
