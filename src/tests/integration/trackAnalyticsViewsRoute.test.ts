import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/dashboard/analytics/views/track/route'

const { trackVisit } = vi.hoisted(() => ({
  trackVisit: vi.fn(),
}))

vi.mock('@/features/dashboard/services/AnalyticsService', () => ({
  AnalyticsService: {
    trackVisit,
  },
}))

describe('POST /api/dashboard/analytics/views/track', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('records a visit and returns the result', async () => {
    const visits = { total: 42 }
    trackVisit.mockResolvedValue(visits)

    const response = await POST()

    expect(trackVisit).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(visits)
  })

  it('returns 500 when recording a visit fails', async () => {
    trackVisit.mockRejectedValue(new Error('Database unavailable'))

    const response = await POST()

    expect(trackVisit).toHaveBeenCalledOnce()
    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Failed to record visit',
    })
    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Database unavailable' }),
    )
  })
})