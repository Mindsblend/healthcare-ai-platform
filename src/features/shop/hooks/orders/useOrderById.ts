'use client'

import { useEffect, useState } from 'react'
import { getOrderById } from '../../actions/orders/getOrderByIdAction'
import { GetOrderByIdInput, GetOrderByIdResponse } from '../../shop.types'

export function useOrderById(input: GetOrderByIdInput) {
  const [order, setOrder] = useState<GetOrderByIdResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!input.id) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getOrderById(input)
        setOrder(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [input.id])

  return { order, loading, error }
}
