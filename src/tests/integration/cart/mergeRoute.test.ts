import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { requireAuthorityMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
}))

const txMock = {
  cart: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  cartItem: {
    upsert: vi.fn(),
  },
  product: {
    findMany: vi.fn(),
  },
}

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(async (callback: any) => callback(txMock)),
  },
}))

import { POST } from '@/app/api/cart/merge/route'

function createRequest(body: unknown) {
  return new NextRequest('http://localhost/api/cart/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/cart/merge', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('merges guest cart items into user cart', async () => {
    // First findFirst (existing cart) returns null, then create creates cart
    txMock.cart.findFirst.mockResolvedValueOnce(null)
    txMock.cart.create.mockResolvedValue({
      id: 'cart-1',
      userId: 'user-123',
      status: 'ACTIVE',
    })
    txMock.product.findMany.mockResolvedValue([
      { id: 1 },
      { id: 2 },
    ])
    txMock.cartItem.upsert.mockResolvedValue({})
    // Second findFirst (merged cart) returns cart with items
    txMock.cart.findFirst.mockResolvedValueOnce({
      id: 'cart-1',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [
        {
          id: 1,
          cartId: 'cart-1',
          quantity: 2,
          price: 100000,
          product: {
            id: 1,
            title: 'Product 1',
            price: 100000,
            discount: null,
            discountedPrice: null,
            solution: 'test',
            slug: 'product-1',
            image: '/img.jpg',
            categoryId: 1,
            category: { name: 'Cat', iconPath: '/icon.svg' },
          },
        },
      ],
    })

    const response = await POST(
      createRequest({
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      }),
    )

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })
    expect(txMock.cartItem.upsert).toHaveBeenCalledTimes(2)
    expect(txMock.cartItem.upsert).toHaveBeenCalledWith({
      where: { cartId_productId: { cartId: 'cart-1', productId: 1 } },
      update: { quantity: { increment: 2 } },
      create: {
        cartId: 'cart-1',
        productId: 1,
        quantity: 2,
        price: 0,
      },
    })
  })

  it('skips invalid or inactive products during merge', async () => {
    txMock.cart.findFirst.mockResolvedValueOnce(null)
    txMock.cart.create.mockResolvedValue({
      id: 'cart-1',
      userId: 'user-123',
      status: 'ACTIVE',
    })
    txMock.product.findMany.mockResolvedValue([{ id: 1 }])
    txMock.cartItem.upsert.mockResolvedValue({})
    txMock.cart.findFirst.mockResolvedValueOnce({
      id: 'cart-1',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [],
    })

    const response = await POST(
      createRequest({
        items: [
          { productId: 1, quantity: 1 },
          { productId: 999, quantity: 5 },
        ],
      }),
    )

    expect(response.status).toBe(200)
    expect(txMock.cartItem.upsert).toHaveBeenCalledTimes(1)
    expect(txMock.cartItem.upsert).toHaveBeenCalledWith({
      where: { cartId_productId: { cartId: 'cart-1', productId: 1 } },
      update: { quantity: { increment: 1 } },
      create: expect.objectContaining({ productId: 1, quantity: 1 }),
    })
  })

  it('propagates unauthenticated error', async () => {
    requireAuthorityMock.mockRejectedValue(new Error('UNAUTHORIZED'))

    await expect(
      POST(createRequest({ items: [{ productId: 1, quantity: 1 }] })),
    ).rejects.toThrow('UNAUTHORIZED')
  })

  it('returns 400 for invalid items (empty array)', async () => {
    const response = await POST(createRequest({ items: [] }))

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('ورودی نامعتبر است')
  })

  it('returns 400 for quantity exceeding max (99)', async () => {
    const response = await POST(
      createRequest({ items: [{ productId: 1, quantity: 100 }] }),
    )

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('ورودی نامعتبر است')
  })

  it('returns 400 for missing items', async () => {
    const response = await POST(createRequest({}))

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('ورودی نامعتبر است')
  })

  it('calls upsert for each valid item (idempotent increment)', async () => {
    txMock.cart.findFirst.mockResolvedValueOnce(null)
    txMock.cart.create.mockResolvedValue({
      id: 'cart-1',
      userId: 'user-123',
      status: 'ACTIVE',
    })
    txMock.product.findMany.mockResolvedValue([{ id: 1 }])
    txMock.cartItem.upsert.mockResolvedValue({})
    txMock.cart.findFirst.mockResolvedValueOnce({
      id: 'cart-1',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [],
    })

    // First merge
    await POST(createRequest({ items: [{ productId: 1, quantity: 2 }] }))
    // Reset mocks for second call
    txMock.cart.findFirst.mockResolvedValueOnce(null)
    txMock.cart.create.mockResolvedValue({
      id: 'cart-1',
      userId: 'user-123',
      status: 'ACTIVE',
    })
    txMock.cartItem.upsert.mockClear()
    txMock.cart.findFirst.mockResolvedValueOnce({
      id: 'cart-1',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [],
    })

    // Second merge (simulating refresh/tab)
    await POST(createRequest({ items: [{ productId: 1, quantity: 2 }] }))

    // Each call should upsert once
    expect(txMock.cartItem.upsert).toHaveBeenCalledTimes(1)
    expect(txMock.cartItem.upsert).toHaveBeenCalledWith({
      where: { cartId_productId: { cartId: 'cart-1', productId: 1 } },
      update: { quantity: { increment: 2 } },
      create: {
        cartId: 'cart-1',
        productId: 1,
        quantity: 2,
        price: 0,
      },
    })
  })
})
