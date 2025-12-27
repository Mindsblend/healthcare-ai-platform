'use client'

import { useCart } from '@/features/shop/hooks/cart/useCart'
import CartItem from '@/components/domain/cart/CartItem'

const page = () => {
  const { cartItems, loading: cartLoading } = useCart()

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
    <section className="mx-10 py-16">
      {/* ===== Title ===== */}
      <h1 className="font-aria text-color-title-on-light mb-10 text-right text-3xl font-extrabold">
        تسویه حساب
      </h1>

      {/* ===== Main Layout ===== */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ===== RIGHT: Checkout Form ===== */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="font-aria mb-6 text-right text-xl font-bold">
              اطلاعات خریدار
            </h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="نام و نام خانوادگی"
                className="w-full rounded-lg border bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="tel"
                placeholder="شماره تماس"
                className="w-full rounded-lg border bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="text"
                placeholder="آدرس"
                className="w-full rounded-lg border bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-black"
              />

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-black py-3 font-bold text-white transition hover:bg-gray-800"
              >
                ثبت سفارش
              </button>
            </form>
          </div>
        </div>

        {/* ===== LEFT: Order Summary ===== */}
        <div className="space-y-6">
          {/* Cart Details */}
          <div className="flex h-[452px] w-[407px] flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-9">
            <h1 className="font-aria text-color-title-on-light mt-9 text-center text-2xl font-extrabold">
              لیست سفارشات
            </h1>
            <div className="flex-1 space-y-5 overflow-y-auto mt-8 mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl"
                >
                  {/* RIGHT: Image */}
                  <div className="shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                  </div>

                  {/* CENTER: Title + Solution */}
                  <div className="flex-1 px-4">
                    <h3 className="font-aria text-color-title-on-light text-[20px] font-extrabold">
                      {item.product.title}
                    </h3>
                    <p className="font-ray text-color-body-on-light mt-1 text-[12px] font-medium">
                      {item.product.solution}
                    </p>
                  </div>

                  {/* LEFT: Price */}
                  <div className="font-aria text-color-title-on-light shrink-0 text-base font-extrabold">
                    {item.price.toLocaleString('fa-IR')} تومان
                  </div>
                </div>
              ))}
            </div>
            <div className="pb-6">
              <button className="text-color-title-on-dark font-ray h-[54px] w-full rounded-4xl bg-black font-medium">
                تکمیل سفارش
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="flex h-[452px] w-[407px] flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-9">
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
    </section>
  )
}

export default page
