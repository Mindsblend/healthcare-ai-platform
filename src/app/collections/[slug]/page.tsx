'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollectionBySlug } from '@/features/shop/hooks/collections/useCollectionBySlug'
import { useCart } from '@/features/shop/hooks/cart/useCart'
import LoadingBar from '@/components/layout/LoadingBar'
import CollectionCard from '@/components/layout/CollectionCard'

export default function CollectionDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const { collection, loading, error } = useCollectionBySlug(slug)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [showShareSuccess, setShowShareSuccess] = useState(false)

  const { addToCart, loading: cartLoading } = useCart()

  const handleAddAllToCart = async () => {
    setIsAdding(true)
    try {
      for (const item of collection?.products || []) {
        await addToCart(item.product.id, 1)
      }
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to add collection to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShowShareSuccess(true)
      setTimeout(() => setShowShareSuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    } finally {
      setIsSharing(false)
    }
  }

  if (loading) {
    return (
      <LoadingBar loading={true} loadingText="در حال بارگذاری...">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </LoadingBar>
    )
  }

  if (error || !collection) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-500">{error || 'مجموعه‌ای یافت نشد'}</p>
        <Link
          href={'/shop'}
          className="mt-4 inline-block rounded-full bg-black px-6 py-2 text-sm text-white transition hover:bg-gray-800"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    )
  }

  const productCount = collection.products?.length || 0

  // Calculate total price (all products)
  let totalPrice = 0
  collection.products?.forEach((cp: any) => {
    totalPrice += cp.product.price
  })

  // Build a summary of health benefits (from product solutions)
  const healthTags =
    collection.products
      ?.map((cp: any) => cp.product.solution)
      .filter(Boolean)
      .slice(0, 3) || []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-gray-100 md:h-[60vh]">
        <Image
          src={collection.image || '/images/placeholder.png'}
          alt={collection.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute right-0 bottom-0 left-0">
          <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
            <div className="mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-black/70 uppercase backdrop-blur-sm sm:px-3 sm:py-1 sm:text-[11px]">
                مجموعه سلامت
              </span>

              <h1 className="font-aria mt-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {collection.name}
              </h1>

              {collection.subtitle && (
                <p className="mt-2 text-base text-white/80 sm:text-lg">
                  {collection.subtitle}
                </p>
              )}

              <p className="mt-3 max-w-2xl text-xs text-white/70 sm:mt-4 sm:text-sm">
                {collection.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div
            id="collection-stats-bar"
            className="flex flex-col flex-wrap items-center justify-between gap-3 py-3 sm:flex-row sm:gap-4 sm:py-4"
          >
            {/* Share Button */}
            <div className="flex w-full justify-start sm:w-auto">
              <button
                onClick={handleShare}
                disabled={isSharing || showShareSuccess}
                className="flex h-11 cursor-pointer items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-50 sm:px-6"
                aria-label="اشتراک‌گذاری"
              >
                <AnimatePresence mode="wait">
                  {showShareSuccess ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 text-green-600"
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
                      کپی شد!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      <span className="hidden sm:inline">اشتراک‌گذاری</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Center Stats */}
            <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:w-auto sm:flex-nowrap sm:gap-4 md:gap-6">
              <div className="min-w-[70px] flex-1 text-center sm:min-w-[80px]">
                <span className="text-[10px] tracking-wide text-gray-500 uppercase sm:text-xs">
                  تعداد محصولات
                </span>
                <p className="text-base font-semibold text-black sm:text-lg">
                  {productCount}
                </p>
              </div>

              <div className="min-w-[100px] flex-1 text-center sm:min-w-[120px]">
                <span className="text-[10px] tracking-wide text-gray-500 uppercase sm:text-xs">
                  مجموع قیمت
                </span>
                <p className="text-base font-semibold text-black sm:text-lg">
                  {totalPrice.toLocaleString('fa-IR')} تومان
                </p>
              </div>

              {healthTags.length > 0 && (
                <div className="min-w-[120px] flex-1 text-center sm:min-w-[140px]">
                  <span className="text-[10px] tracking-wide text-gray-500 uppercase sm:text-xs">
                    فواید کلیدی
                  </span>
                  <p className="text-sm font-medium text-black sm:text-base">
                    {healthTags.join(' • ')}
                  </p>
                </div>
              )}
            </div>

            {/* Add All Button */}
            <div className="flex w-full justify-end sm:w-auto">
              <button
                onClick={handleAddAllToCart}
                disabled={isAdding || cartLoading || showSuccess}
                className={`h-11 w-full cursor-pointer rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto ${
                  isAdding || cartLoading ? 'cursor-not-allowed opacity-70' : ''
                }`}
              >
                <AnimatePresence mode="wait">
                  {showSuccess ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <svg
                        className="h-4 w-4"
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
                      افزوده شد!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      {isAdding || cartLoading
                        ? 'در حال افزودن...'
                        : `افزودن همه (${productCount})`}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive grid fix */}
      <style>{`
        @media (min-width: 640px) and (max-width: 1024px) {
          #collection-stats-bar {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0.75rem !important;
            align-items: start !important;
          }
          #collection-stats-bar > div:nth-child(2) {
            grid-column: 1 / -1;
            order: 0;
            margin-bottom: 0.5rem;
          }
          #collection-stats-bar > div:first-child {
            grid-column: 1 / 2;
            order: 1;
            justify-self: start;
          }
          #collection-stats-bar > div:last-child {
            grid-column: 2 / 3;
            order: 1;
            justify-self: end;
          }
        }
      `}</style>

      {/* Products Grid - Using CollectionCard for each product */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="mb-6 md:mb-8">
          <h2 className="font-aria text-2xl font-bold text-black sm:text-3xl">
            محصولات این مجموعه
          </h2>
          <p className="font-ray mt-1 text-sm text-gray-500">
            ترکیبی از بهترین محصولات برای ارتقای سلامت شما
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {collection.products?.map((cp: any, index: number) => {
            // Transform product data to match CollectionCard expected structure
            const productAsCollection = {
              id: cp.product.id,
              name: cp.product.title,
              slug: cp.product.slug,
              subtitle: cp.product.solution || null,
              description: cp.product.description || '',
              image: cp.product.image || '/images/placeholder.png',
              price: cp.product.price,
            }
            return (
              <motion.div
                key={cp.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CollectionCard
                  collection={productAsCollection}
                  hasDiscount={false}
                />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Why This Collection Section - Health-focused */}
      <div className="bg-gray-50 py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <span className="font-aria text-[10px] tracking-[0.2em] text-gray-500 uppercase sm:text-xs">
              چرا این مجموعه؟
            </span>
            <h2 className="font-aria mt-3 text-2xl font-bold text-black sm:text-3xl md:text-4xl lg:text-5xl">
              سلامتی یکپارچه
            </h2>
            <p className="font-ray mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:mt-5 sm:text-base md:mt-6">
              این مجموعه با دقت از میان محصولات برتر انتخاب شده تا به شما کمک
              کند به طور هماهنگ به اهداف سلامتی خود برسید. هر محصول نقشی کلیدی
              در بهبود کیفیت زندگی شما ایفا می‌کند.
            </p>

            <div className="mt-12 grid gap-8 sm:mt-14 md:mt-16 md:grid-cols-3 md:gap-10">
              {/* Benefit 1 */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/10 sm:h-14 sm:w-14 md:mb-5">
                  <svg
                    className="h-6 w-6 text-black sm:h-7 sm:w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-aria text-lg font-bold text-black sm:text-xl">
                  تنوع هدفمند
                </h3>
                <p className="font-ray mt-2 text-sm leading-relaxed text-gray-600 sm:mt-3">
                  ترکیبی از محصولات که جنبه‌های مختلف سلامت شما را پوشش می‌دهند.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/10 sm:h-14 sm:w-14 md:mb-5">
                  <svg
                    className="h-6 w-6 text-black sm:h-7 sm:w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-aria text-lg font-bold text-black sm:text-xl">
                  صرفه‌جویی در هزینه
                </h3>
                <p className="font-ray mt-2 text-sm leading-relaxed text-gray-600 sm:mt-3">
                  خرید این مجموعه به صورت یکجا مقرون‌به‌صرفه‌تر از خرید جداگانه
                  هر محصول است.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/10 sm:h-14 sm:w-14 md:mb-5">
                  <svg
                    className="h-6 w-6 text-black sm:h-7 sm:w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-aria text-lg font-bold text-black sm:text-xl">
                  انتخاب هوشمند
                </h3>
                <p className="font-ray mt-2 text-sm leading-relaxed text-gray-600 sm:mt-3">
                  این مجموعه بر اساس داده‌های سلامت و بازخورد کاربران طراحی شده
                  است.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Shop Button */}
      <div className="container mx-auto px-4 py-10 text-center sm:py-12">
        <Link
          href={'/shop'}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:px-8"
        >
          <svg
            className="h-4 w-4 rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  )
}