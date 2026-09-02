'use client'

import { useEffect, useState } from 'react'
import { getOrderById } from '../../actions/orders/getOrderByIdAction'
import { GetOrderByIdInput, GetOrderByIdResponse } from '../../shop.types'

export function useOrderById(input: GetOrderByIdInput) {
  const [order, setOrder] = useState<GetOrderByIdResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    if (!input.id) {
      setLoading(false)
      setError(null)
      setOrder(null)

      return
    }

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const data = await getOrderById(input)

        if (cancelled) return

        setOrder(data)
      } catch (err) {
        if (cancelled) return

        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        if (cancelled) return

        setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [input.id])

  return {
    order,
    loading,
    error,
  }
}
