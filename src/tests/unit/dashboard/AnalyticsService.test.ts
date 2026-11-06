import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { AnalyticsService } from '@/features/dashboard/services/AnalyticsService'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    visitMonth: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    subscription: {
      create: vi.fn(),
    },
  },
}))

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('trackVisit', () => {
    it('increments visits for the current year and month', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))

      const visitMonth = {
        year: 2026,
        month: 3,
        visits: 11,
      }

      vi.mocked(prisma.visitMonth.upsert).mockResolvedValue(
        visitMonth as any,
      )

      const result = await AnalyticsService.trackVisit()

      expect(result).toEqual(visitMonth)
      expect(prisma.visitMonth.upsert).toHaveBeenCalledWith({
        where: {
          year_month: {
            year: 2026,
            month: 3,
          },
        },
        update: {
          visits: {
            increment: 1,
          },
        },
        create: {
          year: 2026,
          month: 3,
          visits: 1,
        },
      })
    })

    it('propagates errors from Prisma', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.visitMonth.upsert).mockRejectedValue(error)

      await expect(AnalyticsService.trackVisit()).rejects.toThrow(
        'Database unavailable',
      )
    })
  })

  describe('fetchTrackedVisits', () => {
    it('returns visits ordered by year and month descending', async () => {
      const visits = [
        { year: 2026, month: 3, visits: 20 },
        { year: 2026, month: 2, visits: 15 },
        { year: 2025, month: 12, visits: 30 },
      ]

      vi.mocked(prisma.visitMonth.findMany).mockResolvedValue(
        visits as any,
      )

      const result = await AnalyticsService.fetchTrackedVisits()

      expect(result).toEqual(visits)
      expect(prisma.visitMonth.findMany).toHaveBeenCalledWith({
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
      })
    })

    it('returns an empty array when no visits are tracked', async () => {
      vi.mocked(prisma.visitMonth.findMany).mockResolvedValue([])

      const result = await AnalyticsService.fetchTrackedVisits()

      expect(result).toEqual([])
    })

    it('propagates errors from Prisma', async () => {
      vi.mocked(prisma.visitMonth.findMany).mockRejectedValue(
        new Error('Database unavailable'),
      )

      await expect(
        AnalyticsService.fetchTrackedVisits(),
      ).rejects.toThrow('Database unavailable')
    })
  })

  describe('createSubscription', () => {
    it('creates a subscription using the supplied email', async () => {
      const input = { email: 'reader@example.com' }
      const subscription = {
        id: 1,
        email: input.email,
      }

      vi.mocked(prisma.subscription.create).mockResolvedValue(
        subscription as any,
      )

      const result = await AnalyticsService.createSubscription(input)

      expect(result).toEqual(subscription)
      expect(prisma.subscription.create).toHaveBeenCalledWith({
        data: {
          email: input.email,
        },
      })
    })

    it('propagates errors from Prisma', async () => {
      vi.mocked(prisma.subscription.create).mockRejectedValue(
        new Error('Database unavailable'),
      )

      await expect(
        AnalyticsService.createSubscription({
          email: 'reader@example.com',
        }),
      ).rejects.toThrow('Database unavailable')
    })
  })
})
