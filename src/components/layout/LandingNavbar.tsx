'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'

type LandingNavbarProps = {
  user: unknown
  cartCount: number
  /**
   * فقط وقتی داده بشه سرچ‌بار نمایش داده می‌شه (مثلاً تو صفحه‌ی محصولات).
   * state و منطق سرچ از Navbar میاد تا با ?q= هماهنگ بمونه.
   */
  search?: Omit<SearchFormProps, 'variant'>
}

/* =========================================================
   Search form
   - desktop: وسط ناوبار، بین لینک‌ها و دکمه‌ها
   - mobile:  ردیف دوم، تمام‌عرض زیر لوگو/همبرگر
========================================================== */

type SearchFormProps = {
  variant: 'desktop' | 'mobile'
  value: string
  onChange: (value: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onClear: () => void
}

function SearchForm({
  variant,
  value,
  onChange,
  onSubmit,
  onClear,
}: SearchFormProps) {
  const isMobile = variant === 'mobile'

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={
        isMobile
          ? 'mt-3 w-full lg:hidden'
          : 'hidden min-w-0 flex-1 px-8 lg:block'
      }
    >
      <div className={`relative w-full ${isMobile ? '' : 'mx-auto max-w-xl'}`}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="جستجوی محصولات..."
          aria-label="جستجوی محصولات"
          dir="rtl"
          enterKeyHint="search"
          autoComplete="off"
          className={
            isMobile
              ? // 16px تا مرورگر iOS موقع فوکوس زوم نکنه
                'font-ray h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pr-14 pl-12 text-base font-medium text-black transition outline-none placeholder:text-gray-400 focus:border-black focus:bg-white'
              : 'font-ray h-11 w-full rounded-full border border-gray-200 bg-gray-50 pr-12 pl-12 text-sm text-black transition outline-none placeholder:text-gray-400 focus:border-black focus:bg-white'
          }
        />

        {/* Search button */}
        <button
          type="submit"
          aria-label="جستجو"
          className={
            isMobile
              ? 'absolute top-1/2 right-1.5 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl bg-black text-white transition hover:bg-gray-800'
              : 'absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-black hover:text-white'
          }
        >
          <svg
            width={isMobile ? 19 : 18}
            height={isMobile ? 19 : 18}
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

        {/* Clear button */}
        {value && (
          <button
            type="button"
            aria-label="پاک کردن جستجو"
            onClick={onClear}
            className="absolute top-1/2 left-3 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-black"
          >
            <Image
              src="/images/close-line.svg"
              alt="close button"
              width={isMobile ? 18 : 15}
              height={isMobile ? 18 : 15}
            />
          </button>
        )}
      </div>
    </form>
  )
}

/* =========================================================
   Landing navbar (نسخه‌ی اولیه‌ی ناوبار + سرچ‌بار)
========================================================== */

export default function LandingNavbar({
  user,
  cartCount,
  search,
}: LandingNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <nav
        className={`relative container w-full bg-white pt-4 text-black ${
          // فقط وقتی سرچ‌بار زیر ناوبار میاد (موبایل) فاصله‌ی پایین لازمه
          search ? 'pb-3 lg:pb-0' : ''
        }`}
      >
        {/* =========================================================
            TOP ROW
        ========================================================== */}
        <div className="relative flex w-full items-center justify-between">
          {/* Navigation + Logo */}
          <div className="font-ray flex shrink-0 items-center gap-8 text-base font-medium text-black">
            {/* Hamburger Menu */}
            <button
              type="button"
              aria-label="باز کردن منو"
              className="relative z-20 block cursor-pointer lg:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Image
                src="/images/hamburger.svg"
                alt="Menu"
                width={30}
                height={30}
                className="lg:block"
              />
            </button>

            {/* Logo - centered on medium/small screens */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <Link href="/" aria-label="خانه">
                {/* Small logo - visible on mobile/tablet, hidden on large screens */}
                <Image
                  src="/images/Logo-Small.svg"
                  alt="Logo"
                  width={45}
                  height={20}
                  className="lg:hidden"
                />
                {/* Large logo - hidden on mobile/tablet, visible on large screens */}
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  width={140}
                  height={20}
                  className="hidden lg:block"
                />
              </Link>
            </div>

            {/* Navigation links - hide on small screens */}
            <ul className="hidden gap-6 font-medium lg:flex">
              <li>
                <Link
                  href="/"
                  className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                >
                  خانه
                </Link>
              </li>
              <li>
                <Link
                  href="/ai"
                  className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                >
                  تست هوش مصنوعی
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                >
                  وبلاگ
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                >
                  محصولات
                </Link>
              </li>
            </ul>
          </div>

          {/* Desktop search (فقط وقتی search داده شده) */}
          {search && <SearchForm variant="desktop" {...search} />}

          {/* Actions */}
          <div className="flex shrink-0 justify-center gap-3">
            {user ? (
              <div className="flex justify-center gap-6">
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
                {/* AI button - desktop */}
                <Link
                  href="/ai"
                  className="bg-page hidden cursor-pointer items-center justify-between gap-1 rounded-full text-white lg:flex"
                >
                  <span className="font-ray text-color-title-on-light mr-3.5 text-xs font-medium whitespace-nowrap lg:text-base">
                    تست هوش مصنوعی
                  </span>

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white sm:h-8 sm:w-8">
                    <Image
                      src="/images/cognition-black.svg"
                      alt="Arrow"
                      width={24}
                      height={24}
                      className="max-sm:h-5 max-sm:w-5"
                    />
                  </div>
                </Link>

                {/* Login button - desktop */}
                <Link
                  href="/auth"
                  className="primary-btn hidden items-center justify-between rounded-full bg-black whitespace-nowrap lg:flex"
                >
                  <span className="font-ray pr-2 font-medium text-white">
                    ورود به حساب کاربری
                  </span>

                  <div className="flex h-7 w-7 rotate-45 items-center justify-center rounded-full bg-white xl:h-10 xl:w-10">
                    <Image
                      src="/images/arrow.svg"
                      alt="Top Right Image"
                      width={20}
                      height={20}
                      className="max-xl:h-3.75 max-xl:w-3.75"
                    />
                  </div>
                </Link>

                {/* Mobile icon buttons - visible only on mobile */}
                <div className="flex gap-3 lg:hidden">
                  <Link
                    href="/ai"
                    aria-label="تست هوش مصنوعی"
                    className="bg-page flex items-center justify-center rounded-full p-2 text-white"
                  >
                    <Image
                      src="/images/ai-small.svg"
                      alt="AI Test"
                      width={30}
                      height={30}
                    />
                  </Link>
                  <Link
                    href="/auth"
                    aria-label="ورود به حساب کاربری"
                    className="flex items-center justify-center rounded-full p-2"
                  >
                    <Image
                      src="/images/login-small.svg"
                      alt="Login"
                      width={30}
                      height={30}
                    />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            MOBILE SEARCH ROW (فقط وقتی search داده شده)
        ========================================================== */}
        {search && <SearchForm variant="mobile" {...search} />}
      </nav>

      {/* Side Drawer Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden">
            {/* Close button */}
            <button
              type="button"
              aria-label="بستن منو"
              className="absolute top-4 left-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Menu Links */}
            <div className="mt-16 flex flex-col gap-2 p-6">
              <Link
                href="/"
                className="rounded-lg px-4 py-3 text-black no-underline transition-colors hover:bg-gray-50 hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                خانه
              </Link>
              <Link
                href="/ai"
                className="rounded-lg px-4 py-3 text-black no-underline transition-colors hover:bg-gray-50 hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                تست هوش مصنوعی
              </Link>
              <Link
                href="/blogs"
                className="rounded-lg px-4 py-3 text-black no-underline transition-colors hover:bg-gray-50 hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                وبلاگ
              </Link>
              <Link
                href="/products"
                className="rounded-lg px-4 py-3 text-black no-underline transition-colors hover:bg-gray-50 hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                محصولات
              </Link>
              {!user && (
                <Link
                  href="/auth"
                  className="rounded-lg px-4 py-3 text-black no-underline transition-colors hover:bg-gray-50 hover:text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ورود به حساب کاربری
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
