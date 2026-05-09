'use client'

import { useParams } from 'next/navigation'
import { useBlogBySlug } from '@/features/shop/hooks/blogs/useBlogsBySlug'
import Link from 'next/link'

export default function ProductPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug as string)

  const { blog, loading: blogLoading, error: blogError } = useBlogBySlug(slug)

  if (blogLoading) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری ...</p>
        </div>
      </div>
    )
  }

  if (blogError || !blog) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">محصول پیدا نشد</h2>
          <p className="mt-2 text-gray-600">
            محصول مورد نظر شما موجود نمی‌باشد.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    )
  }

  return <div className="text-red-600">{blog.title}</div>
}
