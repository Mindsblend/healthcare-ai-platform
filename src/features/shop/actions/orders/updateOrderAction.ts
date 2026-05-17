import { UpdateOrderInput, OrderSummary } from '../../shop.types'

export async function updateOrderAction(
  input: UpdateOrderInput,
): Promise<OrderSummary> {
  const res = await fetch('/api/shop/orders/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.error || 'Failed to update order')
  }

  return res.json()
}
