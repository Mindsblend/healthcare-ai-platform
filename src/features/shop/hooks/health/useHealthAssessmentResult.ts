'use client'

import { useEffect, useState } from 'react'

import { getHealthAssessment } from '../../actions/health/getHealthAssessment'
import { HealthAssessmentResult } from '@/components/types/types'

export function useHealthAssessmentResult(id: string) {
  const [data, setData] = useState<HealthAssessmentResult | null>(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAssessment() {
      try {
        setLoading(true)

        const result = await getHealthAssessment(id)

        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAssessment()
    }
  }, [id])

  return {
    data,
    loading,
    error,
  }
}
