import Link from 'next/link'
import Image from 'next/image'

const HealthTestSection = () => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 items-center gap-5 py-12 lg:grid-cols-2">
        {/* RIGHT — Title + Paragraph */}
        <div className="grid h-full grid-rows-[1fr_auto]">
          <div className="flex">
            <h1 className="font-aria text-color-title-on-light py-4 text-4xl font-bold sm:text-5xl xl:text-6xl">
              سرمایه‌گذاری روی بدن، سرمایه‌گذاری روی آینده
            </h1>
          </div>

          <div>
            <p className="font-ray text-color-body-on-light mb-4 text-xs font-medium sm:text-base xl:text-lg">
              بدن شما شایستهٔ زندگی‌ای پرانرژی و بدون محدودیت است. محصولات
              ارگانیک ما، ابزار شما برای ساختن فردایی سالم و طولانی است. همین
              حالا قدم اول را بردار و سرمایه‌گذاری روی سلامتت را آغاز کن.
            </p>

            <Link
              href="/auth"
              className="primary-btn flex items-center justify-between rounded-full bg-black text-white"
            >
              <span className="font-ray pr-2 font-medium">مشاهده محصولات</span>

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
          </div>
        </div>

        {/* LEFT — Card with Image + Circle Icon */}
        <div className="relative flex w-full justify-center rounded-2xl border border-black/25">
          <div className="flex flex-col items-center rounded-2xl bg-white p-3 xl:p-5">
            {/* Image */}
            <Image
              src="/images/health-test-one.png"
              alt="Card Image"
              width={705}
              height={627}
              style={{ borderRadius: '10px' }}
            />

            {/* Circle with Icon */}
            <div className="absolute top-7 right-7 flex h-11 w-11 items-center justify-center rounded-full bg-white p-2 shadow-lg xl:top-10 xl:right-10 xl:h-12.5 xl:w-12.5">
              <Image
                src="/images/trust.svg"
                alt="Icon"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-5 py-12 lg:grid-cols-2">
        {/* LEFT — Card with Image + Circle Icon */}
        <div className="relative flex justify-center rounded-2xl border border-black/25 max-lg:order-1">
          <div className="flex flex-col items-center rounded-2xl bg-white p-3 xl:p-5">
            {/* Image */}
            <Image
              src="/images/health-test-two.png"
              alt="Card Image"
              width={705}
              height={627}
              style={{ borderRadius: '10px' }}
            />

            {/* Circle with Icon */}
            <div className="absolute top-7 right-7 flex h-11 w-11 items-center justify-center rounded-full bg-white p-2 shadow-lg xl:top-10 xl:right-10 xl:h-12.5 xl:w-12.5">
              <Image src="/images/AI.svg" alt="Icon" width={32} height={32} />
            </div>
          </div>
        </div>

        {/* RIGHT — Title + Paragraph */}
        <div className="grid h-full grid-rows-[1fr_auto]">
          <div className="flex">
            <h1 className="font-aria text-color-title-on-light py-4 text-4xl font-bold sm:text-5xl xl:text-6xl">
              یک تست هوشمند، برای آینده‌ای بدون محدودیت
            </h1>
          </div>

          <div>
            <p className="font-ray text-color-body-on-light mb-4 text-xs font-medium sm:text-base xl:text-lg">
              با یک تست هوش مصنوعی ساده، برنامه غذایی و مسیر سلامتی شخصی خود را
              دریافت کن. ارزش واقعی این ابزار، در سرمایه‌گذاری امروز شما روی
              انرژی، شفافیت ذهنی و طول عمر فرداست — و کاملاً رایگان هست.
            </p>

            <Link
              href="/ai"
              className="primary-btn flex items-center justify-between rounded-full bg-black text-white"
            >
              {/* Button text */}
              <span className="font-ray pr-2 font-medium">تست هوش مصنوعی</span>

              {/* Circle with icon */}
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthTestSection
