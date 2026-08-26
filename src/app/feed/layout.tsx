import Footer from '@/components/layout/Footer'
import CallToAction from '@/components/layout/CallToAction'
import NavbarWrapper from '@/components/layout/NavbarWrapper'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'خرید محصولات سالم و ارگانیک',
  description:
    'خرید انواع محصولات سالم، ارگانیک و طبیعی برای تغذیه، مراقبت از پوست و مو و بهبود سبک زندگی. محصولات منتخب سلامت و تندرستی را در Healthcare بررسی و خریداری کنید.',

  keywords: [
    'محصولات سالم',
    'محصولات ارگانیک',
    'خرید محصولات سالم',
    'خرید محصولات ارگانیک',
    'محصولات طبیعی',
    'فروشگاه محصولات سالم',
    'سلامت و تندرستی',
  ],

  alternates: {
    canonical: '/feed',
  },

  openGraph: {
    title: 'خرید محصولات سالم و ارگانیک',
    description: 'انواع محصولات سالم، ارگانیک و طبیعی برای سبک زندگی سالم‌تر.',
    url: '/feed',
    siteName: 'Healthcare',
    locale: 'fa_IR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'خرید محصولات سالم و ارگانیک',
    description: 'انواع محصولات سالم، ارگانیک و طبیعی برای سبک زندگی سالم‌تر.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavbarWrapper />
      {children}
      <CallToAction />
      <Footer />
    </>
  )
}
