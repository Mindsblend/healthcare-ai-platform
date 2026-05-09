'use client'

import { useParams } from 'next/navigation'
import { useBlogBySlug } from '@/features/shop/hooks/blogs/useBlogsBySlug'

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
        {blog?.title}
        {blog?.description}
      </div>
    )
  }
}
