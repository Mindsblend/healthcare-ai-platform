'use client'
import { useState } from 'react'
import {
  createOrderAction,
  CreateOrderInput,
} from '@/features/shop/actions/orders/createOrdersAction'

export function useCreateOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function createOrder(order: CreateOrderInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await createOrderAction(order)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createOrder, loading, error, data }
}
