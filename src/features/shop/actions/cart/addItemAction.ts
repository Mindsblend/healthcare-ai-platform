export async function addItem(cartId: string, productId: number, quantity = 1) {
  const res = await fetch('/api/shop/cart/items/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartId, productId, quantity }),
  })
  if (!res.ok) throw new Error('Failed to add item')
  return res.json()
}