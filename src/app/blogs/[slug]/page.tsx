'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useBlogBySlug } from '@/features/shop/hooks/blogs/useBlogsBySlug'
import Link from 'next/link'
import LoadingBar from '@/components/layout/LoadingBar'

export default function ProductPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug as string)

  const { blog, loading, error } = useBlogBySlug(slug)

  if (!loading && !error && !blog) {
    return (
      <div className="container flex min-h-100 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">بلاگ پیدا نشد</h2>
          <p className="mt-2 text-gray-600">
            بلاگ مورد نظر شما موجود نمی‌باشد.
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

  return (
    <LoadingBar
      loading={loading}
      error={error}
      loadingText="در حال بارگذاری بلاگ..."
    >
      {blog && (
        <div className="container text-black">
          <div className="relative aspect-square w-full sm:aspect-2/1 lg:aspect-21/9">
            <Image
              src={blog.image}
              fill
              alt="blogs image"
              className="rounded-3xl object-cover object-center"
              priority
            />
          </div>

          <div className="mt-5 space-y-5 lg:mt-12 lg:space-y-8">
            <h1 className="font-aria text-2xl font-extrabold sm:text-4xl xl:text-6xl">
              {blog.title}
            </h1>

            <div
              className="font-ray text-sm font-medium sm:text-sm xl:text-lg"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />

            <div className="flex shrink-0 items-center gap-2.5">
              <Image
                src={blog.authorImage || '/images/default-avatar.png'}
                alt="writer image"
                width={46}
                height={46}
                className="rounded-full"
              />
              <div>
                <h1 className="font-aria text-color-title-on-light text-[16px] font-extrabold">
                  {blog.author}
                </h1>
                <p className="font-ray text-color-title-on-light text-[14px]">
                  نویسنده و پژوهشگر
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </LoadingBar>
  )
}
