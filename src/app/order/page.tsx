'use client'

import { useCart } from '@/features/shop/hooks/cart/useCart'
import Image from 'next/image'
import { useState, ChangeEvent } from 'react'
import { useCreateOrder } from '@/features/dashboard/hooks/createOrders'
import { ShippingInfo } from '@/components/types/types'

const CheckoutPage = () => {
  const { cartItems, loading: cartLoading } = useCart()
  const [activeBtn, setActiveBtn] = useState<'mellat' | 'zarinpal'>('zarinpal')

  const { createOrder, loading: orderLoading } = useCreateOrder()

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    city: '',
    province: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    notes: '',
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      await createOrder({
        shippingInfo,
        paymentMethod: activeBtn,
      })
      alert('سفارش با موفقیت ثبت شد!')
    } catch (err) {
      console.error('Order creation error:', err)
      alert('خطا در ثبت سفارش، لطفا دوباره تلاش کنید.')
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const TAX_RATE = 0.09
  const taxAmount = Math.round(subtotal * TAX_RATE)
  const totalAmount = subtotal + taxAmount

  if (cartLoading) return <div>در حال بارگذاری سبد خرید...</div>

  return (
    <section className="container mt-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* ===== RIGHT: Checkout Form ===== */}
        <div className="col-span-1 xl:col-span-2">
          <div className="rounded-2xl border-2 border-[#d9d9d9] bg-white p-8">
            <h2 className="font-aria text-color-title-on-light mb-6 text-right text-[24px] font-bold">
              اطلاعات خرید
            </h2>

            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                name="firstName"
                type="text"
                placeholder="نام"
                value={shippingInfo.firstName}
                onChange={handleChange}
                className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
              />
              <input
                name="lastName"
                type="text"
                placeholder="نام خانوادگی"
                value={shippingInfo.lastName}
                onChange={handleChange}
                className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
              />
              <input
                name="city"
                type="text"
                placeholder="شهر"
                value={shippingInfo.city}
                onChange={handleChange}
                className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
              />
              <input
                name="province"
                type="text"
                placeholder="استان"
                value={shippingInfo.province}
                onChange={handleChange}
                className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
              />
              <input
                name="email"
                type="email"
                placeholder="ایمیل"
                value={shippingInfo.email}
                onChange={handleChange}
                className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
              />
              <input
                name="phone"
                type="tel"
                placeholder="شماره تماس"
                value={shippingInfo.phone}
                onChange={handleChange}
                className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
              />
              <input
                name="address"
                type="text"
                placeholder="آدرس کامل"
                value={shippingInfo.address}
                onChange={handleChange}
                className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
              />
              <input
                name="postalCode"
                type="text"
                placeholder="کد پستی"
                value={shippingInfo.postalCode}
                onChange={handleChange}
                className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
              />
              <textarea
                name="notes"
                placeholder="یادداشت سفارش"
                value={shippingInfo.notes}
                onChange={handleChange}
                className="font-aria text-color-body-on-light col-span-1 w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black md:col-span-2"
              />
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between rounded-2xl border-2 border-[#d9d9d9] bg-white px-6 py-3.5">
              {/* Payment Method Buttons */}
              <div>
                <h1 className="font-aria text-color-title-on-light text-base font-extrabold">
                  انتخاب درگاه پرداخت
                </h1>
                <p className="font-aria text-color-body-on-dark my-1.5 max-w-xs text-sm font-semibold">
                  شما با انتخاب درگاه پرداخت خود میتوانید خریدی اسوده و مطمعن
                  داشته باشید.
                </p>
              </div>
              <div className="flex items-center gap-3.5">
                <div
                  onClick={() => setActiveBtn('zarinpal')}
                  className={`flex h-[78px] cursor-pointer items-center justify-center rounded-2xl p-3 ${
                    activeBtn === 'zarinpal'
                      ? 'border-2 border-[#d9d9d9] bg-white'
                      : ''
                  }`}
                >
                  <Image
                    src="/images/zarinpal.svg"
                    alt="zarinpal"
                    width={38}
                    height={50}
                  />
                </div>
                <div
                  onClick={() => setActiveBtn('mellat')}
                  className={`flex h-[78px] cursor-pointer items-center justify-center rounded-2xl px-1 py-[9px] ${
                    activeBtn === 'mellat'
                      ? 'border-2 border-[#d9d9d9] bg-white'
                      : ''
                  }`}
                >
                  <Image
                    src="/images/bank-mellat.svg"
                    alt="bank mellat"
                    width={56}
                    height={56}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={orderLoading}
              className="text-color-title-on-dark font-ray mt-6 h-[54px] w-full cursor-pointer rounded-4xl bg-black font-medium"
            >
              {orderLoading ? 'در حال ثبت سفارش...' : 'ثبت سفارش و پرداخت'}
            </button>
          </div>
        </div>

        {/* ===== LEFT: Order Summary ===== */}
        <div className="space-y-6">
          {/* Cart Details */}
          <div className="flex h-[370px] flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-7">
            <h1 className="font-aria text-color-title-on-light mt-9 text-center text-2xl font-extrabold">
              لیست سفارشات
            </h1>
            <div className="mt-8 mb-8 flex-1 space-y-5 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl"
                >
                  <div className="shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                  </div>
                  <div className="flex-1 px-4">
                    <h3 className="font-aria text-color-title-on-light text-lg font-extrabold">
                      {item.product.title}
                    </h3>
                    <p className="font-ray text-color-body-on-light mt-1 text-xs font-medium">
                      {item.product.solution}
                    </p>
                  </div>
                  <div className="font-aria text-color-title-on-light shrink-0 text-base font-extrabold">
                    {item.price.toLocaleString('fa-IR')} تومان
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex h-[452px] flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-9">
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default CheckoutPage
