import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthorityMock, cookiesMock, deleteCookieMock } = vi.hoisted(
  () => ({
    requireAuthorityMock: vi.fn(),
    cookiesMock: vi.fn(),
    deleteCookieMock: vi.fn(),
  }),
)

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

import { POST } from '@/app/api/auth/logout/route'

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })
    cookiesMock.mockResolvedValue({
      delete: deleteCookieMock,
    })
  })

  it('deletes the session cookie for an authorized user', async () => {
    const response = await POST()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: 'Logged out successfully',
    })
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })
    expect(deleteCookieMock).toHaveBeenCalledWith('session')
  })

  it('propagates authorization failures without deleting the cookie', async () => {
    const authorizationError = new Error('Unauthorized')
    requireAuthorityMock.mockRejectedValue(authorizationError)

    await expect(POST()).rejects.toThrow('Unauthorized')

    expect(cookiesMock).not.toHaveBeenCalled()
    expect(deleteCookieMock).not.toHaveBeenCalled()
  })

  it('returns 500 when deleting the session cookie fails', async () => {
    deleteCookieMock.mockImplementation(() => {
      throw new Error('Cookie deletion failed')
    })

    const response = await POST()

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: 'Error logging out',
    })
  })
})
