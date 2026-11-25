import Footer from '@/components/layout/Footer'
import CallToAction from '@/components/layout/CallToAction'
import NavbarWrapper from '@/components/layout/NavbarWrapper'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

const shopTitle = 'فروشگاه محصولات سالم و ارگانیک'
const shopDescription =
  'محصولات سالم، ارگانیک و طبیعی منتخب برای تغذیه، مراقبت از پوست و مو و سبک زندگی سالم‌تر.'

export const metadata: Metadata = pageMetadata({
  title: shopTitle,
  description: shopDescription,
  path: '/',
})

export default function ShopLayout({
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
