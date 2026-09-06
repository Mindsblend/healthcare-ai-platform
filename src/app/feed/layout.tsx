import type { Metadata } from 'next'

import Footer from '@/components/layout/Footer'
import CallToAction from '@/components/layout/CallToAction'
import NavbarWrapper from '@/components/layout/NavbarWrapper'
import { JsonLd } from '@/components/seo/JsonLd'
import { absoluteUrl, defaultDescription, siteName } from '@/lib/seo'

const feedTitle = `فروشگاه محصولات سالم و ارگانیک`
const feedDescription =
  'محصولات سالم، ارگانیک و طبیعی منتخب برای تغذیه، مراقبت از پوست و مو و سبک زندگی سالم‌تر.'

export const metadata: Metadata = {
  title: feedTitle,

  description: feedDescription,

  alternates: {
    canonical: absoluteUrl('/feed'),
  },

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName,
    title: feedTitle,
    description: feedDescription,
    url: absoluteUrl('/feed'),
    images: [
      {
        url: absoluteUrl('/og/logo.svg'),
        width: 1200,
        height: 630,
        alt: `${siteName} - فروشگاه محصولات سالم و ارگانیک`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: feedTitle,
    description: feedDescription,
    images: [absoluteUrl('/og/logo.svg')],
  },
}

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: feedTitle,
          description: feedDescription,
          url: absoluteUrl('/feed'),
          isPartOf: {
            '@type': 'WebSite',
            name: siteName,
            url: absoluteUrl('/'),
          },
        }}
      />

      <NavbarWrapper />

      {children}

      <CallToAction />

      <Footer />
    </>
  )
}
