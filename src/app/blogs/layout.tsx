import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import NavbarWrapper from '@/components/layout/NavbarWrapper'

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
