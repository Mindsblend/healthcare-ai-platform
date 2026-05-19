'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import ConfirmPopup from '@/components/layout/ConfirmPopup.tsx'
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

    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }

    if (phone) {
      return 'خوش آمدید'
    }

    if (email) {
      return email.split('@')[0]
    }

    return 'کاربر گرامی'
  }, [userInfo, loading, error])

  // Get display identifier (phone/email) with priority
  const getDisplayIdentifier = useMemo(() => {
    if (loading) return 'در حال بارگذاری...'
    if (error || !userInfo) return '-----'

    const { phone, email } = userInfo

    if (phone) {
      return toPersianDigit(phone)
    }

    if (email) {
      return email
    }

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

        {/* Navigation - Desktop */}
        <nav className="hidden p-5 pb-3 lg:block lg:p-10 lg:pb-5">
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

            <ConfirmPopup
              isOpen={openIndex}
              onClose={() => setOpenIndex(false)}
              onConfirm={handleLogout}
              popupTitle={'از حساب کاربری خارج میشوید ؟'}
              descriptionText={
                'با خروج از حساب کاربری، به سبد خرید فعلی‌تان دسترسی نخواهید داشت. هروقت بخواهید می‌توانید مجددا وارد شوید و خریدتان را ادامه دهید.'
              }
              confirmButtonText={'خروج از حساب'}
              cancelButtonText={'انصراف'}
            />
          </div>
        </nav>

        <nav className="lg:hidden">
          <div className="scrollbar-hide flex overflow-x-auto px-5 py-3">
            <div className="flex gap-x-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`shrink-0 cursor-pointer rounded-lg px-4 py-3 transition-all duration-200 ${
                    activeItem === item.name
                      ? 'bg-gray-50 text-black'
                      : 'text-black hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveItem(item.name)}
                >
                  <div className="flex items-center gap-x-2.5">
                    <Image
                      src={item.icon}
                      width={20}
                      height={20}
                      alt="Profile Icon"
                    />
                    <span className="font-aria text-sm font-semibold whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                </Link>
              ))}
              <button
                onClick={() => setOpenIndex(true)}
                className="shrink-0 cursor-pointer rounded-lg px-4 py-3 transition-all duration-200 hover:bg-gray-50"
              >
                <div className="flex items-center gap-x-2.5">
                  <Image
                    src="/images/logout.svg"
                    width={20}
                    height={20}
                    alt="logout"
                  />
                  <span className="font-aria text-sm font-semibold whitespace-nowrap text-black">
                    خروج
                  </span>
                </div>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      <ConfirmPopup
        isOpen={openIndex}
        onClose={() => setOpenIndex(false)}
        onConfirm={handleLogout}
        popupTitle={'از حساب کاربری خارج میشوید ؟'}
        descriptionText={
          'با خروج از حساب کاربری، به سبد خرید فعلی‌تان دسترسی نخواهید داشت. هروقت بخواهید می‌توانید مجددا وارد شوید و خریدتان را ادامه دهید.'
        }
        confirmButtonText={'خروج از حساب'}
        cancelButtonText={'انصراف'}
      />
    </div>
  )
}

export default Sidebar
