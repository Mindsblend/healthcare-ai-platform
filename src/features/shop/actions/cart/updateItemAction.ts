export async function updateItemQuantity(cartItemId: number, quantity: number) {
  const res = await fetch('/api/shop/cart/items/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItemId, quantity }),
  })

  if (!res.ok) throw new Error('Failed to update item')
  return res.json()
}
