import { AddItemInput, AddItemResponse } from '../../shop.types'

export async function addItem(input: AddItemInput): Promise<AddItemResponse> {
  const { cartId, productId, quantity = 1 } = input

  const res = await fetch('/api/shop/cart/items/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartId, productId, quantity }),
  })

  if (!res.ok) throw new Error('Failed to add item')

  return res.json()
}
