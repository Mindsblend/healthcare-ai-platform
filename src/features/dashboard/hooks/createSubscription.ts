'use client'

import { useState } from 'react'
import { createSubscriptionAction } from '../actions/createSubscription'

export function useCreateSubscription() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function createSubscription(email: string) {
    setLoading(true)
    setError(null)

    try {
      const result = await createSubscriptionAction(email)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createSubscription, loading, error, data }
}
