import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'مجموعه‌های پیشنهادی سلامت',
  description:
    'مجموعه‌هایی از محصولات منتخب برای یک انتخاب ساده‌تر و آگاهانه‌تر.',
  path: '/collections',
})

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
