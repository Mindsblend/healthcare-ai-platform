export async function getOrdersPreview() {
  const res = await fetch('/api/shop/orders')
  if (!res.ok) throw new Error('Failed to get orders')
  return res.json()
}
