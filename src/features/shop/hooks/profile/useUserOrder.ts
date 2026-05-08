'use client'

import { useEffect, useState } from 'react'
import { getUserOrder } from '../../actions/profile/getUserOrderAction'
import { UserOrder } from '@/components/types/types'

export function useUserOrder() {
  const [userOrder, setUserOrder] = useState<UserOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserOrder()
        setUserOrder(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { userOrder, loading, error }
}
