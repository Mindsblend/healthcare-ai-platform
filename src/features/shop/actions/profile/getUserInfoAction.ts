export async function getUserInfo() {
  const res = await fetch('/api/shop/profile')
  if (!res.ok) throw new Error('Failed to get user info')
  return res.json()
}
