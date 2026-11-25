import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GUEST_CART_KEY, parseGuestCart } from '@/features/shop/hooks/cart/useCart'

// Mock localStorage for node environment
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

describe('parseGuestCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorageMock.clear()
  })

  it('returns empty array when localStorage is empty', () => {
    expect(parseGuestCart()).toEqual([])
  })

  it('returns empty array when guest_cart key does not exist', () => {
    expect(parseGuestCart()).toEqual([])
  })

  it('parses valid guest cart items', () => {
    const items = [
      { productId: 1, quantity: 2 },
      { productId: 5, quantity: 1 },
    ]
    localStorageMock.setItem(GUEST_CART_KEY, JSON.stringify(items))

    const result = parseGuestCart()
    expect(result).toEqual(items)
  })

  it('filters out invalid items (non-integer productId)', () => {
    const items = [
      { productId: 1, quantity: 2 },
      { productId: 'not-a-number', quantity: 1 },
      { productId: 3.5, quantity: 1 },
      { productId: 5, quantity: 1 },
    ]
    localStorageMock.setItem(GUEST_CART_KEY, JSON.stringify(items))

    const result = parseGuestCart()
    expect(result).toEqual([
      { productId: 1, quantity: 2 },
      { productId: 5, quantity: 1 },
    ])
  })

  it('filters out items with non-positive quantity', () => {
    const items = [
      { productId: 1, quantity: 0 },
      { productId: 2, quantity: -1 },
      { productId: 3, quantity: 1 },
    ]
    localStorageMock.setItem(GUEST_CART_KEY, JSON.stringify(items))

    const result = parseGuestCart()
    expect(result).toEqual([{ productId: 3, quantity: 1 }])
  })

  it('purges corrupt JSON and returns empty array', () => {
    localStorageMock.setItem(GUEST_CART_KEY, '{not valid json')

    const result = parseGuestCart()
    expect(result).toEqual([])
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(GUEST_CART_KEY)
  })

  it('returns empty array for non-array JSON', () => {
    localStorageMock.setItem(GUEST_CART_KEY, JSON.stringify({ foo: 'bar' }))

    const result = parseGuestCart()
    expect(result).toEqual([])
  })

  it('returns empty array for null localStorage item', () => {
    localStorageMock.setItem(GUEST_CART_KEY, 'null')

    const result = parseGuestCart()
    expect(result).toEqual([])
  })
})
