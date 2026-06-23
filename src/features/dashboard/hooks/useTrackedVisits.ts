// features/dashboard/hooks/useTrackedVisits.ts

'use client'

import { useEffect, useState } from 'react'
import { getTrackedVisitsAction } from '../actions/getTrackedVisitsAction'
import { VisitMonth } from '../dashboard.types'

export function useTrackedVisit() {
  const [visits, setVisits] = useState<VisitMonth[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getTrackedVisitsAction()
        setVisits(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { visits, loading, error }
}