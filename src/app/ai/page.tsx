import Image from 'next/image'
import Link from 'next/link'

export default function AI() {
  return (
    <div className="container flex min-h-[40vh] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 md:px-8">
      <h1 className="font-aria text-color-title-on-light mt-12 max-w-[280px] text-3xl font-extrabold sm:max-w-md sm:text-4xl md:max-w-lg xl:max-w-120 xl:text-6xl">
        رمز انرژی و تعادل بدنت رو همین حالا پیدا کن
      </h1>
      <p className="font-ray font-regular text-color-body-on-light mt-3 max-w-[280px] text-xs sm:max-w-md sm:text-sm md:max-w-lg xl:max-w-153.25 xl:text-lg">
        ترکیبی از دانش هزارساله علم پزشکی و قدرت هوش مصنوعی. در کمتر از ۳ دقیقه
        یک پروفایل شخصی سلامت دریافت می‌کنی که شامل تیپ بدنی، توصیه‌های غذایی و
        سبک زندگی مخصوص خودت است. راهکارهایی برای افزایش انرژی و بالابردن کیفیت
        زندگی‌ات. چیزی که خیلی‌ها ماه‌ها زمان و صدها هزار تومان خرج می‌کنند تا
        بفهمند، تو همین حالا و کاملاً رایگان به دست می‌آوری.
      </p>

      <div className="mt-6.5 flex w-full max-w-[90%] flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
        <div className="text-color-title-on-light flex flex-1 flex-col items-center justify-center gap-2 sm:w-36 sm:flex-none">
          <Image
            src="/images/diamond.svg"
            alt="Diamond"
            width={49}
            height={49}
            className="h-10 w-10 sm:h-12 sm:w-12 xl:h-[49px] xl:w-[49px]"
          />
          <p className="font-ray text-center text-xs sm:text-sm xl:text-lg">
            ۱۰۰% رایگان
          </p>
        </div>

        <div className="text-color-title-on-light flex flex-1 flex-col items-center justify-center gap-2 sm:w-36 sm:flex-none">
          <h1 className="font-aria flex items-center justify-center text-3xl font-bold sm:text-4xl xl:text-5xl">
            ۵۰۰
          </h1>
          <p className="font-ray text-center text-xs sm:text-sm xl:text-lg">
            تعداد شرکت کنندگان
          </p>
        </div>

        <div className="text-color-title-on-light flex flex-1 flex-col items-center justify-center gap-2 sm:w-36 sm:flex-none">
          <Image
            src="/images/brain.svg"
            alt="brain"
            width={49}
            height={49}
            className="h-10 w-10 sm:h-12 sm:w-12 xl:h-[49px] xl:w-[49px]"
          />
          <p className="font-ray text-center text-xs sm:text-sm xl:text-lg">
            برگرفته از علم پزشکی
          </p>
        </div>
      </div>

      <Link
        href="/ai-test"
        className="mt-6.75 flex h-13.5 w-52.5 cursor-pointer items-center justify-between rounded-full bg-black px-2 text-white"
      >
        <span className="font-aria pr-2 text-base">شروع تحلیل هوشمند</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
          <Image src="/images/arrow.svg" alt="Arrow" width={20} height={20} />
        </div>
      </Link>
      <span className="font-ray text-color-title-on-light mt-2 text-xs font-bold">
        مدت زمان ۳ دقیقه
      </span>
    </div>
  )
}
