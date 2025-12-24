import { useState, useEffect } from 'react'
import Image from 'next/image'

const page = () => {
  const {
    cartItems,
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

  if (cartLoading) {
    return <div>در حال بارگذاری سبد خرید...</div>
  }

  return (
    <div className="container mt-16">
      <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold">
        سبد خرید شما
      </h1>
      <div className="mt-10 flex items-center justify-between gap-10">
        <div className="flex h-[452px] w-full max-w-7xl flex-col rounded-3xl border-2 border-[#d9d9d9]">
          {/* HEADER (fixed height) */}
          <div className="font-aria grid shrink-0 grid-cols-[2fr_1fr_1fr_40px] border-b-2 px-8 py-5 text-xl font-bold">
            <span>نام محصول</span>
            <span className="text-center">تعداد</span>
            <span>قیمت</span>
            <span>حذف</span>
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

        <div className="flex h-[452px] w-[367px] flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-9">
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
                هزینه ارسال
              </h1>
              <h1 className="font-aria text-color-title-on-light font-extrabold">
                --- تومان
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
            <button className="text-color-title-on-dark font-ray h-[54px] w-full rounded-4xl bg-black font-medium">
              تکمیل سفارش
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
