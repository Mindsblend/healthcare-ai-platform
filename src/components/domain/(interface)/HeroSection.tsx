import Image from 'next/image'

const HeroSection = () => {
  return (
    <div className="flex items-center justify-between px-24">
      {/* Right: Text + Buttons */}
      <div className="mt-12 flex flex-col justify-center">
        <h1 className="font-aria text-color-title-on-light max-w-[473px] text-[64px] leading-21 font-extrabold">
          سلامتی امروز، پلی به فردایی شادتر
        </h1>
        <p className="font-ray text-color-body-on-light max-w-[463px] text-[18px] leading-5 font-medium">
          سلامتی چیزی نیست که بتوان آن را به فردا موکول کرد. هر تصمیم کوچک
          امروز، یا پلی به سوی تمرکز، انرژی و عمری طولانی‌تر است —یا قدمی خاموش
          به سوی آینده‌ای پر از خستگی و محدودیت. ما اینجا هستیم تا با یک تست
          سادهٔ هوش مصنوعی و انتخاب محصولات سالم، راهی عملی برای تغییر واقعی پیش
          روی شما بگذاریم.
        </p>

        <div className="mt-5 mb-6 flex gap-4">
          <button className="flex h-[54px] w-[210px] cursor-pointer items-center justify-between rounded-full bg-black px-3 text-white">
            {/* Button text */}
            <span className="font-aria text-base font-medium">
              شروع سفر سلامتی
            </span>

            {/* Circle with icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <Image
                src="/images/arrow.svg"
                alt="Top Right Image"
                width={20}
                height={20}
              />
            </div>
          </button>
          <button className="font-ray flex h-[54px] w-[145px] cursor-pointer items-center justify-center rounded-full border border-black px-0 text-base font-medium whitespace-nowrap text-black transition hover:bg-black hover:text-white">
            آشنایی با محصولات
          </button>
        </div>
        <div className="mb-6 flex w-full flex-col justify-between">
          {/* Top: Image */}
          <Image
            src="/images/mini-products.svg"
            alt="Top Right Image"
            width={140}
            height={50}
          />

          {/* Bottom: Paragraph */}
          <p className="text-color-body-on-light font-ray max-w-xs text-base font-medium whitespace-nowrap transition">
            هر محصول ما، یک قدم به سوی آینده‌ای سالم‌تر
          </p>
        </div>

        <div className="flex gap-22">
          <div>
            <h1 className="font-aria text-color-title-on-light text-[64px] leading-12 font-extrabold">
              ۵۰۰۰+
            </h1>
            <p className="font-ray text-medium text-color-title-on-light text-[14px]">
              مشتری از سراسر کشور{' '}
            </p>
          </div>
          <div>
            <h1 className="font-aria text-color-title-on-light text-[64px] leading-12 font-extrabold">
              ۲۰۰+
            </h1>
            <p className="font-ray text-medium text-color-title-on-light text-[14px]">
              محصول سالم و ارگانیک
            </p>
          </div>
        </div>
      </div>
      {/* Left: Image */}
      <div className="">
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
