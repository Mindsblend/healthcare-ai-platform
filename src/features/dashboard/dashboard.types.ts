import { Prisma } from '@prisma/client'

// ============================================
// ANALYTICS TYPES
// ============================================

export interface VisitMonth {
  id: string
  year: number
  month: number
  visits: number
  updatedAt: Date
}

export type GetTrackedVisitsResponse = VisitMonth[]

// ============================================
// SUBSCRIPTION TYPES
// ============================================

export interface CreateSubscriptionInput {
  email: string
}

export type SubscriptionPayload = Prisma.SubscriptionGetPayload<{
  select: {
    email: true
  }
}>
