import type { Metadata } from 'next'

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/$/, '')
export const siteName = 'دیجی سلامت'
export const defaultDescription =
  'فروشگاه محصولات سالم و ارگانیک؛ اطلاعات شفاف محصول، خرید مطمئن و انتخاب آگاهانه برای سبک زندگی سالم.'

export function absoluteUrl(path = '/') {
  return new URL(path, `${siteUrl}/`).toString()
}

export function plainText(value: string | null | undefined, limit = 160) {
  const text = (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text
}

export function pageMetadata(input: {
  title: string
  description?: string | null
  path: string
  image?: string | null
  type?: 'website' | 'article'
  noIndex?: boolean
}): Metadata {
  const description = plainText(input.description, 160) || defaultDescription
  const image = input.image ? [input.image] : undefined

  return {
    title: input.title,
    description,
    alternates: { canonical: input.path },
    robots: input.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: input.title,
      description,
      url: input.path,
      siteName,
      locale: 'fa_IR',
      type: input.type ?? 'website',
      images: image,
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description,
      images: image,
    },
  }
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
