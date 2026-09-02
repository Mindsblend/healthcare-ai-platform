import { UpdateProductInput, UpdateProductResponse } from '../../shop.types'

export async function updateProductAction(
  input: UpdateProductInput,
): Promise<UpdateProductResponse> {
  const res = await fetch('/api/shop/products/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const responseData = await res.json()
    throw new Error(responseData?.error || 'Failed to update product')
  }

  return res.json()
}
