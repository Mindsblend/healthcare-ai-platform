import Image from 'next/image'

const page = () => {
  return (
    <div className="mx-auto mt-16 max-w-[1770px] px-4 sm:px-6 lg:px-8">
      <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold">
        سبد خرید شما
      </h1>
      <div className="mt-10 flex items-center justify-between gap-10">
        <div className="w-full max-w-7xl h-[452px] overflow-hidden rounded-3xl border-2 border-[#d9d9d9]">
          <div className="font-aria grid grid-cols-[2fr_1fr_1fr_40px] border-b-2 px-8 py-5 text-xl font-bold">
            <span className="text-color-title-on-light">نام محصول</span>
            <span className="text-color-title-on-light text-center">تعداد</span>
            <span className="text-color-title-on-light">قیمت</span>
            <span className="text-color-title-on-light">حذف</span>
          </div>

          <div className="grid grid-cols-[2fr_1fr_1fr_40px] items-center border-b px-8 py-3 last:border-b-0">
            <div className="flex">
              <Image
                src="/images/product-five.svg"
                alt="product image"
                width={95}
                height={95}
                className="rounded-3xl"
              />
              <div className="mr-6">
                <h1 className="font-aria text-color-title-on-light text-2xl font-extrabold">
                  عرق خونساز
                </h1>
                <p className="font-ray text-color-body-on-light mt-1.5 max-w-40 text-sm font-medium">
                  جلوگیری از خشکی پوست با تامین آب و رطوبت لازم
                </p>
              </div>
            </div>
            <div className="flex h-10 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[#f2f2f2]">
              <button className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-100 active:scale-95">
                −
              </button>

              <span className="text-color-title-on-light font-aria text-center font-extrabold">
                2
              </span>

              <button className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-100 active:scale-95">
                +
              </button>
            </div>
            <div>
              <h1 className="font-aria text-color-title-on-light text-base font-extrabold">
                ۲۲۰ تومان
              </h1>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/images/delete.svg"
                alt="delete icon"
                width={24}
                height={24}
              />
            </div>
          </div>
        </div>

        <div className="flex h-[452px] w-[367px] flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-9">
          <h1 className="font-aria text-center mt-9 text-color-title-on-light text-2xl font-extrabold">
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
          <div className='pb-6'>
            <button className='w-full bg-black text-color-title-on-dark h-[54px] rounded-4xl font-ray font-medium'>تکمیل سفارش</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
