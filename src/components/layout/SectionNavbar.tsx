'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

type SectionNavbarProps = {
  title: string
  /** مسیر جایگزین در صورتی که تاریخچه‌ای برای برگشتن وجود نداشت */
  fallbackHref?: string
  /** اکشن اختیاری سمت چپ (مثلاً دکمه خروج یا ویرایش) */
  action?: React.ReactNode
}

export default function SectionNavbar({
  title,
  fallbackHref = '/',
  action,
}: SectionNavbarProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) router.back()
    else router.push(fallbackHref)
  }

  return (
    <header className="font-ray sticky top-0 z-50 w-full border-b border-[#ECEDEF] bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            aria-label="بازگشت"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-black transition hover:bg-gray-100"
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
          <h1 className="text-base font-bold text-gray-950">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {action}
          <Link
            href="/"
            aria-label="صفحه اصلی"
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            خانه
          </Link>
        </div>
      </div>
    </header>
  )
}
