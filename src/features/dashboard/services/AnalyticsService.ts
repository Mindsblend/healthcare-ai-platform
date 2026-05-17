import { prisma } from '@/lib/prisma'
import { SubscriptionPayload, VisitMonth } from '@/components/types/types'

export class AnalyticsService {
  static async trackVisit(): Promise<VisitMonth> {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    return prisma.visitMonth.upsert({
      where: { year_month: { year, month } },
      update: { visits: { increment: 1 } },
      create: { year, month, visits: 1 },
    })
  }

  static async fetchTrackedVisits(): Promise<VisitMonth[]> {
    return prisma.visitMonth.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    })
  }

  static async createSubscription(data: {
    email: string
  }): Promise<SubscriptionPayload> {
    return prisma.subscription.create({
      data: {
        email: data.email,
      },
    })
  }
}
