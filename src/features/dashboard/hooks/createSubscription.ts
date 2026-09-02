'use client'

import { useState } from 'react'
import { createSubscriptionAction } from '../actions/createSubscription'
import {
  CreateSubscriptionInput,
  SubscriptionPayload,
} from '../dashboard.types'

export function useCreateSubscription() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<SubscriptionPayload | null>(null)

  async function createSubscription(input: CreateSubscriptionInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await createSubscriptionAction(input)
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
