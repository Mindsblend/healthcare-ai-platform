'use client'

import { useEffect, useState } from 'react'
import { getOrders } from '@/features/dashboard/actions/getOrdersAction'
import { OrderType } from '@/components/types/types'

export function useOrders() {
  const [orders, setOrders] = useState<OrderType[]>([])
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
