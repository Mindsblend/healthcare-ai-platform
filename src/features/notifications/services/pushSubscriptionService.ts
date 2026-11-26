import { prisma } from '@/lib/prisma'
import type {
  PushSubscriptionKeys,
  ValidatedPushSubscription,
} from './pushValidation'

export type NotificationPreferences = {
  orderUpdates: boolean
  promotions: boolean
}

export async function ensureNotificationPreferences(userId: string) {
  return prisma.notificationPreference.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: {
      orderUpdates: true,
      promotions: true,
    },
  })
}

export async function getNotificationPreferences(
  userId: string,
): Promise<NotificationPreferences> {
  return ensureNotificationPreferences(userId)
}

export async function updateNotificationPreferences(
  userId: string,
  input: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  return prisma.notificationPreference.upsert({
    where: { userId },
    create: {
      userId,
      orderUpdates: input.orderUpdates ?? true,
      promotions: input.promotions ?? false,
    },
    update: {
      ...(typeof input.orderUpdates === 'boolean'
        ? { orderUpdates: input.orderUpdates }
        : {}),
      ...(typeof input.promotions === 'boolean'
        ? { promotions: input.promotions }
        : {}),
    },
    select: {
      orderUpdates: true,
      promotions: true,
    },
  })
}

export async function savePushSubscription(input: {
  userId: string
  subscription: ValidatedPushSubscription
  userAgent?: string | null
}) {
  const { userId, subscription, userAgent } = input

  // اگر همین endpoint قبلاً برای کاربر دیگری ثبت شده باشد (مثلاً دستگاه
  // مشترک)، مالکیت آن به کاربر واردشده فعلی منتقل می‌شود.
  const saved = await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userAgent: userAgent?.slice(0, 512) ?? null,
    },
    update: {
      userId,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userAgent: userAgent?.slice(0, 512) ?? null,
    },
  })

  await ensureNotificationPreferences(userId)

  return saved
}

export async function removePushSubscription(input: {
  userId: string
  endpoint: string
}): Promise<number> {
  const result = await prisma.pushSubscription.deleteMany({
    where: {
      userId: input.userId,
      endpoint: input.endpoint,
    },
  })

  return result.count
}

export async function countUserSubscriptions(userId: string): Promise<number> {
  return prisma.pushSubscription.count({ where: { userId } })
}

export type { PushSubscriptionKeys }
