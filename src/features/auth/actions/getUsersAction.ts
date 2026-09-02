import { UserSummary } from '@/features/shop/shop.types'

export async function getUsers(): Promise<UserSummary[]> {
  const res = await fetch('/api/shop/users')
  if (!res.ok) throw new Error('Failed to get users')
  return res.json()
}
