import { CreateOrderInput, OrderDetail } from '../../shop.types'

export async function createOrderAction(
  input: CreateOrderInput,
): Promise<OrderDetail> {
  const res = await fetch('/api/shop/orders/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.error || 'Failed to create order')
  }

  return res.json()
}
