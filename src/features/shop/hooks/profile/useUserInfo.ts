'use client'

import { useEffect, useState } from 'react'
import { getUserInfo } from '../../actions/profile/getUserInfoAction'
import { UserInfo } from '@/components/types/types'

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserInfo()
        setUserInfo(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { userInfo, loading, error }
}
