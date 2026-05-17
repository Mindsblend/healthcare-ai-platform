'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import LogoutPopup from '@/components/layout/LogoutPopup.tsx'
import { useRouter } from 'next/navigation'
import { NavItem } from '../types/types.tsx'
import Link from 'next/link'
import { useLogOut } from '@/features/auth/hooks/useLogOut.ts'
import { useUserInfo } from '@/features/shop/hooks/profile/useUserInfo.ts'
import { toPersianDigit } from '@/lib/helpers.ts'

const Sidebar = () => {
  const { userInfo, loading, error } = useUserInfo()

  const [activeItem, setActiveItem] = useState<string>('profile')

  const [openIndex, setOpenIndex] = useState(false)
  const router = useRouter()

  const { logout } = useLogOut()

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

  // Get display name with smart fallbacks
  const getDisplayName = useMemo(() => {
    if (loading) return 'در حال بارگذاری...'
    if (error || !userInfo) return 'کاربر مهمان'

    const { firstName, lastName, phone, email } = userInfo

    // If we have first and last name
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }

    // If no name, show welcome message
    if (phone) {
      return 'خوش آمدید'
    }

    // If no phone, show email username
    if (email) {
      return email.split('@')[0]
    }

    // Ultimate fallback
    return 'کاربر گرامی'
  }, [userInfo, loading, error])

  // Get display identifier (phone/email) with priority
  const getDisplayIdentifier = useMemo(() => {
    if (loading) return 'در حال بارگذاری...'
    if (error || !userInfo) return '-----'

    const { phone, email } = userInfo

    // Priority 1: Phone number (if available)
    if (phone) {
      return toPersianDigit(phone)
    }

    // Priority 2: Email (if available)
    if (email) {
      return email
    }

    // Fallback
    return 'اطلاعات تماس ثبت نشده'
  }, [userInfo, loading, error])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div>
      {/* Sidebar */}
      <aside className="rounded-lg border-[1.5px] border-[#D9D9D9] bg-white lg:w-89.75">
        {/* User Info */}
        <div className="px-10 pt-10">
          <h1 className="font-aria mb-2.5 text-lg font-bold text-black">
            {getDisplayName}
          </h1>
          <p className="font-ray text-color-body-on-light text-lg font-medium">
            {getDisplayIdentifier}
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-5 pb-3 max-lg:flex lg:p-10 lg:pb-5">
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
                <hr className="hidden w-full border border-[#D9D9D9] lg:block" />
              )}
            </div>
          ))}
          <hr className="hidden w-full border border-[#D9D9D9] lg:block" />
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
