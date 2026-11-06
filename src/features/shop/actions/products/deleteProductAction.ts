// features/shop/actions/products/deleteProductAction.ts

import { DeleteProductInput, DeleteProductResponse } from '../../shop.types'

export async function deleteProductAction(
  input: DeleteProductInput,
): Promise<DeleteProductResponse> {
  const res = await fetch('/api/shop/products/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    console.error('[deleteProductAction] Error response:', data)
    throw new Error(data?.error || 'Failed to delete product')
  }

  return res.json()
}
