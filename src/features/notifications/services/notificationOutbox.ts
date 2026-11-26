import { randomUUID } from 'node:crypto'
import type { Prisma } from '@/generated/prisma/client'
import type { OrderStatus } from '@/features/shop/shop.types'
import { ORDER_STATUS_NOTIFICATIONS } from '../constants'

export type NotificationTransaction = Prisma.TransactionClient

export function orderNotificationUrl(orderId: string): string {
  return `/profile/orders?orderId=${encodeURIComponent(orderId)}`
}

/**
 * ثبت اعلان وضعیت سفارش در Outbox، داخل همان تراکنشی که وضعیت سفارش
 * تغییر می‌کند. کلید یکتای dedupe از ارسال تکراری برای هر سفارش/وضعیت
 * جلوگیری می‌کند.
 */
export async function enqueueOrderStatusNotification(
  tx: NotificationTransaction,
  input: { orderId: string; userId: string; status: OrderStatus },
): Promise<string | null> {
  const message = ORDER_STATUS_NOTIFICATIONS[input.status]
  if (!message) return null

  const preference = await tx.notificationPreference.findUnique({
    where: { userId: input.userId },
    select: { orderUpdates: true },
  })

  if (preference && !preference.orderUpdates) return null

  const id = randomUUID()

  const result = await tx.notification.createMany({
    data: [
      {
        id,
        userId: input.userId,
        type: 'ORDER_STATUS',
        title: message.title,
        body: message.body,
        url: orderNotificationUrl(input.orderId),
        dedupeKey: `order-status:${input.orderId}:${input.status}`,
        orderId: input.orderId,
      },
    ],
    skipDuplicates: true,
  })

  return result.count === 1 ? id : null
}

/**
 * ثبت اعلان کمپین تخفیف برای یک کاربر. فقط کاربرانی که صراحتاً
 * promotions را فعال کرده‌اند دریافت می‌کنند (پیش‌فرض خاموش است).
 */
export async function enqueuePromotionNotification(
  tx: NotificationTransaction,
  input: {
    userId: string
    campaignId: string
    title: string
    body: string
    url: string
  },
): Promise<string | null> {
  const preference = await tx.notificationPreference.findUnique({
    where: { userId: input.userId },
    select: { promotions: true },
  })

  if (!preference?.promotions) return null

  const id = randomUUID()

  const result = await tx.notification.createMany({
    data: [
      {
        id,
        userId: input.userId,
        type: 'PROMOTION',
        title: input.title,
        body: input.body,
        url: input.url,
        dedupeKey: `promotion:${input.campaignId}:${input.userId}`,
        campaignId: input.campaignId,
      },
    ],
    skipDuplicates: true,
  })

  return result.count === 1 ? id : null
}

/**
 * اعلان تست برای خود کاربر. این مورد از تنظیمات promotions عبور می‌کند
 * چون کاربر صراحتاً دکمه «ارسال آزمایشی» را زده است.
 */
export async function enqueueTestNotification(
  tx: NotificationTransaction,
  input: { userId: string; title: string; body: string; url?: string },
): Promise<string> {
  const id = randomUUID()

  await tx.notification.create({
    data: {
      id,
      userId: input.userId,
      type: 'PROMOTION',
      title: input.title,
      body: input.body,
      url: input.url ?? '/profile/notifications',
      dedupeKey: `test:${input.userId}:${randomUUID()}`,
    },
  })

  return id
}
