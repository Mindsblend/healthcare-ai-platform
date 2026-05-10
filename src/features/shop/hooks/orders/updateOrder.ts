'use client'
import { useState } from 'react'
import { updateOrderAction } from '@/features/shop/actions/orders/updateOrderAction'
import { OrderStatus } from '@/components/types/types'

export function useUpdateOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function updateOrder(
    orderId: string,
    status?: OrderStatus,
    shippingNotes?: string,
  ) {
    setLoading(true)
    setError(null)

    try {
      const result = await updateOrderAction(orderId, status, shippingNotes)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateOrder, loading, error, data }
}
