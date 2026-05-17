// features/dashboard/services/analyticsService.ts

import { prisma } from '@/lib/prisma'
import {
  SubscriptionPayload,
  VisitMonth,
  CreateSubscriptionInput,
} from '../dashboard.types'

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

  static async createSubscription(
    input: CreateSubscriptionInput,
  ): Promise<SubscriptionPayload> {
    return prisma.subscription.create({
      data: {
        email: input.email,
      },
    })
  }
}
