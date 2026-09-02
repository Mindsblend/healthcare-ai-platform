import { CreateCartResponse } from '../../shop.types'

export async function createCart(): Promise<CreateCartResponse> {
  const res = await fetch('/api/shop/cart/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('[createCart] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}
