'use client'

import { useEffect, useRef } from 'react'
import { useSessionRefresh } from '@/features/auth/hooks/useSessionRefresh'
import { getSession } from 'next-auth/react'

export function SessionRefresher() {
  const { refresh } = useSessionRefresh()
  const isRefreshing = useRef(false)

  useEffect(() => {
    const checkAndRefresh = async () => {
      // Don't refresh if already refreshing
      if (isRefreshing.current) return

      try {
        const session = await getSession()

        // Only refresh if session exists and token is expired or about to expire
        if (session?.user) {
          const expiresAt = new Date(session.expires).getTime()
          const now = Date.now()
          const timeUntilExpiry = expiresAt - now

          // Refresh if token expires in less than 2 days or already expired
          if (timeUntilExpiry < 2 * 24 * 60 * 60 * 1000) {
            isRefreshing.current = true
            await refresh()
            isRefreshing.current = false
          }
        }
      } catch (error) {
        console.error('Session check failed:', error)
        isRefreshing.current = false
      }
    }

    // Initial check on mount (once)
    checkAndRefresh()

    // Set up periodic check (every hour instead of refreshing blindly)
    const intervalId = setInterval(checkAndRefresh, 60 * 60 * 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [refresh])

  return null
}
