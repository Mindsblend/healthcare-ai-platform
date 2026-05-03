// components/dashboard/Sidebar.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProfileContent from './contents/ProfileContent.tsx'
import AddressContent from './contents/AddressContent.tsx'
import OrdersContent from './contents/OrdersContent.tsx'
import LogoutContent from './contents/LogoutContent.tsx'

interface SidebarItem {
  id: string
  label: string
  icon: string
}

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState<string>('profile')

  const sidebarItems: SidebarItem[] = [
    { id: 'profile', label: 'نام کاربری', icon: '/images/user-profile.svg' },
    { id: 'addresses', label: 'آدرس ها', icon: '/images/address.svg' },
    { id: 'orders', label: 'سفارش ها', icon: '/images/orders.svg' },
    { id: 'logout', label: 'خروج از حساب کاربری', icon: '/images/logout.svg' },
  ]

  const renderContent = () => {
    switch (activeItem) {
      case 'profile':
        return <ProfileContent />
      case 'addresses':
        return <AddressContent />
      case 'orders':
        return <OrdersContent />
      case 'logout':
        return <LogoutContent />
      default:
        return <ProfileContent />
    }
  }

  return (
    <div className="container mx-auto mt-24">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-89.75 rounded-lg border border-[#D9D9D9] bg-white">
          {/* User Info */}
          <div className="px-10 pt-10">
            <h1 className="font-aria mb-2.5 text-lg font-bold text-black">
              آرمان ابتکاری
            </h1>
            <p className="font-ray text-color-body-on-light text-lg font-medium">
              ۰۹۱۲۹۲۱۲۵۳۸
            </p>
          </div>

          {/* Navigation */}
          <nav className="p-10 pb-5">
            {sidebarItems.map((item, index) => (
              <div key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`flex w-full cursor-pointer items-center gap-x-2.5 rounded-lg px-4 py-5 transition-all duration-200 ${
                    activeItem === item.id
                      ? 'bg-gray-50 text-black'
                      : 'text-black hover:bg-gray-50'
                  } `}
                >
                  <Image
                    src={item.icon}
                    width={24}
                    height={24}
                    alt={item.label}
                  />
                  <span className="font-aria text-sm font-semibold">
                    {item.label}
                  </span>
                </button>
                {index < sidebarItems.length - 1 && (
                  <hr className="w-full border border-[#D9D9D9]" />
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Dynamic Content */}
        <div className="flex-1 rounded-lg border border-[#D9D9D9] bg-white p-6">
          <h2 className="font-aria mb-6 text-xl font-bold text-black">
            {sidebarItems.find((item) => item.id === activeItem)?.label}
          </h2>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
