import Footer from '@/components/layout/Footer'
import NavbarWrapper from '@/components/layout/NavbarWrapper'

export default function LegalLayout({
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
