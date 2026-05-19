import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <div className="container flex items-end justify-between">
      {/* Right: Text + Buttons */}
      <div className="flex flex-col justify-end max-lg:items-center max-lg:text-center">
        <h1 className="font-aria text-color-title-on-light max-w-118.25 text-4xl font-extrabold sm:text-5xl xl:text-6xl">
          سلامتی امروز، پلی به فردایی شادتر
        </h1>
        <p className="font-ray text-color-body-on-light mt-3.5 max-w-115.75 text-xs font-medium sm:text-base xl:text-lg">
          سلامتی چیزی نیست که بتوان آن را به فردا موکول کرد. هر تصمیم کوچک
          امروز، یا پلی به سوی تمرکز، انرژی و عمری طولانی‌تر است —یا قدمی خاموش
          به سوی آینده‌ای پر از خستگی و محدودیت. ما اینجا هستیم تا با یک تست
          سادهٔ هوش مصنوعی و انتخاب محصولات سالم، راهی عملی برای تغییر واقعی پیش
          روی شما بگذاریم.
        </p>

        <div className="mt-5 mb-6 flex gap-4">
          <Link
            href="/ai"
            className="primary-btn flex items-center justify-between rounded-full bg-black text-white"
          >
            <span className="font-ray pr-2 font-medium">شروع سفر سلامتی</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white xl:h-10 xl:w-10">
              <Image
                src="/images/arrow.svg"
                alt="Top Right Image"
                width={20}
                height={20}
                className="max-xl:h-3.75 max-xl:w-3.75"
              />
            </div>
          </Link>
          <Link
            href="/auth"
            className="secondary-btn flex items-center justify-center rounded-full border border-black font-medium whitespace-nowrap text-black transition hover:bg-black hover:text-white"
          >
            آشنایی با محصولات
          </Link>
        </div>

        <div className="order-2 my-6 flex w-full flex-col justify-between max-lg:items-center">
          <Image
            src="/images/mini-products.svg"
            alt="Mini Products"
            width={140}
            height={50}
          />
        </div>

        <div className="flex gap-10 xl:gap-22">
          <div>
            <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold sm:text-6xl">
              ۵۰۰۰+
            </h1>
            <p className="font-ray text-medium text-color-title-on-light text-xs sm:text-sm">
              مشتری از سراسر کشور
            </p>
          </div>
          <div>
            <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold sm:text-6xl">
              ۲۰۰+
            </h1>
            <p className="font-ray text-medium text-color-title-on-light text-xs sm:text-sm">
              محصول سالم و ارگانیک
            </p>
          </div>
        </div>
      </div>

      {/* Left: Image - aligned to bottom */}
      <div className="hidden lg:flex lg:items-end">
        <Image
          src="/images/hero.svg"
          alt="Healthy Lifestyle"
          width={660}
          height={100}
          className="h-auto w-full"
          priority
        />
      </div>
    </div>
  )
}

export default HeroSection
