'use client'

import { useState } from 'react'
import { updateOrderAction } from '@/features/shop/actions/orders/updateOrderAction'
import { UpdateOrderInput, UpdateOrderResponse } from '../../shop.types'

export function useUpdateOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<UpdateOrderResponse | null>(null)

  async function updateOrder(input: UpdateOrderInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await updateOrderAction(input)
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
