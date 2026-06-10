'use client'

import { useState } from 'react'

import { submitHealthAssessment } from '@/features/shop/actions/health/submitHealthAssessment'

export const useHealthAssessment = () => {
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const submit = async (answers: Record<number, string>) => {
    try {
      setLoading(true)
      setError(null)

      const data = await submitHealthAssessment({
        answers,
      })

      return data
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong'

      setError(message)

      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    submit,
    loading,
    error,
  }
}
