import { createHash, randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { dispatchDueNotifications, dispatchNotification } from './notificationDispatcher'
import { enqueueTestNotification } from './notificationOutbox'

export type CreatePromotionCampaignInput = {
  adminId: string
  title: string
  body: string
  url: string
}

export function promotionDedupeKey(input: {
  title: string
  body: string
  url: string
}): string {
  return createHash('sha256')
    .update(`${input.title}\n${input.body}\n${input.url}`)
    .digest('hex')
}

export async function createPromotionCampaign(
  input: CreatePromotionCampaignInput,
) {
  const dedupeKey = promotionDedupeKey(input)

  const existing = await prisma.promotionCampaign.findUnique({
    where: { dedupeKey },
    select: { id: true },
  })

  if (existing) {
    throw new Error('این کمپین قبلاً ثبت و ارسال شده است')
  }

  const campaign = await prisma.$transaction(async (tx) => {
    const created = await tx.promotionCampaign.create({
      data: {
        title: input.title,
        body: input.body,
        url: input.url,
        dedupeKey,
        status: 'SENDING',
        createdBy: input.adminId,
      },
    })

    const optedIn = await tx.notificationPreference.findMany({
      where: { promotions: true },
      select: { userId: true },
    })

    if (optedIn.length > 0) {
      await tx.notification.createMany({
        data: optedIn.map((preference) => ({
          id: randomUUID(),
          userId: preference.userId,
          type: 'PROMOTION' as const,
          title: input.title,
          body: input.body,
          url: input.url,
          dedupeKey: `promotion:${created.id}:${preference.userId}`,
          campaignId: created.id,
        })),
        skipDuplicates: true,
      })
    }

    return tx.promotionCampaign.update({
      where: { id: created.id },
      data: {
        totalRecipients: optedIn.length,
        status: optedIn.length === 0 ? 'COMPLETED' : 'SENDING',
        sentAt: optedIn.length === 0 ? new Date() : null,
      },
    })
  })

  // ارسال بهترین‌تلاش به‌صورت غیرمسدودکننده؛ باقی موارد با cron پردازش می‌شوند.
  void dispatchDueNotifications(20).catch((error) => {
    console.error('[promotion] initial dispatch failed', campaign.id, error)
  })

  return campaign
}

export async function listPromotionCampaigns() {
  return prisma.promotionCampaign.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      body: true,
      url: true,
      status: true,
      totalRecipients: true,
      sentCount: true,
      failedCount: true,
      createdAt: true,
      sentAt: true,
    },
  })
}

export async function sendPromotionTestToSelf(input: {
  userId: string
  title: string
  body: string
  url: string
}) {
  const notificationId = await prisma.$transaction(async (tx) => {
    return enqueueTestNotification(tx, {
      userId: input.userId,
      title: input.title,
      body: input.body,
      url: input.url,
    })
  })

  const result = await dispatchNotification(notificationId)

  return { notificationId, ...result }
}
