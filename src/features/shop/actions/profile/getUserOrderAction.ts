export async function getUserOrder() {
  const res = await fetch('/api/shop/profile/order')
  if (!res.ok) throw new Error('Failed to get user orders')
  return res.json()
}
