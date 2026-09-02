// app/payment/failed/page.tsx
'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function FailureContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const message = searchParams.get('message')

  const [countdown, setCountdown] = useState(5)

  // Countdown timer
  useEffect(() => {
    if (countdown === 0) {
      router.push('/cart')
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        {/* Error Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
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
        </div>

        <h1 className="mb-2 text-2xl font-bold text-red-700">پرداخت ناموفق</h1>
        <p className="mb-6 text-gray-600">
          {message || 'مشکلی در پرداخت وجود داشت. لطفا دوباره تلاش کنید.'}
        </p>

        {/* Countdown & Redirect Message */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <p className="text-sm text-gray-500">در حال بازگشت به سبد خرید...</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-red-600">{countdown}</span>
            <span className="text-sm text-gray-500">ثانیه</span>
          </div>
          {/* Progress Bar */}
          <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-red-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/cart"
            className="inline-block rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700"
          >
            بازگشت به سبد خرید
          </Link>
          <Link
            href="/"
            className="inline-block rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition hover:bg-gray-50"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-500">در حال بارگذاری...</div>
        </div>
      }
    >
      <FailureContent />
    </Suspense>
  )
}
