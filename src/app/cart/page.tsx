import CartItem from '@/components/domain/cart/CartItem'

const page = () => {
  return (
    <div className="container mt-16">
      <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold">
        سبد خرید شما
      </h1>
      <div className="mt-10 flex items-center justify-between gap-10">
        <div className="h-[452px] w-full max-w-7xl overflow-hidden rounded-3xl border-2 border-[#d9d9d9]">
          <div className="font-aria grid grid-cols-[2fr_1fr_1fr_40px] border-b-2 px-8 py-5 text-xl font-bold">
            <span className="text-color-title-on-light">نام محصول</span>
            <span className="text-color-title-on-light text-center">تعداد</span>
            <span className="text-color-title-on-light">قیمت</span>
            <span className="text-color-title-on-light">حذف</span>
          </div>

          <div>
            <CartItem />
            <CartItem />
            <CartItem />
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
                ۲۲۰ تومان
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-aria text-color-title-on-light font-extrabold">
                هزینه ارسال
              </h1>
              <h1 className="font-aria text-color-title-on-light font-extrabold">
                ۲۲۰ تومان
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-aria text-color-title-on-light font-extrabold">
                مالیات
              </h1>
              <h1 className="font-aria text-color-title-on-light font-extrabold">
                ۲۲۰ تومان
              </h1>
            </div>
            <hr className="border" />
            <div className="flex items-center justify-between">
              <h1 className="font-aria text-color-title-on-light font-extrabold">
                جمع کل
              </h1>
              <h1 className="font-aria text-color-title-on-light font-extrabold">
                ۲۲۰ تومان
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
