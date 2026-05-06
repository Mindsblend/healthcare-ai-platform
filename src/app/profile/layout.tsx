import Navbar from '@/components/layout/Navbar'

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
