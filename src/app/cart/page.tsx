'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/features/shop/hooks/cart/useCart'
import LoadingBar from '@/components/layout/LoadingBar'

const FREE_SHIPPING_THRESHOLD = 2_000_000

const formatNumber = (value: number) => value.toLocaleString('fa-IR')

/* ------------------------------ Icons ------------------------------ */

const CheckIcon = () => (
  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#007926]">
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden>
      <path
        d="M1 3l2 2 4-4.2"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
)

const TrashIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
    <path
      d="M1 3.5h12M5 3.5V2a1 1 0 011-1h2a1 1 0 011 1v1.5M2.5 3.5l.6 9.6a1 1 0 001 .9h5.8a1 1 0 001-.9l.6-9.6M5.5 6.5v5M8.5 6.5v5"
      stroke="#EB3223"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const PlusIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
    <path d="M5 0v10M0 5h10" stroke="#1C1B1F" strokeWidth="1.6" />
  </svg>
)

const MinusIcon = () => (
  <svg width="10" height="2" viewBox="0 0 10 2" fill="none" aria-hidden>
    <path d="M0 1h10" stroke="#1C1B1F" strokeWidth="1.6" />
  </svg>
)

/* ------------------------------- Page ------------------------------ */

const Page = () => {
  const router = useRouter()

  const {
    cartItems,
    error,
    updateQuantity,
    removeFromCart,
    loading: cartLoading,
    isSyncing,
    waitForCartSync,
  } = useCart()

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  const [removingIds, setRemovingIds] = useState<
    Set<(typeof cartItems)[number]['id']>
  >(new Set())

  /* ---------- calculations ---------- */

  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  const payableAmount = cartItems.reduce((sum, item) => {
    const finalPrice = item.product.discountedPrice ?? item.product.price
    return sum + finalPrice * item.quantity
  }, 0)

  const savings = originalTotal - payableAmount
  const savingsPercent =
    originalTotal > 0 ? Math.round((savings / originalTotal) * 100) : 0

  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD - payableAmount,
    0,
  )
  const hasFreeShipping = payableAmount >= FREE_SHIPPING_THRESHOLD
  const shippingProgress = Math.min(
    (payableAmount / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  )

  /* ---------- remove ---------- */

  const handleRemove = async (id: (typeof cartItems)[number]['id']) => {
    // جلوگیری از کلیک چندباره
    if (removingIds.has(id)) return

    setRemovingIds((prev) => new Set(prev).add(id))

    try {
      await removeFromCart(id)
    } catch (err) {
      console.error('Could not remove item from cart:', err)
    } finally {
      // اگر حذف موفق باشد، آیتم از سبد پاک شده؛ اگر خطا بود دوباره حالت عادی می‌گیرد
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  /* ---------- checkout ---------- */

  const handleCheckout = async () => {
    /**
     * Prevent double click
     */
    if (isCheckoutLoading) {
      return
    }

    /**
     * Empty cart
     */
    if (cartItems.length === 0) {
      return
    }

    try {
      setIsCheckoutLoading(true)

      /**
       * IMPORTANT:
       *
       * Wait until every pending cart mutation
       * has finished on the backend.
       *
       * For example:
       *
       * + + + + +
       *
       * UI may already show 6,
       * but this waits until backend also has 6.
       */
      await waitForCartSync()

      /**
       * Only after backend is synchronized
       * do we navigate to order page.
       */
      router.push('/order')
    } catch (err) {
      console.error('Could not continue to checkout:', err)
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  const checkoutDisabled =
    cartLoading ||
    isCheckoutLoading ||
    cartItems.length === 0 ||
    removingIds.size > 0

  return (
    <LoadingBar
      loading={cartLoading}
      error={error}
      loadingText="در حال بارگذاری سبد خرید..."
      showOnlyOnInitialLoad
    >
      <div className="container">
        <div className="mx-auto my-5 flex w-full flex-col items-stretch gap-5 lg:flex-row lg:items-start xl:gap-10">
          {/* ============================ CART ============================ */}
          <section className="flex w-full flex-col gap-5 rounded-[25px] border-2 border-[#F2F2F2] bg-white px-4 py-5 sm:gap-6 sm:px-[39px] sm:py-6 lg:h-[512px] lg:flex-1">
            {/* Header */}
            <div className="flex shrink-0 flex-col gap-[14px]">
              <div className="flex items-center gap-[14px]">
                <h1 className="font-aria text-lg leading-[26px] font-bold text-[#09090B] sm:text-xl">
                  سبد خرید شما
                </h1>
                <span className="font-ray text-xs leading-[22px] font-medium text-[#71717A] sm:text-sm">
                  ({formatNumber(itemsCount)} کالا)
                </span>
              </div>

              {cartItems.length > 0 && hasFreeShipping && (
                <div className="flex min-h-[46px] items-center gap-[14px] rounded-[10px] border border-[#91FFB7] bg-[#F0FDF4] px-4 py-2 sm:px-5">
                  <CheckIcon />
                  <p className="font-ray text-xs leading-[22px] font-medium text-[#007926] sm:text-sm">
                    خرید شما شامل ارسال رایگان و سریع شد!
                  </p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="max-h-[480px] min-h-0 flex-1 overflow-y-auto lg:max-h-none">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <Image
                    src="/images/binoculars.svg"
                    alt="Empty cart"
                    width={120}
                    height={120}
                    className="mb-6 opacity-70"
                  />
                  <h2 className="font-aria text-xl font-extrabold text-[#09090B] sm:text-2xl">
                    سبد خرید شما خالی است
                  </h2>
                  <p className="font-ray mt-2 text-sm text-[#555555]">
                    هنوز محصولی به سبد خرید اضافه نکرده‌اید
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col sm:pl-9">
                  {cartItems.map((item) => {
                    const originalPrice = item.product.price
                    const discountedPrice =
                      item.product.discountedPrice ?? originalPrice

                    const discountAmount = originalPrice - discountedPrice

                    const discountPercent =
                      originalPrice > 0
                        ? Math.round((discountAmount / originalPrice) * 100)
                        : 0

                    const isRemoving = removingIds.has(item.id)

                    return (
                      <li
                        key={item.id}
                        aria-busy={isRemoving}
                        className={`flex min-h-[92px] flex-wrap items-center justify-between gap-x-4 gap-y-4 border-b-[1.5px] border-[#F2F2F2] py-5 transition-all duration-200 first:pt-0 last:border-b-0 last:pb-0 sm:gap-x-6 sm:py-6 ${
                          isRemoving
                            ? 'pointer-events-none opacity-50 grayscale'
                            : ''
                        }`}
                      >
                        {/* Image + info */}
                        <div className="flex w-full min-w-0 items-center gap-3 sm:gap-[15px] xl:w-[354px]">
                          {/* Product Image */}
                          <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[11px] bg-[#F2F2F2] sm:h-[92px] sm:w-[92px]">
                            <Image
                              src={item.product.image}
                              alt={item.product.title}
                              fill
                              sizes="(min-width: 640px) 92px, 72px"
                              className="object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex min-w-0 flex-col gap-2 sm:gap-[10px]">
                            <h3 className="font-aria text-base leading-[23px] font-bold text-[#09090B] sm:text-lg">
                              {item.product.title}
                            </h3>

                            {item.product.solution && (
                              <p className="font-ray line-clamp-2 text-xs leading-[19px] font-medium text-[#555555]">
                                {item.product.solution}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quantity + delete */}
                        <div className="flex h-10 items-center gap-[10px]">
                          {/* Stepper */}
                          <div className="flex h-10 w-[100px] items-center justify-center rounded-[22px] bg-[#F2F2F2] px-3">
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                aria-label="افزایش تعداد"
                                disabled={isRemoving}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="flex h-6 w-[10px] cursor-pointer items-center justify-center transition hover:opacity-60 disabled:cursor-not-allowed"
                              >
                                <PlusIcon />
                              </button>

                              <span className="font-aria w-6 text-center text-base leading-[21px] font-extrabold text-black">
                                {formatNumber(item.quantity)}
                              </span>

                              <button
                                type="button"
                                aria-label="کاهش تعداد"
                                disabled={item.quantity <= 1 || isRemoving}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="flex h-6 w-[10px] cursor-pointer items-center justify-center transition hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <MinusIcon />
                              </button>
                            </div>
                          </div>

                          {/* Delete */}
                          <button
                            type="button"
                            aria-label="حذف از سبد خرید"
                            disabled={isRemoving}
                            onClick={() => handleRemove(item.id)}
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[29px] bg-[#FEF2F2] transition hover:bg-[#fde0e0] disabled:cursor-not-allowed"
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex w-[120px] flex-col justify-end">
                          {discountAmount > 0 && (
                            <div className="flex items-center gap-2 self-end">
                              <span className="font-ray rounded-md bg-[#FEF2F2] px-1 py-0.5 text-[11px] font-bold text-[#EB3223]">
                                {formatNumber(discountPercent)}٪ تخفیف
                              </span>
                              <span className="font-ray self-end text-xs font-medium text-[#A1A1AA] line-through">
                                {formatNumber(originalPrice)}
                              </span>
                            </div>
                          )}

                          <span className="font-aria self-end text-xl leading-[31px] font-extrabold text-[#09090B] sm:text-2xl">
                            {formatNumber(discountedPrice)}
                          </span>

                          <span className="font-ray self-end text-xs leading-[21px] font-bold text-[#A1A1AA] sm:text-[13px]">
                            تومان
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* ======================== ORDER SUMMARY ======================= */}
          <aside className="flex w-full flex-col gap-8 rounded-[25px] border-2 border-[#F2F2F2] bg-white px-5 py-6 sm:gap-10 sm:px-[30px] sm:py-7 lg:h-[512px] lg:w-[384px] lg:shrink-0">
            <h2 className="font-aria text-lg leading-[26px] font-bold text-[#09090B] sm:text-xl">
              خلاصه فاکتور
            </h2>

            <div className="flex flex-col gap-[19px]">
              <div className="flex flex-col gap-[10px] sm:gap-[30px]">
                <div className="flex flex-col gap-4 sm:gap-7">
                  {/* Prices + progress */}
                  <div className="flex flex-col gap-[15px]">
                    <div className="flex flex-col gap-[14px]">
                      <div className="flex flex-wrap items-center justify-between gap-x-3">
                        <span className="font-ray text-sm leading-[26px] font-bold text-[#555555] sm:text-base">
                          قیمت کالاها ({formatNumber(itemsCount)})
                        </span>
                        <span className="font-ray text-sm leading-[26px] font-bold text-[#09090B] sm:text-base">
                          {formatNumber(payableAmount)} تومان
                        </span>
                      </div>

                      {savings > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-x-3">
                          <span className="font-ray text-sm leading-[26px] font-bold text-[#555555] sm:text-base">
                            سود شما از این خرید
                          </span>
                          <span
                            dir="rtl"
                            className="font-ray text-sm leading-[26px] font-bold text-[#007926] sm:text-base"
                          >
                            ({formatNumber(savingsPercent)}٪){' '}
                            {formatNumber(savings)} تومان
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-[11px]">
                      <div className="relative h-[7px] w-full">
                        <div className="absolute inset-x-0 top-[2px] h-[3px] rounded-[1px] bg-[#F2F2F2]" />
                        <div
                          className="absolute top-[2px] right-0 h-[3px] rounded-[1px] bg-[#007926] transition-all duration-500"
                          style={{ width: `${shippingProgress}%` }}
                        />
                        <div
                          className="absolute top-px h-[5px] w-[5px] rounded-full bg-[#007926] transition-all duration-500"
                          style={{
                            right: `calc(${shippingProgress}% - 5px)`,
                          }}
                        />
                      </div>
                      <p className="font-ray text-xs leading-[19px] font-medium text-black">
                        {hasFreeShipping
                          ? 'هزینه ارسال برای شما رایگان است'
                          : `${formatNumber(remainingForFreeShipping)} تومان تا رایگان شدن هزینه ارسال`}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="border-t-[1.5px] border-[#F2F2F2]" />

                  {/* Payable */}
                  <div className="flex items-start justify-between">
                    <span className="font-aria text-base leading-[23px] font-bold text-[#09090B] sm:text-lg">
                      مبلغ قابل پرداخت
                    </span>
                    <div className="flex flex-col">
                      <span className="font-aria text-xl leading-[31px] font-extrabold text-[#09090B] sm:text-2xl">
                        {formatNumber(payableAmount)}
                      </span>
                      <span className="font-ray self-end text-xs leading-[21px] font-bold text-[#A1A1AA] sm:text-[13px]">
                        تومان
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutDisabled}
                  className={`font-aria flex h-[54px] w-full items-center justify-center rounded-[10px] p-[10px] text-sm leading-[21px] font-bold text-white transition sm:text-base ${
                    checkoutDisabled
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'cursor-pointer bg-black hover:bg-gray-800'
                  }`}
                >
                  {isCheckoutLoading || isSyncing
                    ? 'در حال بروزرسانی سبد...'
                    : 'ادامه جهت تسویه حساب'}
                </button>
              </div>

              {/* Trust notes */}
              <ul className="font-ray flex flex-col gap-[5px] rounded-[9px] border border-[#D9D9D9] bg-[#F2F2F2] px-4 py-1.5 text-sm leading-[22px] font-medium text-[#71717A]">
                <li>• تضمین اصل بودن کالا و سلامت فیزیکی</li>
                <li>• پرداخت از درگاه رسمی و رمزنگاری‌شده</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </LoadingBar>
  )
}

export default Page
