import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/shop/profile/pages/address/create/route'

const { requireAuthority, createAddress } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  createAddress: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/shop/services/UserService', () => ({
  UserService: {
    createAddress,
  },
}))

describe('POST /api/shop/profile/pages/address/create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('creates an address for the current user', async () => {
    const session = { id: 'user-123' }
    const input = { city: 'Berlin', street: 'Example Street 1' }
    const address = { id: 'address-1', ...input }

    requireAuthority.mockResolvedValue(session)
    createAddress.mockResolvedValue(address)

    const request = new Request(
      'http://localhost/api/shop/profile/pages/address/create',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      },
    )

    const response = await POST(request)

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })
    expect(createAddress).toHaveBeenCalledWith(session.id, input)
    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toEqual(address)
  })

  it('propagates authorization failure without creating an address', async () => {
    requireAuthority.mockRejectedValue(new Error('Unauthorized'))

    const request = new Request(
      'http://localhost/api/shop/profile/pages/address/create',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: 'Berlin' }),
      },
    )

    await expect(POST(request)).rejects.toThrow('Unauthorized')
    expect(createAddress).not.toHaveBeenCalled()
  })

  it('returns the service error when address creation fails', async () => {
    requireAuthority.mockResolvedValue({ id: 'user-123' })
    createAddress.mockRejectedValue(new Error('Invalid address'))

    const request = new Request(
      'http://localhost/api/shop/profile/pages/address/create',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: 'Berlin' }),
      },
    )

    const response = await POST(request)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid address',
    })
    expect(console.error).toHaveBeenCalled()
  })

  it('returns 500 for malformed JSON', async () => {
    requireAuthority.mockResolvedValue({ id: 'user-123' })

    const request = new Request(
      'http://localhost/api/shop/profile/pages/address/create',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json',
      },
    )

    const response = await POST(request)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: expect.stringContaining('JSON'),
    })
    expect(createAddress).not.toHaveBeenCalled()
  })
})
