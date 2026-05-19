import { RemoveItemInput, RemoveItemResponse } from '../../shop.types'

export async function removeItem(
  input: RemoveItemInput,
): Promise<RemoveItemResponse> {
  const res = await fetch('/api/shop/cart/items/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) throw new Error('Failed to delete item')

  return res.json()
}
