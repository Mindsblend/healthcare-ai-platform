import { OrderSummary } from '@/components/types/types'
import { OrderStatus } from '@prisma/client'

export async function updateOrderAction(
  orderId: string,
  status?: OrderStatus,
  shippingNotes?: string,
): Promise<OrderSummary> {
  const res = await fetch('/api/shop/orders/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, status, shippingNotes }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.error || 'Failed to update order')
  }

  return res.json()
}
