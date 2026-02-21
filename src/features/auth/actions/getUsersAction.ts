export async function getUsers() {
  const res = await fetch('/api/shop/users')
  if (!res.ok) throw new Error('Failed to get users')
  return res.json()
}
