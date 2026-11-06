import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/shop/profile/pages/address/route'

const { requireAuthority, fetchUserWithAddresses } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  fetchUserWithAddresses: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/shop/services/UserService', () => ({
  UserService: {
    fetchUserWithAddresses,
  },
}))

describe('GET /api/shop/profile/pages/address', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns addresses belonging to the current user', async () => {
    const session = { id: 'user-123' }
    const addresses = [
      { id: 'address-1', city: 'Berlin', isDefault: true },
      { id: 'address-2', city: 'Munich', isDefault: false },
    ]

    requireAuthority.mockResolvedValue(session)
    fetchUserWithAddresses.mockResolvedValue(addresses)

    const response = await GET()

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })
    expect(fetchUserWithAddresses).toHaveBeenCalledWith(session.id)
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(addresses)
  })

  it('propagates authorization failure without fetching addresses', async () => {
    requireAuthority.mockRejectedValue(new Error('Unauthorized'))

    await expect(GET()).rejects.toThrow('Unauthorized')
    expect(fetchUserWithAddresses).not.toHaveBeenCalled()
  })

  it('returns 500 when fetching addresses fails', async () => {
    requireAuthority.mockResolvedValue({ id: 'user-123' })
    fetchUserWithAddresses.mockRejectedValue(
      new Error('Database unavailable'),
    )

    const response = await GET()

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Failed to fetch user addresses',
    })
  })
})