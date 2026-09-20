'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'

import { useCart } from '@/features/shop/hooks/cart/useCart'
import BottomNav, { shouldShowBottomNav } from './BottomNav'
import LandingNavbar from './LandingNavbar'

type NavbarProps = {
  user: unknown
}

// مسیرهایی که مهمان‌ها (قبل از لاگین) تو ناوبار اولیه‌ی خودشون سرچ‌بار هم می‌بینن
const GUEST_SEARCH_ROUTES = ['/products']

// مسیرهایی که «کاربر لاگین‌کرده» تو موبایل کنار سرچ‌بار دکمه‌ی برگشت می‌بینه
// (خود مسیر و زیرمسیرهاش، یعنی /products و /products/پاستا). تو دسکتاپ نمایش داده نمی‌شه.
const BACK_BUTTON_ROUTES = ['/products']

// اگه تاریخچه‌ای برای برگشت نبود (مثلاً باز کردن مستقیم لینک محصول) به این مسیر می‌ره.
// مسیر صفحه‌ی فید رو اینجا بذار.
const BACK_FALLBACK_ROUTE = '/'

const isInRoutes = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

/* =========================================================
   Back button
========================================================== */

function BackButton({
  onClick,
  className = '',
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="بازگشت"
      className={`flex shrink-0 cursor-pointer items-center justify-center rounded-full text-black transition hover:bg-gray-100 ${className}`}
    >
      {/* فلش پیش‌فرض به چپ؛ تو صفحه‌ی RTL برعکس می‌شه (به راست) */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="rtl:rotate-180"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  )
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(() => searchParams.get('q') ?? '')

  const { cartItems } = useCart()

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const showBottomNav = shouldShowBottomNav(pathname, user)

  const guestHasSearch = isInRoutes(pathname, GUEST_SEARCH_ROUTES)

  // دکمه‌ی برگشت فقط برای کاربر لاگین‌کرده (مهمان‌ها همیشه LandingNavbar می‌گیرن)
  const showBackButton =
    Boolean(user) && isInRoutes(pathname, BACK_BUTTON_ROUTES)

  const urlQuery = searchParams.get('q')

  useEffect(() => {
    if (urlQuery !== null) {
      setSearch(urlQuery)
    } else if (pathname === '/products') {
      setSearch('')
    }
  }, [urlQuery, pathname])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const query = search.trim()

    setSearch(query)

    if (!query) {
      router.push('/products')
      return
    }

    router.push(`/products?q=${encodeURIComponent(query)}`)
  }

  const clearSearch = () => {
    setSearch('')

    if (pathname === '/products') {
      router.push('/products')
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(BACK_FALLBACK_ROUTE)
    }
  }

  if (!user) {
    return (
      <LandingNavbar
        user={user}
        cartCount={cartCount}
        search={
          guestHasSearch
            ? {
                value: search,
                onChange: setSearch,
                onSubmit: handleSearch,
                onClear: clearSearch,
              }
            : undefined
        }
      />
    )
  }

  return (
    <>
      <nav className="relative container w-full bg-white pt-4 text-black">
        {/* =========================================================
            DESKTOP HEADER
        ========================================================== */}
        <div className="hidden w-full items-center justify-between lg:flex">
          {/* Navigation + Logo */}
          <div className="font-ray flex min-w-0 items-center gap-8 text-base font-medium text-black">
            {/* Logo */}
            <div>
              <Link href="/" aria-label="خانه">
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  width={140}
                  height={20}
                  priority
                />
              </Link>
            </div>

            {/* Navigation */}
            <ul className="flex gap-6 font-medium">
              <li>
                <Link
                  href="/"
                  className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black"
                >
                  خانه
                </Link>
              </li>

              <li>
                <Link
                  href="/ai"
                  className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black"
                >
                  تست هوش مصنوعی
                </Link>
              </li>

              <li>
                <Link
                  href="/blogs"
                  className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black"
                >
                  وبلاگ
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black"
                >
                  محصولات
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================================================
              DESKTOP SEARCH
          ========================================================== */}
          <form
            onSubmit={handleSearch}
            className="min-w-0 flex-1 justify-center px-8"
          >
            <div className="relative mx-auto w-full max-w-xl">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی محصولات..."
                aria-label="جستجوی محصولات"
                dir="rtl"
                className="font-ray h-11 w-full rounded-full border border-gray-200 bg-gray-50 pr-12 pl-12 text-sm text-black transition outline-none placeholder:text-gray-400 focus:border-black focus:bg-white"
              />

              {/* Search Button */}
              <button
                type="submit"
                aria-label="جستجو"
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 transition hover:bg-black hover:text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>

              {/* Clear Button */}
              {search && (
                <button
                  type="button"
                  aria-label="پاک کردن جستجو"
                  onClick={clearSearch}
                  className="absolute top-1/2 left-3 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-black"
                >
                  <Image
                    src="/images/close-line.svg"
                    alt="close button"
                    width={15}
                    height={15}
                  />
                </button>
              )}
            </div>
          </form>

          {/* =========================================================
              RIGHT ACTIONS
          ========================================================== */}
          <div className="flex shrink-0 justify-center gap-3">
            {user ? (
              <div className="flex justify-center gap-6">
                {/* Cart */}
                <Link
                  href="/cart"
                  aria-label="سبد خرید"
                  className="relative flex items-center justify-center"
                >
                  <Image
                    src="/images/cart.svg"
                    alt="سبد خرید"
                    width={32}
                    height={32}
                  />

                  {cartCount > 0 && (
                    <span className="font-ray absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-xs leading-none font-bold text-white">
                      {cartCount > 99
                        ? '۹۹+'
                        : cartCount.toLocaleString('fa-IR')}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <Link href="/profile" aria-label="پروفایل">
                  <Image
                    src="/images/profile.svg"
                    alt="پروفایل"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>
            ) : (
              <div className="flex gap-3 lg:gap-7.5">
                {/* AI Button */}
                <Link
                  href="/ai"
                  className="bg-page flex cursor-pointer items-center justify-between gap-1 rounded-full text-white"
                >
                  <span className="font-ray text-color-title-on-light mr-3.5 text-base font-medium whitespace-nowrap">
                    تست هوش مصنوعی
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <Image
                      src="/images/cognition-black.svg"
                      alt="AI"
                      width={24}
                      height={24}
                    />
                  </div>
                </Link>

                {/* Login Button */}
                <Link
                  href="/auth"
                  className="primary-btn flex items-center justify-between rounded-full bg-black whitespace-nowrap"
                >
                  <span className="font-ray pr-2 font-medium text-white">
                    ورود به حساب کاربری
                  </span>

                  <div className="flex h-10 w-10 rotate-45 items-center justify-center rounded-full bg-white">
                    <Image
                      src="/images/arrow.svg"
                      alt="ورود"
                      width={20}
                      height={20}
                    />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            MOBILE NAVBAR (Back button + Search)
        ========================================================== */}
        <div className="flex items-center gap-1 lg:hidden">
          {showBackButton && (
            <BackButton onClick={handleBack} className="h-14 w-11" />
          )}

          <form onSubmit={handleSearch} className="min-w-0 flex-1">
            <div className="relative w-full">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی محصولات..."
                aria-label="جستجوی محصولات"
                dir="rtl"
                className="font-ray h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pr-14 pl-12 text-[15px] font-medium text-black transition outline-none placeholder:text-gray-400 focus:border-black focus:bg-white"
              />

              {/* Search Button */}
              <button
                type="submit"
                aria-label="جستجو"
                className="absolute top-1/2 right-2.5 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-black text-white transition hover:bg-gray-800"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>

              {/* Clear Button */}
              {search && (
                <button
                  type="button"
                  aria-label="پاک کردن جستجو"
                  onClick={clearSearch}
                  className="absolute top-1/2 left-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-black"
                >
                  <Image
                    src="/images/close-line.svg"
                    alt="close button"
                    width={20}
                    height={20}
                  />
                </button>
              )}
            </div>
          </form>
        </div>
      </nav>

      {/* =========================================================
          BOTTOM NAVIGATION
      ========================================================== */}
      {showBottomNav && <BottomNav cartCount={cartCount} />}
    </>
  )
}
