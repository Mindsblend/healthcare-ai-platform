'use client'

import { useEffect, useState } from 'react'
import { logOut } from '../actions/logOutAction'
import { getSession } from '../services/sessionService'

export function useUsers() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const session = await getSession()
        await logOut(session?.id)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { loading, error }
}
