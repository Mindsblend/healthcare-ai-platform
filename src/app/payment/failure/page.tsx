'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
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
        <Link
          href="/cart"
          className="inline-block rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700"
        >
          بازگشت به سبد خرید
        </Link>
      </div>
    </div>
  )
}
