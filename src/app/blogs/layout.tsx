import Footer from '@/components/layout/Footer'
import NavbarWrapper from '@/components/layout/NavbarWrapper'

import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'مجله سلامت و سبک زندگی',
  description:
    'راهنماهای کاربردی برای انتخاب محصولات سالم و داشتن سبک زندگی آگاهانه.',
  path: '/blogs',
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
      <Footer />
    </>
  )
}
