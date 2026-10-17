import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/dashboard/analytics/views/route'

const { requireAuthority, fetchTrackedVisits } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  fetchTrackedVisits: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/dashboard/services/AnalyticsService', () => ({
  AnalyticsService: {
    fetchTrackedVisits,
  },
}))

describe('GET /api/dashboard/analytics/views', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns tracked visits for an authorized admin', async () => {
    const visits = [{ date: '2026-10-15', count: 12 }]
    requireAuthority.mockResolvedValue(undefined)
    fetchTrackedVisits.mockResolvedValue(visits)

    const response = await GET()

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(fetchTrackedVisits).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(visits)
  })

  it('propagates authorization failure without fetching visits', async () => {
    requireAuthority.mockRejectedValue(new Error('Forbidden'))

    await expect(GET()).rejects.toThrow('Forbidden')
    expect(fetchTrackedVisits).not.toHaveBeenCalled()
  })

  it('propagates analytics service failure', async () => {
    requireAuthority.mockResolvedValue(undefined)
    fetchTrackedVisits.mockRejectedValue(new Error('Analytics unavailable'))

    await expect(GET()).rejects.toThrow('Analytics unavailable')
  })
})