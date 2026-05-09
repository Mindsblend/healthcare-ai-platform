export async function getOrderById(id: string) {
  const res = await fetch(`/api/shop/orders/${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error('Failed to get order')
  return res.json()
}
