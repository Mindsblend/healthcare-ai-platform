// app/payment/success/page.tsx
'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const refId = searchParams.get('refId')
  const orderId = searchParams.get('orderId')

  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    console.log('Payment successful! Ref ID:', refId, 'Order ID:', orderId)
  }, [refId, orderId])

  // Countdown timer
  useEffect(() => {
    if (countdown === 0) {
      router.push('/profile/orders')
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
        {/* Success Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-green-700">پرداخت موفق</h1>
        <p className="mb-4 text-gray-600">سفارش شما با موفقیت ثبت شد.</p>

        {refId && (
          <p className="mb-6 text-sm text-gray-500">
            شماره پیگیری:{' '}
            <span className="font-semibold text-gray-700">{refId}</span>
          </p>
        )}

        {orderId && (
          <p className="mb-6 text-sm text-gray-500">
            شماره سفارش:{' '}
            <span className="font-semibold text-gray-700">{orderId}</span>
          </p>
        )}

        {/* Countdown & Redirect Message */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <p className="text-sm text-gray-500">
            در حال انتقال به صفحه سفارشات...
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              {countdown}
            </span>
            <span className="text-sm text-gray-500">ثانیه</span>
          </div>
          {/* Progress Bar */}
          <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/profile/orders"
            className="inline-block rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
          >
            مشاهده سفارشات
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-500">در حال بارگذاری...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
