// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/features/shop/hooks/cart/useCart'

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

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

const createWrapper = (isAuthenticated: boolean) => {
  return ({ children }: { children: React.ReactNode }) => (
    <CartProvider isAuthenticated={isAuthenticated}>{children}</CartProvider>
  )
}

const createMockProduct = (id: number, overrides = {}) => ({
  id,
  title: `Product ${id}`,
  price: 100000,
  discount: null,
  discountedPrice: null,
  solution: 'test',
  slug: `product-${id}`,
  image: '/test.jpg',
  categoryId: 1,
  category: { name: 'Test', iconPath: '/icon.svg' },
  ...overrides,
})

const mockFetchResponse = (products: ReturnType<typeof createMockProduct>[]) => ({
  ok: true,
  json: vi.fn().mockResolvedValue({ products }),
})

describe('useCart guest mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockReset()
    // Default mock for fetchGuestDetails - returns empty products
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ products: [] }),
    })

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      localStorageMock.getItem,
    )
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      localStorageMock.setItem,
    )
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      localStorageMock.removeItem,
    )
    localStorageMock.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with empty cart items for guest', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })
    expect(result.current.cartItems).toEqual([])
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isAdding).toBe(false)
  })

  it('adds an item to guest cart and persists to localStorage', async () => {
    // Mock fetchGuestDetails to return a product
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        products: [{
          id: 1,
          title: 'Test Product',
          price: 100000,
          discount: null,
          discountedPrice: null,
          solution: 'test',
          slug: 'test-product',
          image: '/test.jpg',
          categoryId: 1,
          category: { name: 'Test', iconPath: '/icon.svg' },
        }],
      }),
    })

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })

    act(() => {
      result.current.addToCart(1, 2)
    })

    // Wait for the enrichment effect to run
    await vi.waitFor(() => {
      expect(result.current.cartItems.length).toBe(1)
    })
    
    expect(result.current.cartItems[0].id).toBe(1)
    expect(result.current.cartItems[0].quantity).toBe(2)
  })

  it('increments quantity when adding same product twice', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        products: [{
          id: 1,
          title: 'Test Product',
          price: 100000,
          discount: null,
          discountedPrice: null,
          solution: 'test',
          slug: 'test-product',
          image: '/test.jpg',
          categoryId: 1,
          category: { name: 'Test', iconPath: '/icon.svg' },
        }],
      }),
    })

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })

    act(() => {
      result.current.addToCart(1, 1)
      result.current.addToCart(1, 3)
    })

    await vi.waitFor(() => {
      expect(result.current.cartItems.length).toBe(1)
    })
    expect(result.current.cartItems[0].quantity).toBe(4)
  })

  it('sets isAdding temporarily when adding to cart', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })

    expect(result.current.isAdding).toBe(false)

    act(() => {
      result.current.addToCart(1, 1)
    })

    expect(result.current.isAdding).toBe(true)

    act(() => {
      vi.advanceTimersByTime(350)
    })

    expect(result.current.isAdding).toBe(false)
    vi.useRealTimers()
  })

  it('removes an item from guest cart', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        products: [
          { id: 1, title: 'P1', price: 100000, discount: null, discountedPrice: null, solution: '', slug: 'p1', image: '', categoryId: 1, category: { name: '', iconPath: '' } },
          { id: 2, title: 'P2', price: 200000, discount: null, discountedPrice: null, solution: '', slug: 'p2', image: '', categoryId: 1, category: { name: '', iconPath: '' } },
        ],
      }),
    })

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })

    act(() => {
      result.current.addToCart(1, 1)
      result.current.addToCart(2, 1)
    })

    await vi.waitFor(() => {
      expect(result.current.cartItems.length).toBe(2)
    })

    act(() => {
      result.current.removeFromCart(1)
    })

    await vi.waitFor(() => {
      expect(result.current.cartItems.length).toBe(1)
    })
    expect(result.current.cartItems[0].id).toBe(2)
  })

  it('updates quantity of an existing guest cart item', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        products: [{
          id: 1, title: 'Test', price: 100000, discount: null, discountedPrice: null, solution: '', slug: 'test', image: '', categoryId: 1, category: { name: '', iconPath: '' },
        }],
      }),
    })

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })

    act(() => {
      result.current.addToCart(1, 1)
    })

    await vi.waitFor(() => {
      expect(result.current.cartItems.length).toBe(1)
    })

    act(() => {
      result.current.updateQuantity(1, 5)
    })

    await vi.waitFor(() => {
      expect(result.current.cartItems[0].quantity).toBe(5)
    })
  })

  it('removes item when quantity is set to 0 or less', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        products: [{
          id: 1, title: 'Test', price: 100000, discount: null, discountedPrice: null, solution: '', slug: 'test', image: '', categoryId: 1, category: { name: '', iconPath: '' },
        }],
      }),
    })

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })

    act(() => {
      result.current.addToCart(1, 1)
    })

    await vi.waitFor(() => {
      expect(result.current.cartItems.length).toBe(1)
    })

    act(() => {
      result.current.updateQuantity(1, 0)
    })

    await vi.waitFor(() => {
      expect(result.current.cartItems.length).toBe(0)
    })
  })

  it('refreshes cart from localStorage', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        products: [{
          id: 1, title: 'Test', price: 100000, discount: null, discountedPrice: null, solution: '', slug: 'test', image: '', categoryId: 1, category: { name: '', iconPath: '' },
        }],
      }),
    })

    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })

    act(() => {
      result.current.addToCart(1, 1)
    })

    await vi.waitFor(() => {
      expect(result.current.cartItems.length).toBe(1)
    })

    // Create a new hook instance to simulate re-reading from localStorage
    const { result: result2 } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })

    await vi.waitFor(() => {
      expect(result2.current.cartItems.length).toBe(1)
    })
    expect(result2.current.cartItems[0].id).toBe(1)
  })

  it('waitForCartSync resolves immediately for guest', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })

    await act(async () => {
      await result.current.waitForCartSync()
    })

    expect(result.current.cartItems).toEqual([])
  })

  it('isAuthenticated is false for guest mode', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('cart is null for guest mode', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(false),
    })
    expect(result.current.cart).toBeNull()
  })
})