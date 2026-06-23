// src/app/payment/success/page.tsx

'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const refId = searchParams.get('refId')

  useEffect(() => {
    console.log('Payment successful! Ref ID:', refId)
  }, [refId])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
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
          <p className="mb-6 text-sm text-gray-500">شماره پیگیری: {refId}</p>
        )}
        <Link
          href="/dashboard/orders"
          className="inline-block rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
        >
          مشاهده سفارشات
        </Link>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">در حال بارگذاری...</div>}>
      <SuccessContent />
    </Suspense>
  )
}