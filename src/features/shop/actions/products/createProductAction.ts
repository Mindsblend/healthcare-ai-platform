import { CreateProductInput, CreateProductResponse } from '../../shop.types'

export async function createProductAction(
  input: CreateProductInput,
): Promise<CreateProductResponse> {
  const res = await fetch('/api/shop/products/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    console.error('[createProductAction] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return res.json()
}
