import Image from 'next/image'

export default function AI() {
  return (
    <div className="container flex flex-col items-center justify-center text-center">
      <h1 className="font-aria text-color-title-on-light mt-12 max-w-120 text-3xl font-extrabold sm:text-4xl xl:max-w-175 xl:text-6xl">
        رمز انرژی و تعادل بدنت رو همین حالا پیدا کن
      </h1>
      <p className="font-ray font-regular text-color-body-on-light mt-3 max-w-153.25 text-xs sm:text-sm xl:text-lg">
        ترکیبی از دانش هزارساله علم پزشکی و قدرت هوش مصنوعی. در کمتر از ۳ دقیقه
        یک پروفایل شخصی سلامت دریافت می‌کنی که شامل تیپ بدنی، توصیه‌های غذایی و
        سبک زندگی مخصوص خودت است. راهکارهایی برای افزایش انرژی و بالابردن کیفیت
        زندگی‌ات. چیزی که خیلی‌ها ماه‌ها زمان و صدها هزار تومان خرج می‌کنند تا
        بفهمند، تو همین حالا و کاملاً رایگان به دست می‌آوری.
      </p>

      <div className="mt-6.5 flex flex-row items-center justify-center gap-12">
        <div className="text-color-title-on-light flex flex-col items-center justify-center gap-2">
          <Image
            src="/images/diamond.svg"
            alt="Diamond"
            width={49}
            height={49}
          />
          <p className="font-ray text-center text-sm xl:text-lg">۱۰۰% رایگان</p>
        </div>

        <div className="text-color-title-on-light flex flex-col items-center justify-center gap-2">
          <h1 className="font-aria flex items-center justify-center text-5xl font-bold">
            ۵۰۰
          </h1>
          <p className="font-ray text-center text-sm xl:text-lg">
            تعداد شرکت کنندگان
          </p>
        </div>

        <div className="text-color-title-on-light flex flex-col items-center justify-center gap-2">
          <Image src="/images/brain.svg" alt="brain" width={49} height={49} />
          <p className="font-ray text-center text-sm xl:text-lg">
            برگرفته از علم پزشکی
          </p>
        </div>
      </div>

      <button className="mt-6.75 flex h-[54px] w-[210px] cursor-pointer items-center justify-between rounded-full bg-black px-2 text-white">
        {/* Button text */}
        <span className="font-aria pr-2 text-base font-medium">
          شروع تحلیل هوشمند
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
      <span className="font-ray text-color-title-on-light mt-2 mb-10 text-xs font-bold">
        مدت زمان ۳ دقیقه
      </span>
    </div>
  )
}
