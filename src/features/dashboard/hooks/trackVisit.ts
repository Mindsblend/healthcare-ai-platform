'use client'
import { useState } from 'react'
import { trackVisitAction } from '../actions/trackVisitAction'

export function createTrackVisit() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function useTrackedVisit() {
    setLoading(true)
    setError(null)

    try {
      const result = await trackVisitAction()
      setData(result)
      console.log('Tracked View Succesfully')
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { useTrackedVisit, loading, error, data }
}
