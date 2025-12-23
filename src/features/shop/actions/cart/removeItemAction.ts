export async function removeItem(cartItemId: number) {
  const res = await fetch('/api/shop/cart/items/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItemId }),
  })

  if (!res.ok) throw new Error('Failed to delete item')
  return res.json()
}
