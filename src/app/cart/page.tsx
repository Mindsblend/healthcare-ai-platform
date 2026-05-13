'use client'

import { useCart } from '@/features/shop/hooks/cart/useCart'
import CartItem from '@/components/domain/cart/CartItem'
import FreeShippingProgressBar from '@/components/domain/cart/FreeShippingProgressBar'
import Image from 'next/image'
import Link from 'next/link'
import LoadingBar from '@/components/layout/LoadingBar'

const page = () => {
  const {
    cartItems,
    error,
    updateQuantity,
    removeFromCart,
    loading: cartLoading,
  } = useCart()

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const TAX_RATE = 0.09

  const taxAmount = Math.round(subtotal * TAX_RATE)

  const totalAmount = subtotal + taxAmount

  const FREE_SHIPPING_THRESHOLD = 2_000_000

  return (
    <LoadingBar
      loading={cartLoading}
      error={error}
      loadingText="در حال بارگذاری سبد خرید..."
    >
      <div className="container mt-16">
        <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold">
          سبد خرید شما
        </h1>
        <div className="mt-10 flex flex-col items-center justify-between gap-5 sm:flex-row xl:gap-10">
          <div className="flex h-113 w-full max-w-7xl flex-col rounded-3xl border-2 border-[#d9d9d9]">
            {/* HEADER (fixed height) */}
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

          <div className="flex h-113 w-full flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-9 lg:max-w-92.5">
            <h1 className="font-aria text-color-title-on-light mt-9 text-center text-2xl font-extrabold">
              خلاصه سفارشات
            </h1>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  جمع خرید
                </h1>
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  {subtotal.toLocaleString('fa-IR')} تومان
                </h1>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  مالیات
                </h1>
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  {taxAmount.toLocaleString('fa-IR')} تومان
                </h1>
              </div>
              <div className="flex items-center justify-between">
                <FreeShippingProgressBar
                  subtotal={subtotal}
                  threshold={FREE_SHIPPING_THRESHOLD}
                />
              </div>
              <hr className="border" />
              <div className="flex items-center justify-between">
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  جمع کل
                </h1>
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  {totalAmount.toLocaleString('fa-IR')} تومان
                </h1>
              </div>
            </div>
            <div className="pb-6">
              <Link href="/order">
                <button
                  disabled={!cartItems?.length}
                  className={`text-color-title-on-dark font-ray h-13.5 w-full cursor-pointer rounded-4xl bg-black font-medium transition hover:bg-gray-800 ${cartItems.length === 0 ? 'bg-gray-800' : ''}`}
                >
                  تکمیل سفارش
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LoadingBar>
  )
}

export default page
