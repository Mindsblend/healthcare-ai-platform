'use client'

import { useEffect, useState } from 'react'
import { getOrderById } from '../../actions/orders/getOrderByIdAction'
import { OrderDetail } from '@/components/types/types'

export function useOrderById(id: string) {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getOrderById(id)
        setOrder(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return { order, loading, error, getOrderById }
}
