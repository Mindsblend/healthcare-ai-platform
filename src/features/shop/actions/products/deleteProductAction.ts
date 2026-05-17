import { DeleteProductInput, DeleteProductResponse } from '../../shop.types'

export async function deleteProductAction(
  input: DeleteProductInput,
): Promise<DeleteProductResponse> {
  const res = await fetch('/api/shop/products/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input), // Fixed: now sends { id: number } instead of just the number
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    console.error('[deleteProductAction] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return res.json()
}
