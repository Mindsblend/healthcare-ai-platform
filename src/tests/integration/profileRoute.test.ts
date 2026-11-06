import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/shop/profile/route'

const { requireAuthority, fetchCurrentUser } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  fetchCurrentUser: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/shop/services/UserService', () => ({
  UserService: {
    fetchCurrentUser,
  },
}))

describe('GET /api/shop/profile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the current user profile', async () => {
    const session = { id: 'user-123' }
    const user = { id: 'user-123', name: 'Test User' }

    requireAuthority.mockResolvedValue(session)
    fetchCurrentUser.mockResolvedValue(user)

    const response = await GET()

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })
    expect(fetchCurrentUser).toHaveBeenCalledWith(session.id)
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(user)
  })

  it('propagates authorization failure without fetching the profile', async () => {
    requireAuthority.mockRejectedValue(new Error('Unauthorized'))

    await expect(GET()).rejects.toThrow('Unauthorized')
    expect(fetchCurrentUser).not.toHaveBeenCalled()
  })

  it('returns 500 when fetching the profile fails', async () => {
    requireAuthority.mockResolvedValue({ id: 'user-123' })
    fetchCurrentUser.mockRejectedValue(new Error('Database unavailable'))

    const response = await GET()

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Failed to fetch user info',
    })
  })
})