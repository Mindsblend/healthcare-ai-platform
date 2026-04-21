import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <div className="container lg:flex lg:items-center lg:justify-between">
      {/* Right: Text + Buttons */}
      <div className="mt-12 flex flex-col justify-center max-lg:items-center max-lg:text-center">
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
            className="flex h-10 w-34 cursor-pointer items-center justify-between rounded-full bg-black px-2 text-white sm:h-13.5 sm:w-48.75 xl:w-52.5"
          >
            {/* Button text */}
            <span className="font-ray pr-2 text-xs font-medium sm:pr-4 sm:text-base">
              شروع سفر سلامتی
            </span>

            {/* Circle with icon */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white sm:h-10 sm:w-10">
              <Image
                src="/images/arrow.svg"
                alt="Top Right Image"
                width={20}
                height={20}
                className="max-sm:h-3.75 max-sm:w-3.75"
              />
            </div>
          </Link>
          <Link
            href="/auth"
            className="font-ray flex h-10 w-26 cursor-pointer items-center justify-center rounded-full border border-black px-0 text-xs font-medium whitespace-nowrap text-black transition hover:bg-black hover:text-white sm:h-13.5 sm:w-36.25 sm:text-base"
          >
            آشنایی با محصولات
          </Link>
        </div>
        <div className="order-2 my-6 flex w-full flex-col justify-between max-lg:items-center">
          {/* Top: Image */}
          <Image
            src="/images/mini-products.svg"
            alt="Top Right Image"
            width={140}
            height={50}
          />

          {/* Bottom: Paragraph */}
          {/* <p className="text-color-body-on-light font-ray max-w-xs text-base font-medium whitespace-nowrap transition">
            هر محصول ما، یک قدم به سوی آینده‌ای سالم‌تر
          </p> */}
        </div>

        <div className="flex gap-10 xl:gap-22">
          <div>
            <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold sm:text-6xl">
              ۵۰۰۰+
            </h1>
            <p className="font-ray text-medium text-color-title-on-light text-xs sm:text-sm">
              مشتری از سراسر کشور{' '}
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
      {/* Left: Image */}
      <div className="hidden lg:block">
        <Image
          src="/images/hero.svg"
          alt="Healthy Lifestyle"
          width={660}
          height={100}
        />
      </div>
    </div>
  )
}

export default HeroSection
