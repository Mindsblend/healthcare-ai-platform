import { beforeEach, describe, expect, it, vi } from 'vitest'

const { refreshSessionIfNeededMock } = vi.hoisted(() => ({
  refreshSessionIfNeededMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  refreshSessionIfNeeded: refreshSessionIfNeededMock,
}))

import { POST } from '@/app/api/auth/refresh/route'

describe('POST /api/auth/refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    refreshSessionIfNeededMock.mockResolvedValue(undefined)
  })

  it('returns success when the session refresh completes', async () => {
    const response = await POST()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(refreshSessionIfNeededMock).toHaveBeenCalledOnce()
  })

  it('returns success when no refresh is needed', async () => {
    refreshSessionIfNeededMock.mockResolvedValue(undefined)

    const response = await POST()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
  })

  it('returns 500 when session refresh fails', async () => {
    refreshSessionIfNeededMock.mockRejectedValue(
      new Error('Session refresh failed'),
    )

    const response = await POST()

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Failed to refresh session',
    })
  })
})
