import { GetUserAddressResponse } from '../../shop.types'

export async function getUserAddress(): Promise<GetUserAddressResponse> {
  const res = await fetch('/api/shop/profile/pages/address')
  if (!res.ok) throw new Error('Failed to get user address')
  return res.json()
}
