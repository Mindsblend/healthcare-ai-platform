import { prisma } from '@/lib/prisma'
import {
  MAX_NOTIFICATION_ATTEMPTS,
  NOTIFICATION_BATCH_SIZE,
  NOTIFICATION_LEASE_MINUTES,
  NOTIFICATION_SEND_CONCURRENCY,
  RETRY_DELAYS_MINUTES,
} from '../constants'
import {
  isPushConfigured,
  isPushDeliveryEnabled,
  sendPushNotification,
} from './pushSender'

export type DispatchResult = {
  sent: number
  failed: number
  retry: boolean
  skipped: boolean
}

function nextAttemptDate(attempts: number): Date {
  const index = Math.min(attempts, RETRY_DELAYS_MINUTES.length - 1)
  const minutes = RETRY_DELAYS_MINUTES[index]
  return new Date(Date.now() + minutes * 60_000)
}

function truncateError(error: string | undefined): string | null {
  if (!error) return null
  return error.slice(0, 500)
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (index < items.length) {
        const current = index
        index += 1
        await worker(items[current])
      }
    },
  )

  await Promise.all(workers)
}

/**
 * به‌روزرسانی آمار کمپین بر اساس رکوردهای تحویل.
 */
export async function refreshCampaignStats(campaignId: string): Promise<void> {
  const [pendingNotifications, sentDeliveries, failedDeliveries] =
    await Promise.all([
      prisma.notification.count({
        where: { campaignId, status: 'PENDING' },
      }),
      prisma.notificationDelivery.count({
        where: {
          status: 'SENT',
          notification: { campaignId },
        },
      }),
      prisma.notificationDelivery.count({
        where: {
          status: 'FAILED',
          notification: { campaignId },
        },
      }),
    ])

  const completed = pendingNotifications === 0

  await prisma.promotionCampaign.update({
    where: { id: campaignId },
    data: {
      sentCount: sentDeliveries,
      failedCount: failedDeliveries,
      status: completed ? 'COMPLETED' : 'SENDING',
      ...(completed ? { sentAt: new Date() } : {}),
    },
  })
}

/**
 * ارسال یک اعلان از Outbox به تمام دستگاه‌های کاربر.
 *
 * این تابع هرگز نباید باعث شکست تراکنش تغییر وضعیت سفارش شود؛ فراخوان‌ها
 * آن را بعد از commit و به‌صورت fire-and-forget صدا می‌زنند.
 */
export async function dispatchNotification(
  notificationId: string,
): Promise<DispatchResult> {
  const empty: DispatchResult = {
    sent: 0,
    failed: 0,
    retry: false,
    skipped: true,
  }

  if (!isPushDeliveryEnabled() || !isPushConfigured()) {
    return empty
  }

  const lease = new Date(
    Date.now() + NOTIFICATION_LEASE_MINUTES * 60_000,
  )

  // Claim: فقط یک فرایند می‌تواند این اعلان را بردارد.
  const claimed = await prisma.notification.updateMany({
    where: { id: notificationId, status: 'PENDING' },
    data: { nextAttemptAt: lease },
  })

  if (claimed.count !== 1) return empty

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: {
      user: {
        include: {
          pushSubscriptions: true,
        },
      },
    },
  })

  if (!notification) return empty

  const preference = await prisma.notificationPreference.findUnique({
    where: { userId: notification.userId },
    select: { orderUpdates: true, promotions: true },
  })

  const allowed =
    notification.type === 'ORDER_STATUS'
      ? (preference?.orderUpdates ?? true)
      : Boolean(preference?.promotions)

  if (!allowed) {
    await prisma.notification.update({
      where: { id: notification.id },
      data: { status: 'SENT', lastError: 'disabled_by_preference' },
    })
    return empty
  }

  const subscriptions = notification.user.pushSubscriptions

  if (subscriptions.length === 0) {
    await prisma.notification.update({
      where: { id: notification.id },
      data: { status: 'SENT', lastError: null },
    })
    return { ...empty, skipped: false }
  }

  let sent = 0
  let failed = 0
  let retry = false

  for (const subscription of subscriptions) {
    const delivery = await prisma.notificationDelivery.upsert({
      where: {
        notificationId_subscriptionId: {
          notificationId: notification.id,
          subscriptionId: subscription.id,
        },
      },
      create: {
        notificationId: notification.id,
        subscriptionId: subscription.id,
      },
      update: {},
    })

    if (delivery.status === 'SENT') {
      sent += 1
      continue
    }

    const result = await sendPushNotification(subscription, {
      title: notification.title,
      body: notification.body,
      url: notification.url ?? '/profile/notifications',
      tag: notification.id,
    })

    if (result.ok) {
      await prisma.notificationDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          attempts: { increment: 1 },
          lastError: null,
        },
      })
      sent += 1
      continue
    }

    if (result.expired) {
      // 404/410 یعنی اشتراک دیگر معتبر نیست؛ آن را حذف می‌کنیم.
      await prisma.pushSubscription.deleteMany({
        where: { id: subscription.id },
      })
      failed += 1
      continue
    }

    await prisma.notificationDelivery.update({
      where: { id: delivery.id },
      data: {
        status: result.permanent ? 'FAILED' : 'PENDING',
        attempts: { increment: 1 },
        lastError: truncateError(result.error),
      },
    })

    if (result.permanent) {
      failed += 1
    } else {
      retry = true
    }
  }

  const attempts = notification.attempts + 1
  const canRetry = retry && attempts < notification.maxAttempts

  const status =
    sent > 0 && !canRetry
      ? 'SENT'
      : canRetry
        ? 'PENDING'
        : sent > 0
          ? 'SENT'
          : 'FAILED'

  await prisma.notification.update({
    where: { id: notification.id },
    data: {
      attempts,
      status,
      lastError: status === 'FAILED' ? 'all_deliveries_failed' : null,
      nextAttemptAt:
        status === 'PENDING' ? nextAttemptDate(attempts) : lease,
    },
  })

  if (notification.campaignId) {
    await refreshCampaignStats(notification.campaignId)
  }

  return { sent, failed, retry: status === 'PENDING', skipped: false }
}

/**
 * پردازش اعلان‌های سررسیده برای cron خارجی.
 */
export async function dispatchDueNotifications(
  limit = NOTIFICATION_BATCH_SIZE,
): Promise<{ processed: number; sent: number; failed: number }> {
  if (!isPushDeliveryEnabled() || !isPushConfigured()) {
    return { processed: 0, sent: 0, failed: 0 }
  }

  const due = await prisma.notification.findMany({
    where: {
      status: 'PENDING',
      nextAttemptAt: { lte: new Date() },
    },
    orderBy: { nextAttemptAt: 'asc' },
    take: limit,
    select: { id: true },
  })

  let sent = 0
  let failed = 0

  await runWithConcurrency(
    due,
    NOTIFICATION_SEND_CONCURRENCY,
    async (notification) => {
      try {
        const result = await dispatchNotification(notification.id)
        sent += result.sent
        failed += result.failed
      } catch (error) {
        console.error(
          '[notifications] dispatch failed',
          notification.id,
          error,
        )
      }
    },
  )

  const campaigns = await prisma.promotionCampaign.findMany({
    where: { status: 'SENDING' },
    select: { id: true },
  })

  for (const campaign of campaigns) {
    await refreshCampaignStats(campaign.id).catch((error) => {
      console.error('[notifications] campaign stats failed', campaign.id, error)
    })
  }

  return { processed: due.length, sent, failed }
}

export { MAX_NOTIFICATION_ATTEMPTS }
