import NavbarWrapper from '@/components/layout/NavbarWrapper'
import Sidebar from '@/components/layout/Sidebar'

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavbarWrapper />
      <div className="container mx-auto mt-12 lg:mt-16">
        <div className="flex flex-col gap-6 lg:flex-row">
          <Sidebar />
          {children}
        </div>
      </div>
    </div>
  )
}
