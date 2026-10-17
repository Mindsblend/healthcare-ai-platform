import { GetCartResponse } from '../../shop.types'

export async function getCart(): Promise<GetCartResponse> {
  const res = await fetch('/api/shop/cart', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}
