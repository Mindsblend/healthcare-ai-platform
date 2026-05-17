'use client'

import { useEffect, useState } from 'react'
import { getUsers } from '../actions/getUsersAction'
import { UserSummary } from '@/features/shop/shop.types'

export function useUsers() {
  const [users, setUsers] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { users, loading, error }
}
