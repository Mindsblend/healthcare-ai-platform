'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { parseGuestCart, GUEST_CART_KEY } from '@/features/shop/hooks/cart/useCart'

interface GuestCartMergerProps {
  isAuthenticated: boolean
}

export default function GuestCartMerger({
  isAuthenticated,
}: GuestCartMergerProps) {
  const router = useRouter()
  const hasMerged = useRef(false)

  const handleMerge = useCallback(async () => {
    if (!isAuthenticated || hasMerged.current) return

    const items = parseGuestCart()
    if (items.length === 0) return

    hasMerged.current = true

    try {
      const res = await fetch('/api/cart/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('[GuestCartMerger] merge failed:', data?.error || 'Unknown error')
        // Keep guest_cart so user can retry
        hasMerged.current = false
        return
      }

      // Success: clear guest cart and refresh page to reload DB cart
      try {
        localStorage.removeItem(GUEST_CART_KEY)
      } catch {
        // ignore
      }

      // Redirect to order if not already there, otherwise refresh
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
      if (currentPath !== '/order' && currentPath !== '/cart') {
        router.push('/order')
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error('[GuestCartMerger] merge error:', err)
      hasMerged.current = false
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      void handleMerge()
    }
  }, [isAuthenticated, handleMerge])

  return null
}
