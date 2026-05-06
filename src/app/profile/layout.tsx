import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-24">
        <div className="flex gap-6">
          <Sidebar />
          {children}
        </div>
      </div>
    </div>
  )
}
