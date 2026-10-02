'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'

import { useCart } from '@/features/shop/hooks/cart/useCart'
import BottomNav, { shouldShowBottomNav } from './BottomNav'
import LandingNavbar from './LandingNavbar'
import SmartSearch from './SmartSearch'

type NavbarProps = {
  user: unknown
}

const GUEST_SEARCH_ROUTES = ['/products']
const BACK_FALLBACK_ROUTE = '/'

// نمونه دسته‌بندی‌ها (می‌توانید عنوان‌ها و آیکون‌ها را مطابق دسته‌های زیست‌یار ویرایش کنید)
const CATEGORIES = [
  {
    id: 'supplements',
    name: 'مکمل‌های دارویی و غذایی',
    href: '/products?cat=supplements',
  },
  {
    id: 'vitamins',
    name: 'ویتامین‌ها و مواد معدنی',
    href: '/products?cat=vitamins',
  },
  { id: 'skincare', name: 'مراقبت پوست و مو', href: '/products?cat=skincare' },
  { id: 'herbal', name: 'داروهای گیاهی', href: '/products?cat=herbal' },
  {
    id: 'medical-devices',
    name: 'تجهیزات پزشکی خانگی',
    href: '/products?cat=medical',
  },
  { id: 'hygiene', name: 'بهداشت فردی', href: '/products?cat=hygiene' },
]

const isInRoutes = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

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

  const urlQuery = searchParams.get('q')

  const [search, setSearch] = useState(() => urlQuery ?? '')
  const { cartItems } = useCart()
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const showBottomNav = shouldShowBottomNav(pathname, user)
  const guestHasSearch = isInRoutes(pathname, GUEST_SEARCH_ROUTES)

  const PRODUCT_DETAIL_PREFIX = '/products/'

  const isProductDetailPage = (pathname: string) =>
    pathname.startsWith(PRODUCT_DETAIL_PREFIX) &&
    pathname.length > PRODUCT_DETAIL_PREFIX.length

  const showBackButton =
    Boolean(user) &&
    (Boolean(urlQuery?.trim()) || isProductDetailPage(pathname))

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
      <header className="font-ray top-0 z-50 w-full bg-white">
        <div className="container mx-auto hidden h-20 items-center justify-between gap-6 px-4 sm:flex lg:px-8">
          <div className="flex w-full max-w-2xl items-center gap-10">
            <div className="flex shrink-0 items-center">
              <Link
                href="/"
                aria-label="دیجی سلامت"
                className="flex items-center gap-2"
              >
                <Image
                  src="/images/logo.svg"
                  alt="دیجی سلامت"
                  width={134}
                  height={45}
                  priority
                  className="object-contain"
                />
              </Link>
            </div>

            <SmartSearch className="hidden md:flex" />
          </div>

          {/* سمت چپ: سبد خرید و پروفایل */}
          <div className="flex shrink-0 items-center gap-5">
            {/* دکمه سبد خرید */}
            <Link
              href="/cart"
              aria-label="سبد خرید"
              className="relative flex items-center justify-center p-1 transition hover:opacity-80"
            >
              <Image
                src="/images/cart.svg"
                alt="سبد خرید"
                width={32}
                height={32}
              />
              {cartCount > 0 && (
                <span className="font-ray absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] leading-none font-bold text-white">
                  {cartCount > 99 ? '۹۹+' : cartCount.toLocaleString('fa-IR')}
                </span>
              )}
            </Link>

            {/* دکمه پروفایل */}
            <Link
              href="/profile"
              aria-label="پروفایل"
              className="flex items-center justify-center p-1 transition hover:opacity-80"
            >
              <Image
                src="/images/profile.svg"
                alt="پروفایل"
                width={32}
                height={32}
              />
            </Link>
          </div>
        </div>

        {/* =========================================================
            ردیف دوم: دسته‌بندی‌ها (با دراپ‌داون هاور) و لینک‌ها
        ========================================================== */}
        <div className="relative hidden border-t border-[#ECEDEF] py-3 md:block">
          <div className="container mx-auto flex items-center gap-6 px-4 text-sm font-medium text-gray-700 lg:px-8">
            {/* دسته‌بندی کالاها + دراپ‌داون با هاور */}
            <div className="group relative">
              <Link
                href="/products"
                className="flex items-center gap-2 font-bold text-gray-950 transition hover:text-black"
              >
                {/* آیکون منوی همبرگری */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span>دسته‌بندی کالاها</span>
              </Link>

              {/* محتوای دراپ‌داون با قابلیت hover */}
              <div className="invisible absolute top-full right-0 z-50 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5">
                  <div className="flex flex-col space-y-1">
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.id}
                        href={category.href}
                        className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-gray-700 transition hover:bg-gray-50 hover:text-black"
                      >
                        <span>{category.name}</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-300 rtl:rotate-180"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* خط جداکننده عمودی */}
            <span className="h-5 w-px bg-[#D9D9D9]" aria-hidden="true" />

            {/* محصولات پرفروش با آیکون شعله قرمز */}
            <Link
              href="/products?sort=bestsellers"
              className="font-ray flex items-center gap-1.25 font-bold text-black transition hover:text-red-500"
            >
              <Image
                src="/images/hot.svg"
                alt="محصولات پرفروش"
                width={20}
                height={20}
              />
              <span>محصولات پرفروش</span>
            </Link>

            {/* تماس با ما با آیکون تلفن */}
            <Link
              href="/contact"
              className="font-ray flex items-center gap-1.5 font-bold text-black transition"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>تماس با ما</span>
            </Link>
          </div>
        </div>

        {/* =========================================================
            نسخه موبایل: مینی‌لوگو / دکمه بازگشت + سرچ‌بار + لینک‌های سریع
        ========================================================== */}
        <div className="flex flex-col px-4 pt-5 md:hidden">
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <BackButton onClick={handleBack} className="h-10 w-10" />
            ) : (
              <Link
                href="/"
                aria-label="دیجی سلامت"
                className="flex h-10 w-10 shrink-0 items-center justify-center sm:hidden"
              >
                <Image
                  src="/images/logo-small.svg"
                  alt="دیجی سلامت"
                  width={32}
                  height={32}
                  priority
                  className="object-contain"
                />
              </Link>
            )}

            <SmartSearch className="flex md:hidden" />
          </div>

          <hr className="my-3 h-px border-0 bg-[#ECEDEF]" />

          {/* لینک‌های سریع زیر سرچ‌بار */}
          <nav
            aria-label="لینک‌های سریع"
            className="font-ray flex items-center gap-4 text-sm font-bold text-black"
          >
            <Link
              href="/products?sort=bestsellers"
              className="flex items-center gap-1.5 transition hover:text-red-500"
            >
              <Image
                src="/images/hot.svg"
                alt=""
                aria-hidden="true"
                width={18}
                height={18}
              />
              <span>محصولات پرفروش</span>
            </Link>

            <span className="h-4 w-px bg-[#D9D9D9]" aria-hidden="true" />

            <Link
              href="/contact"
              className="flex items-center gap-1.5 transition"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>تماس با ما</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* نوار ناوبری پایین صفحه برای موبایل */}
      {showBottomNav && <BottomNav cartCount={cartCount} />}
    </>
  )
}
