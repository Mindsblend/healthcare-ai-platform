'use client' // Add this at the top

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Now this accepts user as a prop
export default function Navbar({ user }: { user: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <nav className="relative container flex w-full items-center justify-between bg-white pt-4 text-black">
        {/* Navigation + Logo */}
        <div className="font-ray flex items-center gap-8 text-[16px] font-medium text-black">
          {/* Hamburger Menu */}
          <button
            className="relative z-20 block lg:hidden"
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
            <Link href="/">
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
              <a
                href="/"
                className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
              >
                خانه
              </a>
            </li>
            <li>
              <a
                href="/ai"
                className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
              >
                تست هوش مصنوعی
              </a>
            </li>
            <li>
              <a
                href="/blogs"
                className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
              >
                وبلاگ
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
              >
                محصولات
              </a>
            </li>
          </ul>
        </div>

        <div className="flex justify-center gap-3">
          {/* Left: Menu button */}
          {user ? (
            <div className="flex justify-center gap-6">
              <Link href={'/cart'}>
                <Image
                  src="/images/cart.svg"
                  alt="Arrow"
                  width={32}
                  height={32}
                />
              </Link>

              <Link href={'/profile'}>
                <Image
                  src="/images/profile.svg"
                  alt="Arrow"
                  width={32}
                  height={32}
                />
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 lg:gap-7.5">
              <Link
                href="/ai"
                className="bg-page hidden cursor-pointer items-center justify-between gap-1 rounded-full text-white lg:flex"
              >
                {/* Button text */}
                <span className="font-ray text-color-title-on-light mr-3.5 text-xs font-medium whitespace-nowrap lg:text-base">
                  تست هوش مصنوعی
                </span>

                {/* Circle with icon */}
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

              {/* Button text */}
              <Link
                href={'/auth'}
                className="primary-btn hidden items-center justify-between rounded-full bg-black whitespace-nowrap lg:flex"
              >
                <span className="font-ray pr-2 font-medium text-white">
                  ورود به حساب کاربری
                </span>
                {/* Circle with icon */}
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
      </nav>

      {/* Side Drawer Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="bg-opacity-50 fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden">
            {/* Close button */}
            <button
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
              {!user ? (
                <>
                  <Link
                    href="/auth"
                    className="rounded-lg px-4 py-3 text-black no-underline transition-colors hover:bg-gray-50 hover:text-gray-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ورود به حساب کاربری
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </>
      )}
    </>
  )
}
