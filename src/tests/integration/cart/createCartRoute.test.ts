import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthorityMock, createCartMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  createCartMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/CartService', () => ({
  CartService: {
    createCart: createCartMock,
  },
}))

import { POST } from '@/app/api/shop/cart/create/route'

describe('POST /api/cart/create', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })
  })

  it('creates a cart for the authenticated user', async () => {
    const cart = {
      id: 1,
      userId: 'user-123',
      status: 'ACTIVE',
      items: [],
    }

    createCartMock.mockResolvedValue(cart)

    const response = await POST()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(cart)

    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })

    expect(createCartMock).toHaveBeenCalledWith({
      userId: 'user-123',
    })
  })

  it('uses the session ID rather than a client-provided user ID', async () => {
    createCartMock.mockResolvedValue({
      id: 1,
      userId: 'user-123',
    })

    await POST()

    expect(createCartMock).toHaveBeenCalledOnce()
    expect(createCartMock).toHaveBeenCalledWith({
      userId: 'user-123',
    })
  })

  it('returns 500 when authentication fails', async () => {
    requireAuthorityMock.mockRejectedValue(new Error('UNAUTHORIZED'))

    const response = await POST()

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to create cart',
    })

    expect(createCartMock).not.toHaveBeenCalled()
  })

  it('returns 500 when cart creation fails', async () => {
    createCartMock.mockRejectedValue(new Error('Database unavailable'))

    const response = await POST()

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to create cart',
    })
  })
})
