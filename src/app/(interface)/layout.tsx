import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CallToAction from '@/components/layout/CallToAction'

export default function InterfaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <CallToAction />
      <Footer />
    </>
  )
}