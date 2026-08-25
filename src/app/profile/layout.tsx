import NavbarWrapper from '@/components/layout/NavbarWrapper'
import Sidebar from '@/components/layout/Sidebar'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavbarWrapper />
      <div className="container mx-auto my-12">
        <div className="flex flex-col gap-6 lg:flex-row">
          <Sidebar />
          {children}
        </div>
      </div>
    </div>
  )
}
