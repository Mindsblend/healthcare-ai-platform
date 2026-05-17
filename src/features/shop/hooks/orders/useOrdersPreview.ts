'use client'

import { useEffect, useState } from 'react'
import { getOrdersPreview } from '@/features/shop/actions/orders/getOrdersPreviewAction'
import { OrderSummary } from '../../shop.types'

export function useOrdersPreview() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrdersPreview()
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
