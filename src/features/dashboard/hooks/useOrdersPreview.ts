'use client'

import { useEffect, useState } from 'react'
import { getOrders } from '@/features/dashboard/actions/getOrdersAction'
import { OrderSummary } from '@/components/types/types'

export function useOrdersPreview() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { orders, loading, error }
}
