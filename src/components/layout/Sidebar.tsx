'use client'

import { useState } from 'react'
import Image from 'next/image'
import LogoutPopup from '@/components/layout/LogoutPopup.tsx'
import { useRouter } from 'next/navigation'
import { NavItem } from '../types/types.tsx'
import Link from 'next/link'

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState<string>('profile')

  const [openIndex, setOpenIndex] = useState(false)
  const router = useRouter()

  const sidebarItems: NavItem[] = [
    {
      name: 'نام کاربری',
      icon: '/images/user-profile.svg',
      path: '/profile',
    },
    {
      name: 'آدرس ها',
      icon: '/images/address.svg',
      path: '/profile/address',
    },
    {
      name: 'سفارش ها',
      icon: '/images/orders.svg',
      path: '/profile/orders',
    },
  ]

  const handleLogout = async () => {
    try {
      // API call for logout
      // await fetch('/api/auth/logout', { method: 'POST' });

      // Clear local storage/cookies
      // localStorage.removeItem('token');

      // Redirect to login page
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div>
      {/* Sidebar */}
      <aside className="w-89.75 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white">
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
            <div key={item.name}>
              <Link
                href={item.path}
                className={`flex w-full cursor-pointer items-center gap-x-2.5 rounded-lg px-4 py-5 transition-all duration-200 ${
                  activeItem === item.name
                    ? 'bg-gray-50 text-black'
                    : 'text-black hover:bg-gray-50'
                } `}
              >
                <Image
                  src={item.icon}
                  width={24}
                  height={24}
                  alt="Profile Icon"
                />
                <span className="font-aria text-sm font-semibold">
                  {item.name}
                </span>
              </Link>
              {index < sidebarItems.length - 1 && (
                <hr className="w-full border border-[#D9D9D9]" />
              )}
            </div>
          ))}
          <hr className="w-full border border-[#D9D9D9]" />
          <div>
            <button
              onClick={() => setOpenIndex(true)}
              className="flex w-full cursor-pointer items-center gap-x-2.5 rounded-lg px-4 py-5 transition-all duration-200"
            >
              <Image
                src="/images/logout.svg"
                width={24}
                height={24}
                alt="logout"
              />
              <span className="font-aria text-sm font-semibold text-black">
                خروج از حساب کاربری
              </span>
            </button>

            <LogoutPopup
              isOpen={openIndex}
              onClose={() => setOpenIndex(false)}
              onConfirm={handleLogout}
            />
          </div>
        </nav>
      </aside>
    </div>
  )
}

export default Sidebar
