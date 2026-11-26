import type { OrderStatus } from '@/features/shop/shop.types'

/**
 * متن اعلان‌های وضعیت سفارش.
 *
 * این متن‌ها عمداً هیچ نام محصول، تشخیص، دارو یا داده سلامت دیگری ندارند.
 * وضعیت PENDING اعلان ندارد.
 */
export const ORDER_STATUS_NOTIFICATIONS: Partial<
  Record<OrderStatus, { title: string; body: string }>
> = {
  PAID: {
    title: 'پرداخت موفق',
    body: 'پرداخت سفارش شما با موفقیت ثبت شد.',
  },
  PREPARING: {
    title: 'در حال آماده‌سازی',
    body: 'سفارش شما در حال آماده‌سازی است.',
  },
  DELIVERING: {
    title: 'در حال ارسال',
    body: 'خرید شما در حال ارسال است.',
  },
  DELIVERED: {
    title: 'تحویل شد',
    body: 'بسته شما با موفقیت تحویل داده شد.',
  },
  CANCELED: {
    title: 'لغو سفارش',
    body: 'سفارش شما لغو شد.',
  },
  REFUNDED: {
    title: 'بازگشت وجه',
    body: 'مبلغ سفارش شما مرجوع شد.',
  },
  FAILED: {
    title: 'پرداخت ناموفق',
    body: 'پرداخت سفارش شما ناموفق بود.',
  },
}

export const MAX_NOTIFICATION_ATTEMPTS = 5

/** تأخیر تلاش‌های مجدد بر حسب دقیقه (به ترتیب تلاش). */
export const RETRY_DELAYS_MINUTES = [1, 5, 15, 60, 360] as const

export const NOTIFICATION_BATCH_SIZE = 50
export const NOTIFICATION_SEND_CONCURRENCY = 5
export const NOTIFICATION_LEASE_MINUTES = 10

export const PROMOTION_TITLE_MAX_LENGTH = 80
export const PROMOTION_BODY_MAX_LENGTH = 240
export const PROMOTION_URL_MAX_LENGTH = 512
