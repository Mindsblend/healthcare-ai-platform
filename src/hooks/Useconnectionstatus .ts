'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type ConnectionStatus = 'online' | 'offline'

type Options = {
  /** مسیر ping */
  endpoint?: string
  /** فاصله چک وقتی آنلاین هستیم (میلی‌ثانیه) */
  onlineInterval?: number
  /** فاصله چک وقتی آفلاین هستیم (میلی‌ثانیه) */
  offlineInterval?: number
  /** حداکثر زمان انتظار برای پاسخ ping */
  timeout?: number
}

export function useConnectionStatus({
  endpoint = '/api/ping',
  onlineInterval = 15_000,
  offlineInterval = 4_000,
  timeout = 5_000,
}: Options = {}) {
  const [status, setStatus] = useState<ConnectionStatus>('online')
  const [isChecking, setIsChecking] = useState(false)
  const statusRef = useRef<ConnectionStatus>('online')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inFlight = useRef(false)

  const update = useCallback((next: ConnectionStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const check = useCallback(async () => {
    if (inFlight.current) return
    inFlight.current = true
    setIsChecking(true)

    // اگر مرورگر خودش می‌گوید آفلاین است، نیازی به ping نیست
    if (!navigator.onLine) {
      update('offline')
      inFlight.current = false
      setIsChecking(false)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    try {
      const res = await fetch(`${endpoint}?t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      })
      update(res.ok ? 'online' : 'offline')
    } catch {
      update('offline')
    } finally {
      clearTimeout(timer)
      inFlight.current = false
      setIsChecking(false)
    }
  }, [endpoint, timeout, update])

  useEffect(() => {
    let cancelled = false

    const schedule = () => {
      if (cancelled) return
      const delay =
        statusRef.current === 'online' ? onlineInterval : offlineInterval
      timerRef.current = setTimeout(async () => {
        // وقتی تب پنهان است چک نمی‌کنیم تا منابع هدر نرود
        if (document.visibilityState === 'visible') await check()
        schedule()
      }, delay)
    }

    const handleOnline = () => check()
    const handleOffline = () => update('offline')
    const handleVisible = () => {
      if (document.visibilityState === 'visible') check()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    document.addEventListener('visibilitychange', handleVisible)

    check()
    schedule()

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [check, update, onlineInterval, offlineInterval])

  return { status, isOnline: status === 'online', isChecking, retry: check }
}
