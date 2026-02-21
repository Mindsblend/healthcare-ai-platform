export async function getOrders() {
  const res = await fetch('/api/shop/orders')
  if (!res.ok) throw new Error('Failed to get orders')
  return res.json()
}
