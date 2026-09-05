import { CreateProductInput, CreateProductResponse } from '../../shop.types'

export async function createProductAction(
  input: CreateProductInput,
): Promise<CreateProductResponse> {
  const res = await fetch('/api/shop/products/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    console.error('[createProductAction] error:', data?.error)

    throw new Error(data?.error?.message || 'خطا در ایجاد محصول')
  }

  return data
}
