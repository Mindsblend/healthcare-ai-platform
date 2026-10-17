import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthorityMock, fetchActiveCartMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  fetchActiveCartMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/CartService', () => ({
  CartService: {
    fetchActiveCart: fetchActiveCartMock,
  },
}))

import { GET } from '@/app/api/shop/cart/route'

describe('GET /api/shop/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })
  })

  it('returns the authenticated user’s active cart', async () => {
    const cart = {
      id: 1,
      userId: 'user-123',
      status: 'ACTIVE',
      items: [],
    }

    fetchActiveCartMock.mockResolvedValue(cart)

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(cart)
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })
    expect(fetchActiveCartMock).toHaveBeenCalledWith({
      userId: 'user-123',
    })
  })

  it('uses the authenticated session ID, not a client-provided user ID', async () => {
    fetchActiveCartMock.mockResolvedValue(null)

    // GET takes no request body; the session is the source of identity.
    await GET()

    expect(fetchActiveCartMock).toHaveBeenCalledWith({
      userId: 'user-123',
    })
    expect(fetchActiveCartMock).toHaveBeenCalledOnce()
  })

  it('returns null when the user has no active cart', async () => {
    fetchActiveCartMock.mockResolvedValue(null)

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toBeNull()
  })

  it('returns 500 when fetching the cart fails', async () => {
    fetchActiveCartMock.mockRejectedValue(new Error('Database unavailable'))

    const response = await GET()

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch cart',
    })
  })

  it('propagates authorization errors before fetching the cart', async () => {
    const authError = new Error('UNAUTHORIZED')
    requireAuthorityMock.mockRejectedValue(authError)

    await expect(GET()).rejects.toBe(authError)

    expect(fetchActiveCartMock).not.toHaveBeenCalled()
  })
})
