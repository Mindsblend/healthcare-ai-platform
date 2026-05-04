import { useState } from 'react'

interface SidebarItem {
  id: string
  label: string
}

const OrdersContent = () => {
  const [activeItem, setActiveItem] = useState<string>('profile')

  const sidebarItems: SidebarItem[] = [
    { id: 'pendding', label: 'جاری' },
    { id: 'done', label: 'ارسال شده' },
    { id: 'Returned', label: 'مرجوع شده' },
    { id: 'canceled', label: 'لغو شده' },
  ]

  return (
    <div>
      <div className="mb-3.75 flex items-center gap-5">
        {sidebarItems.map((item) => (
          <div className="flex items-center gap-1">
            <span className="font-ray font-medium text-[#A2A2A2]">
              {item.label}
            </span>
            <div className="font-aria flex h-5 w-5 items-center justify-center rounded-xs bg-[#D9D9D9] text-center text-sm font-semibold text-black">
              2
            </div>
          </div>
        ))}
      </div>
      <hr />
      <div className="mt-7.5 p-5"></div>
    </div>
  )
}

export default OrdersContent
