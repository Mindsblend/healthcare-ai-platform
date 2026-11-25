// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock next/navigation
const mockPush = vi.fn()
const mockRefresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Mock parseGuestCart and GUEST_CART_KEY
vi.mock('@/features/shop/hooks/cart/useCart', () => ({
  GUEST_CART_KEY: 'guest_cart',
  parseGuestCart: vi.fn(),
}))

import { parseGuestCart, GUEST_CART_KEY } from '@/features/shop/hooks/cart/useCart'
import GuestCartMerger from '@/components/layout/GuestCartMerger'

describe('GuestCartMerger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    mockPush.mockReset()
    mockRefresh.mockReset()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does nothing when user is not authenticated', () => {
    render(<GuestCartMerger isAuthenticated={false} />)

    expect(parseGuestCart).not.toHaveBeenCalled()
  })

  it('does nothing when guest cart is empty', () => {
    vi.mocked(parseGuestCart).mockReturnValue([])
    render(<GuestCartMerger isAuthenticated={true} />)

    expect(parseGuestCart).toHaveBeenCalled()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('merges guest cart on authentication', async () => {
    vi.mocked(parseGuestCart).mockReturnValue([
      { productId: 1, quantity: 2 },
      { productId: 5, quantity: 1 },
    ])

    // Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true, cart: { id: 'cart-1', items: [] } }),
    })

    render(<GuestCartMerger isAuthenticated={true} />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/cart/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            { productId: 1, quantity: 2 },
            { productId: 5, quantity: 1 },
          ],
        }),
        credentials: 'include',
      })
    })

    // Verify guest cart is cleared
    await waitFor(() => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(GUEST_CART_KEY)
    })
  })

  it('redirects to /order when not on /order or /cart', async () => {
    vi.mocked(parseGuestCart).mockReturnValue([{ productId: 1, quantity: 1 }])

    // Mock window.location.pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: '/checkout' },
      writable: true,
    })

    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true, cart: { id: 'cart-1', items: [] } }),
    })

    render(<GuestCartMerger isAuthenticated={true} />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/order')
    })
  })

  it('refreshes page when already on /order', async () => {
    vi.mocked(parseGuestCart).mockReturnValue([{ productId: 1, quantity: 1 }])

    Object.defineProperty(window, 'location', {
      value: { pathname: '/order' },
      writable: true,
    })

    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true, cart: { id: 'cart-1', items: [] } }),
    })

    render(<GuestCartMerger isAuthenticated={true} />)

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('refreshes page when already on /cart', async () => {
    vi.mocked(parseGuestCart).mockReturnValue([{ productId: 1, quantity: 1 }])

    Object.defineProperty(window, 'location', {
      value: { pathname: '/cart' },
      writable: true,
    })

    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true, cart: { id: 'cart-1', items: [] } }),
    })

    render(<GuestCartMerger isAuthenticated={true} />)

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('does not clear guest cart and allows retry on merge failure', async () => {
    vi.mocked(parseGuestCart).mockReturnValue([{ productId: 1, quantity: 1 }])

    mockFetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: 'Merge failed' }),
    })

    render(<GuestCartMerger isAuthenticated={true} />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    // guest_cart should NOT be removed on failure
    expect(localStorageMock.removeItem).not.toHaveBeenCalled()

    // The component uses hasMerged.current = false on failure to allow retry
    // Verify by re-rendering with isAuthenticated=true again
    const { rerender } = render(<GuestCartMerger isAuthenticated={true} />)
    
    // Should attempt merge again since hasMerged was reset to false
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  it('only merges once per authentication session', async () => {
    vi.mocked(parseGuestCart).mockReturnValue([{ productId: 1, quantity: 1 }])

    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true, cart: { id: 'cart-1', items: [] } }),
    })

    const { rerender } = render(<GuestCartMerger isAuthenticated={true} />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    // Re-render with same isAuthenticated - should not merge again
    rerender(<GuestCartMerger isAuthenticated={true} />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1) // Still 1
    })
  })

  it('merges again when isAuthenticated changes from false to true', async () => {
    vi.mocked(parseGuestCart).mockReturnValue([{ productId: 1, quantity: 1 }])

    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true, cart: { id: 'cart-1', items: [] } }),
    })

    const { rerender } = render(<GuestCartMerger isAuthenticated={false} />)

    expect(mockFetch).not.toHaveBeenCalled()

    // Now authenticate
    rerender(<GuestCartMerger isAuthenticated={true} />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })
})