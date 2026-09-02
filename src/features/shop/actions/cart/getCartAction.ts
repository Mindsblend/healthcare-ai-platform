import { GetCartResponse } from '../../shop.types'

export async function getCart(): Promise<GetCartResponse> {
  const res = await fetch('/api/shop/cart', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await res.json()

  if (!res.ok) {
    console.log('[getCart] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}
