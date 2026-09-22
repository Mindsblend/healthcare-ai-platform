'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useBlogBySlug } from '@/features/shop/hooks/blogs/useBlogsBySlug'
import LoadingBar from '@/components/layout/LoadingBar'

/**
 * Rough reading-time estimate straight from the blog's HTML body —
 * no extra field needed from the API. Persian body copy averages
 * roughly 180 words per minute for casual reading.
 */
function estimateReadingTime(html: string) {
  const words = html
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 180))
}

function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.2l8.1-9.3L1 2h7l4.9 6 6-6Z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12.5 19.5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const currentUrl = () =>
    typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable in this context — fail silently.
    }
  }

  const openShare = (buildUrl: (url: string, text: string) => string) => {
    window.open(buildUrl(currentUrl(), title), '_blank', 'noopener,noreferrer')
  }

  const buttonClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-900 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="اشتراک‌گذاری در تلگرام"
        onClick={() =>
          openShare(
            (url, text) =>
              `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          )
        }
        className={buttonClass}
      >
        <TelegramIcon />
      </button>

      <button
        type="button"
        aria-label="اشتراک‌گذاری در ایکس"
        onClick={() =>
          openShare(
            (url, text) =>
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          )
        }
        className={buttonClass}
      >
        <XIcon />
      </button>

      <button
        type="button"
        aria-label="کپی کردن لینک"
        onClick={handleCopy}
        className={buttonClass}
      >
        {copied ? <CheckIcon /> : <LinkIcon />}
      </button>

      {copied && (
        <span className="font-ray text-xs text-gray-500">لینک کپی شد</span>
      )}
    </div>
  )
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug as string)

  const { blog, loading, error } = useBlogBySlug({ slug })

  const readingTime = useMemo(
    () => (blog ? estimateReadingTime(blog.content) : 0),
    [blog],
  )

  if (!loading && !error && !blog) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-red-500"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
          </div>
          <h2 className="font-aria text-2xl font-extrabold text-gray-900">
            بلاگ پیدا نشد
          </h2>
          <p className="font-ray mt-2 text-gray-500">
            بلاگ مورد نظر شما موجود نمی‌باشد یا حذف شده است.
          </p>
          <Link
            href="/"
            className="font-ray mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
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
        <article className="container">
          <div className="mx-auto max-w-3xl pt-4 pb-4 sm:pt-6">
            <nav
              aria-label="مسیر صفحه"
              className="font-ray flex items-center gap-1.5 text-xs text-gray-400 sm:text-sm"
            >
              <Link href="/" className="transition-colors hover:text-gray-700">
                فروشگاه
              </Link>
              <span>/</span>
              <Link
                href="/blogs"
                className="transition-colors hover:text-gray-700"
              >
                بلاگ
              </Link>
              <span>/</span>
              <span className="line-clamp-1 text-gray-600">{blog.title}</span>
            </nav>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-3xl overflow-hidden rounded-3xl bg-contain sm:aspect-2/1">
            <Image
              src={blog.image}
              fill
              alt={blog.title}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px"
              className="object-cover object-center"
            />
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-8 lg:mt-12 lg:space-y-10">
            <header className="space-y-5">
              <h1 className="font-aria text-2xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-4xl xl:text-5xl">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div className="flex shrink-0 items-center gap-2.5">
                  <Image
                    src={blog.authorImage || '/images/default-avatar.png'}
                    alt={blog.author}
                    width={46}
                    height={46}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-aria text-color-title-on-light text-[16px] font-extrabold">
                      {blog.author}
                    </h2>
                    <p className="font-ray text-color-title-on-light text-[14px]">
                      نویسنده و پژوهشگر
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-ray flex items-center gap-1.5 text-xs text-gray-400 sm:text-sm">
                    <ClockIcon />
                    {readingTime} دقیقه مطالعه
                  </span>
                  <ShareButtons title={blog.title} />
                </div>
              </div>
            </header>

            <div
              className="font-ray [&_h1]:font-aria [&_h2]:font-aria [&_h3]:font-aria text-sm leading-8 font-medium text-gray-700 sm:text-base xl:text-lg [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-blue-700 [&_b]:font-bold [&_b]:text-gray-900 [&_blockquote]:border-r-4 [&_blockquote]:border-gray-200 [&_blockquote]:pr-4 [&_blockquote]:text-gray-500 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_img]:my-4 [&_img]:rounded-2xl [&_li]:mb-1.5 [&_ol]:mr-5 [&_ol]:list-decimal [&_p]:mb-4 [&_strong]:font-bold [&_strong]:text-gray-900 [&_ul]:mr-5 [&_ul]:list-disc"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <div className="flex flex-col items-center gap-4 rounded-3xl bg-gray-50 p-6 text-center sm:flex-row sm:text-right">
              <Image
                src={blog.authorImage || '/images/default-avatar.png'}
                alt={blog.author}
                width={60}
                height={60}
                className="shrink-0 rounded-full object-cover"
              />
              <div>
                <h3 className="font-aria text-lg font-extrabold text-gray-900">
                  {blog.author}
                </h3>
                <p className="font-ray mt-1 text-sm text-gray-500">
                  نویسنده و پژوهشگر این مقاله بودند.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-2 pb-10">
              <Link
                href="/blogs"
                className="font-ray inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                مشاهده سایر مقالات
              </Link>
            </div>
          </div>
        </article>
      )}
    </LoadingBar>
  )
}
