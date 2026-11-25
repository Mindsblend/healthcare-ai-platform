'use client'

import Image from 'next/image'
import Link from 'next/link'
import SmartSearch from './SmartSearch'

type LandingNavbarProps = {
  user: unknown
  cartCount: number
}

/* =========================================================
   Landing navbar (نسخه‌ی مهمان)
   - lg و بالاتر: دسکتاپ (لوغو وسط، لینک‌ها، SmartSearch، دکمه‌ها + ردیف دوم لینک‌های سریع)
   - موبایل و تبلت (زelen lg): دقیقاً مثل ناوبار لاگین‌شده
     => لوگو + SmartSearch + لینک‌های سریع، بدون منوی درویره
========================================================== */

export default function LandingNavbar({ user, cartCount }: LandingNavbarProps) {
  return (
    <>
      {/* ===================== دسکتاپ و تبلت بزرگ (lg و بالاتر) ===================== */}
      <nav className="relative container hidden w-full bg-white pt-4 text-black lg:block">
        <div className="relative flex w-full items-center justify-between">
          {/* ناوبری + لوگو */}
          <div className="font-ray flex shrink-0 items-center gap-8 text-base font-medium text-black">
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <Link href="/" aria-label="خانه">
                {/* لوگو کوچک روی موبایل/تبلت */}
                <Image
                  src="/images/small-logo.svg"
                  alt="Logo"
                  width={45}
                  height={20}
                  className="lg:hidden"
                />
                {/* لوگو بزرگ روی دسکتاپ */}
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  width={140}
                  height={20}
                  className="hidden lg:block"
                />
              </Link>
            </div>

            {/* لینک‌های ناوبری - فقط دسکتاپ */}
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

          {/* SmartSearch دسکتاپ */}
          <SmartSearch className="hidden min-w-0 flex-1 px-8 lg:block" />

          {/* اقدامات دسکتاپ */}
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
              <div className="flex gap-3 xl:gap-7.5">
                {/* آیکون سبد خرید برای مهمان */}
                <Link
                  href="/cart"
                  aria-label="سبد خرید"
                  className="relative flex items-center justify-center rounded-full p-2"
                >
                  <Image
                    src="/images/cart.svg"
                    alt="سبد خرید"
                    width={30}
                    height={30}
                  />
                  {cartCount > 0 && (
                    <span className="font-ray absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] leading-none font-bold text-white">
                      {cartCount > 99
                        ? '۹۹+'
                        : cartCount.toLocaleString('fa-IR')}
                    </span>
                  )}
                </Link>

                {/* دکمه ورود / ثبت‌نام */}
                <Link
                  href="/auth"
                  className="hidden h-12 w-38.25 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-black px-2 whitespace-nowrap lg:flex"
                >
                  <span className="flex-1 text-center font-aria text-base font-medium text-white">
                    ورود | ثبت‌نام
                  </span>

                  <span className="flex h-[31.13px] w-10 shrink-0 items-center justify-center rounded-full bg-white">
                    <Image
                      src="/images/arrow-right.svg"
                      alt="left arrow"
                      width={17}
                      height={12}
                      className='rotate-180'
                    />
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            ردیف دوم دسکتاپ: لینک‌های سریع (محصولات پرفروش ، تماس با ما ، ورود/ثبت‌نام)
        ========================================================== */}
        <hr className="my-3 h-px border-0 bg-[#ECEDEF]" />

        {/* لینک‌های سریع زیر سرچ‌بار */}
        <nav
          aria-label="لینک‌های سریع"
          className="font-ray flex items-center gap-4 text-sm font-bold text-black"
        >
          <Link
            href="/products"
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
      </nav>

      {/* ===================== موبایل و تبلت (زelen lg) =====================
           دقیقاً مثل بخش موبایل ناوبار لاگین‌شده:
           لوگو + SmartSearch در ردیف اصلی، سپس لینک‌های سریع
      ========================================================== */}
      <div className="flex flex-col px-4 pt-5 lg:hidden">
        <div className="flex items-center gap-2">
          {/* لوگو */}
          <Link
            href="/"
            aria-label="دیجی سلامت"
            className="flex h-10 w-10 shrink-0 items-center justify-center"
          >
            <Image
              src="/images/small-logo.svg"
              alt="دیجی سلامت"
              width={32}
              height={32}
              priority
              className=""
            />
          </Link>

          {/* SmartSearch موبایل */}
          <SmartSearch className="w-full lg:hidden" />
        </div>

        <hr className="my-3 h-px border-0 bg-[#ECEDEF]" />

        {/* لینک‌های سریع */}
        <nav
          aria-label="لینک‌های سریع"
          className="font-ray flex items-center gap-4 text-sm font-bold text-black"
        >
          <Link
            href="/products"
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
    </>
  )
}
