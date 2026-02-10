import Image from 'next/image'

const Bundle = () => {
  return (
    <div className="w-full rounded-3xl border border-black/25 p-5">
      <div className="flex items-center justify-between">
        <Image
          src="/images/product-five.svg"
          width={335}
          height={347}
          alt="product image"
        />
        <Image
          src="/images/product-five.svg"
          width={335}
          height={347}
          alt="product image"
        />
        <Image
          src="/images/product-five.svg"
          width={335}
          height={347}
          alt="product image"
        />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div>
          <h1 className="font-aria text-color-title-on-light text-2xl font-bold">
            کیت روتین ضروری
          </h1>
          <p className="font-ray text-color-title-on-light mt-2 max-w-xl text-sm font-medium">
            اگر همیشه نمی‌دانید از کجا باید شروع کنید، این کیت ساده‌ترین مسیر را
            جلوی پای شما می‌گذارد. ترکیب ضروری‌ترین محصولات روزانه که هم انتخاب
            را آسان می‌کند و هم روتین را قابل‌دوام نگه می‌دارد.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2.5">
          <h1 className="font-aria text-color-title-on-light mt-1 text-center text-base font-extrabold line-through">
            543,000 تومان
          </h1>
          <div className="text-color-title-on-dark font-ray flex h-10 w-full items-center justify-center rounded-3xl bg-black px-5 text-sm font-extrabold sm:w-auto 2xl:h-12 2xl:px-7 2xl:text-base">
            ۸۶٬۰۰۰
            <span className="pr-1">تومان</span>
          </div>
          <button className="text-color-title-on-light font-ray flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#F2F2F2] pr-4 pl-1 text-sm font-medium whitespace-nowrap sm:w-auto 2xl:h-12 2xl:pr-5 2xl:text-base">
            مشاهده جزئیات پک
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white xl:h-10 xl:w-10">
              <Image
                src="/images/arrow.svg"
                alt="arrow"
                width={19}
                height={19}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Bundle
