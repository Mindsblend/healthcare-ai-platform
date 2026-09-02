import Footer from '@/components/layout/Footer'
import NavbarWrapper from '@/components/layout/NavbarWrapper'

import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'خرید محصولات سالم و ارگانیک',
  description:
    'محصولات سالم و ارگانیک را با اطلاعات شفاف، قیمت و شرایط ارسال بررسی و خرید کنید.',
  path: '/products',
})

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavbarWrapper />
      {children}
      <Footer />
    </>
  )
}
