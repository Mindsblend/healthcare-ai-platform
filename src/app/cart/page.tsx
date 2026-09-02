'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/features/shop/hooks/cart/useCart'
import CartItem from '@/components/domain/cart/CartItem'
import FreeShippingProgressBar from '@/components/domain/cart/FreeShippingProgressBar'
import Image from 'next/image'
import LoadingBar from '@/components/layout/LoadingBar'

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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const TAX_RATE = 0.09

  const taxAmount = Math.round(subtotal * TAX_RATE)

  const totalAmount = subtotal + taxAmount

  const FREE_SHIPPING_THRESHOLD = 2_000_000

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
    cartLoading || isCheckoutLoading || cartItems.length === 0

  return (
    <LoadingBar
      loading={cartLoading}
      error={error}
      loadingText="در حال بارگذاری سبد خرید..."
      showOnlyOnInitialLoad
    >
      <div className="container mt-5">
        <div className="my-10 flex flex-col items-center justify-between gap-5 sm:flex-row xl:gap-10">
          {/* CART */}
          <div className="flex h-113 w-full max-w-7xl flex-col rounded-3xl border-2 border-[#d9d9d9]">
            {/* HEADER */}
            <div className="font-aria hidden shrink-0 grid-cols-[2fr_1fr_1fr_40px] border-b-2 px-8 py-5 text-xl font-bold lg:grid">
              <span className="text-color-title-on-light">نام محصول</span>

              <span className="text-color-title-on-light mr-6">تعداد</span>

              <span className="text-color-title-on-light">قیمت</span>

              <span className="text-color-title-on-light">حذف</span>
            </div>

            {/* SCROLL AREA */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Image
                    src="/images/binoculars.svg"
                    alt="Empty cart"
                    width={120}
                    height={120}
                    className="mb-6 opacity-70"
                  />

                  <h2 className="font-aria text-color-title-on-light text-2xl font-extrabold">
                    سبد خرید شما خالی است
                  </h2>

                  <p className="font-ray text-color-body-on-light mt-2 text-sm">
                    هنوز محصولی به سبد خرید اضافه نکرده‌اید
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    title={item.product.title}
                    solution={item.product.solution}
                    count={item.quantity}
                    price={item.price}
                    image={item.product.image}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))
              )}
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="flex h-113 w-full flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-7 lg:max-w-92.5">
            <h1 className="font-aria text-color-title-on-light mt-12.5 text-center text-2xl font-extrabold">
              خلاصه سفارشات
            </h1>

            <div className="space-y-5 mt-5">
              <div className="flex items-center justify-between">
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  جمع خرید
                </h1>

                <h1 className="font-ray text-color-title-on-light font-bold text-lg">
                  {subtotal.toLocaleString('fa-IR')} تومان
                </h1>
              </div>

              <div className="flex items-center justify-between">
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  مالیات
                </h1>

                <h1 className="font-ray text-color-title-on-light font-bold text-lg">
                  {taxAmount.toLocaleString('fa-IR')} تومان
                </h1>
              </div>

              <div className="flex items-center justify-between">
                <FreeShippingProgressBar
                  subtotal={subtotal}
                  threshold={FREE_SHIPPING_THRESHOLD}
                />
              </div>

              <hr className="border mb-6" />

              <div className="flex items-center justify-between">
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  جمع کل
                </h1>

                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  {totalAmount.toLocaleString('fa-IR')} تومان
                </h1>
              </div>
            </div>

            {/* CHECKOUT */}
            <div className="pb-10">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkoutDisabled}
                className={`text-color-title-on-dark font-ray h-13.5 w-full rounded-[10px] font-medium transition ${
                  checkoutDisabled
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'cursor-pointer bg-black hover:bg-gray-800'
                } `}
              >
                {isCheckoutLoading || isSyncing
                  ? 'در حال بروزرسانی سبد...'
                  : 'تکمیل سفارش'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </LoadingBar>
  )
}

export default Page
