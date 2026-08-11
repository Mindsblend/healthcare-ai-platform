// features/shop/cart/actions/updateItemQuantity.ts

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

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.error || 'Failed to update item')
  }

  return data
}
