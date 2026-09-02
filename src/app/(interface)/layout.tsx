
import Footer from '@/components/layout/Footer'
import CallToAction from '@/components/layout/CallToAction'

import NavbarWrapper from '@/components/layout/NavbarWrapper'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'محصولات سالم و ارگانیک',
  path: '/',
})

export default function InterfaceLayout({
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
