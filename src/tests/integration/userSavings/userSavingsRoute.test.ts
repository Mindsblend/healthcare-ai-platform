import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthorityMock, fetchUserTotalSavingsMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  fetchUserTotalSavingsMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/UserService', () => ({
  UserService: {
    fetchUserTotalSavings: fetchUserTotalSavingsMock,
  },
}))

import { GET } from '@/app/api/shop/user/savings/route'

describe('GET /api/shop/user/savings', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })

    fetchUserTotalSavingsMock.mockResolvedValue(484900)

    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns the authenticated user savings', async () => {
    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      savingsAmount: 484900,
    })

    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })

    expect(fetchUserTotalSavingsMock).toHaveBeenCalledWith('user-123')
    expect(fetchUserTotalSavingsMock).toHaveBeenCalledOnce()
  })

  it('returns 401 when authentication fails', async () => {
    requireAuthorityMock.mockRejectedValue(new Error('UNAUTHORIZED'))

    const response = await GET()

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({
      error: 'Authentication failed',
    })

    expect(fetchUserTotalSavingsMock).not.toHaveBeenCalled()
  })

  it('uses the session user ID to calculate savings', async () => {
    requireAuthorityMock.mockResolvedValue({
      id: 'authenticated-user-456',
      role: 'USER',
    })

    const response = await GET()

    expect(response.status).toBe(200)
    expect(fetchUserTotalSavingsMock).toHaveBeenCalledWith(
      'authenticated-user-456',
    )
  })

  it('returns 500 when savings calculation fails', async () => {
    fetchUserTotalSavingsMock.mockRejectedValue(
      new Error('Database unavailable'),
    )

    const response = await GET()

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Savings calculation failed',
    })
  })

  it('does not calculate savings when authentication fails', async () => {
    requireAuthorityMock.mockRejectedValue(new Error('Authentication failed'))

    await GET()

    expect(fetchUserTotalSavingsMock).not.toHaveBeenCalled()
  })
})
