import { ShippingInfo, OrderType } from '@/components/types/types'

export type CreateOrderInput = {
  shippingInfo: ShippingInfo
  paymentMethod: 'mellat' | 'zarinpal'
}

export async function createOrderAction(
  input: CreateOrderInput,
): Promise<OrderType> {
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
