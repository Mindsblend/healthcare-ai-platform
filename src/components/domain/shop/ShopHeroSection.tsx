import Image from 'next/image'
import Link from 'next/link'

const ShopHeroSection = () => {
  return (
    <div className="container flex h-[40vh] w-full flex-col items-center justify-center text-center md:h-[40vh] lg:min-h-[60vh]">
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-aria text-color-title-on-light max-w-2xl text-4xl font-extrabold sm:text-[40px] xl:text-[64px]">
          انتخاب‌های سالم منتظر شماست
        </h1>
        <p className="font-ray text-color-body-on-light mt-3.75 max-w-80 text-sm font-medium sm:max-w-md md:max-w-lg xl:max-w-xl xl:text-lg">
          هنوز تست هوش مصنوعی را انجام نداده‌ای. با انجام این تست می‌توانی نمره
          سلامت خودت را ببینی، نقاط قوت و ضعف‌هات را بشناسی و محصولاتی که مخصوص
          تو هستند را دریافت کنی. فقط ۵ دقیقه زمان می‌برد و کاملاً رایگان است.
        </p>

        <div className="mt-5 mb-6 flex flex-wrap justify-center gap-4">
          <Link href="/ai">
            <button className="primary-btn flex cursor-pointer items-center justify-between rounded-full bg-black text-white">
              <span className="font-ray pr-2 font-medium">تست هوش مصنوعی</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white xl:h-10 xl:w-10">
                <Image
                  src="/images/arrow.svg"
                  alt="Arrow icon"
                  width={20}
                  height={20}
                  className="max-xl:h-3.75 max-xl:w-3.75"
                />
              </div>
            </button>
          </Link>
          <Link href="/products">
            <button className="secondary-btn flex items-center justify-center rounded-full border border-black font-medium whitespace-nowrap text-black transition hover:bg-black hover:text-white">
              آشنایی با محصولات
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ShopHeroSection
