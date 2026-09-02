import { GetUserInfoResponse } from '../../shop.types'

export async function getUserInfo(): Promise<GetUserInfoResponse> {
  const res = await fetch('/api/shop/profile')
  if (!res.ok) throw new Error('Failed to get user info')
  return res.json()
}
