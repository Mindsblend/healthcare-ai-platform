import {
  UpdateItemQuantityInput,
  UpdateItemQuantityResponse,
} from '../../shop.types'

export async function updateItemQuantity(
  input: UpdateItemQuantityInput,
): Promise<UpdateItemQuantityResponse> {
  const res = await fetch('/api/shop/cart/items/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    throw new Error('Failed to update item')
  }

  return res.json()
}
