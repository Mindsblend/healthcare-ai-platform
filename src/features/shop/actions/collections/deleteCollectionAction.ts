import {
  DeleteCollectionInput,
  DeleteCollectionResponse,
} from '../../shop.types'

export async function deleteCollectionAction(
  input: DeleteCollectionInput,
): Promise<DeleteCollectionResponse> {
  const res = await fetch(`/api/shop/collections/delete/${input.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete collection')
  }

  return res.json()
}
