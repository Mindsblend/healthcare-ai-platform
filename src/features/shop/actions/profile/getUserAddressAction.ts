export async function getUserAddress() {
  const res = await fetch('/api/shop/profile/address')
  if (!res.ok) throw new Error('Failed to get user address')
  return res.json()
}
