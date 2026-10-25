import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/shop/users/route'

const { requireAuthority, fetchAllUsers } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  fetchAllUsers: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/shop/services/UserService', () => ({
  UserService: {
    fetchAllUsers,
  },
}))

describe('GET /api/shop/users', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns users for an authorized admin', async () => {
    const users = [
      { id: 'user-1', name: 'User One' },
      { id: 'user-2', name: 'User Two' },
    ]

    requireAuthority.mockResolvedValue({ id: 'admin-1' })
    fetchAllUsers.mockResolvedValue(users)

    const response = await GET()

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(fetchAllUsers).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(users)
  })

  it('propagates authorization failure without fetching users', async () => {
    requireAuthority.mockRejectedValue(new Error('Forbidden'))

    await expect(GET()).rejects.toThrow('Forbidden')
    expect(fetchAllUsers).not.toHaveBeenCalled()
  })

  it('returns 500 when fetching users fails', async () => {
    requireAuthority.mockResolvedValue({ id: 'admin-1' })
    fetchAllUsers.mockRejectedValue(new Error('Database unavailable'))

    const response = await GET()

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Failed to fetch users',
    })
  })
})
