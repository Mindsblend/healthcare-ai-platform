// src/features/auth/hooks/useLogOut.ts
'use client'

import { useState } from 'react'
import { logOut } from '../actions/logOutAction'

export function useLogOut() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const logout = async () => {
    setLoading(true)
    setError(null)
    try {
      await logOut()
    } catch (err: any) {
      setError(err.message ?? 'Logout failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { logout, loading, error }
}
