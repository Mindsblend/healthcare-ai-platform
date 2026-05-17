'use client'

import { useState } from 'react'
import { refreshTokenSession } from '../actions/refreshTokenSessionAction'
import { ErrorCode } from '@/lib/errors'

export function useSessionRefresh() {
  const [loading, setLoading] = useState(false)
  const [refreshed, setRefreshed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getErrorMessage = (code: string) => {
    const entry = Object.values(ErrorCode).find((e) => e.code === code)
    return entry?.message || 'خطایی رخ داده است'
  }

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      await refreshTokenSession()
      setRefreshed(true)
      return true
    } catch (e: any) {
      setError(getErrorMessage(e.message))
      return false
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setRefreshed(false)
    setError(null)
  }

  return {
    refresh,
    reset,
    loading,
    refreshed,
    error,
  }
}
