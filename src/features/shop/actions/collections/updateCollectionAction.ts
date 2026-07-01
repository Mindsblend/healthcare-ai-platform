import { UpdateCollectionInput, CollectionDetail } from '../../shop.types'

export async function updateCollectionAction(
  input: UpdateCollectionInput,
): Promise<CollectionDetail> {
  const res = await fetch(`/api/shop/collections/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update collection')
  }

  return res.json()
}
