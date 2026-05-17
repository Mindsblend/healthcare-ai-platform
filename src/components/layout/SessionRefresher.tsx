'use client'

import { useEffect } from 'react'
import { useSessionRefresh } from '@/features/auth/hooks/useSessionRefresh'

export function SessionRefresher() {
  const { refresh } = useSessionRefresh()

  useEffect(() => {
    // Refresh on page load
    refresh()

    // Refresh on user activity
    let timeoutId: NodeJS.Timeout

    const handleActivity = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        refresh()
      }, 5000) // Wait 5 seconds after user stops activity
    }

    window.addEventListener('click', handleActivity)
    window.addEventListener('scroll', handleActivity)
    window.addEventListener('keydown', handleActivity)

    // Refresh every 6 days as fallback
    const intervalId = setInterval(
      () => {
        refresh()
      },
      6 * 24 * 60 * 60 * 1000,
    )

    return () => {
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [refresh])

  return null
}
