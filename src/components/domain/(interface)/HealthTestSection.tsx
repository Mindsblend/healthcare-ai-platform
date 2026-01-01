import Link from 'next/link'
import Image from 'next/image'

const HealthTestSection = () => {
  return (
    <div className='container'>
      <div className="flex flex-col items-center py-12 justify-center gap-9 xl:flex-row">
        {/* RIGHT — Title + Paragraph */}
        <div className="flex h-[745px] max-w-xl flex-col items-center justify-between">
          <h1 className="font-aria text-color-title-on-light py-4 text-5xl xl:text-6xl font-bold">
            سرمایه‌گذاری روی بدن، سرمایه‌گذاری روی آینده
          </h1>

          <div>
            <p className="font-ray text-color-body-on-light mb-4 text-lg">
              بدن شما شایستهٔ زندگی‌ای پرانرژی و بدون محدودیت است. محصولات
              ارگانیک ما، ابزار شما برای ساختن فردایی سالم و طولانی است. همین
              حالا قدم اول را بردار و سرمایه‌گذاری روی سلامتت را آغاز کن.
            </p>

            <Link
              href="/auth"
              className="flex h-[54px] w-[210px] cursor-pointer items-center justify-between rounded-full bg-black px-3 text-white"
            >
              {/* Button text */}
              <span className="font-aria pr-4 text-base font-medium">
                مشاهده محصولات
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
            </Link>
          </div>
        </div>

        {/* LEFT — Card with Image + Circle Icon */}
        <div className="relative flex justify-center rounded-2xl border border-black/25">
          <div className="flex h-[745px] w-[665px] flex-col items-center rounded-2xl bg-white p-5">
            {/* Image */}
            <Image
              src="/images/health-test-one.png"
              alt="Card Image"
              width={705}
              height={627}
              style={{ borderRadius: '10px' }}
            />

            {/* Circle with Icon */}
            <div className="absolute top-10 right-10 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white shadow-lg">
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

      <div className="flex flex-col items-center justify-center gap-9 -12 md:flex-row-reverse">
        {/* RIGHT — Title + Paragraph */}
        <div className="flex h-[745px] max-w-xl flex-col items-center justify-between">
          <h1 className="font-aria text-color-title-on-light py-4 text-6xl font-bold">
            یک تست هوشمند، برای آینده‌ای بدون محدودیت
          </h1>

          <div>
            <p className="font-ray text-color-body-on-light mb-4 text-lg">
              با یک تست هوش مصنوعی ساده، برنامه غذایی و مسیر سلامتی شخصی خود را
              دریافت کن. ارزش واقعی این ابزار، در سرمایه‌گذاری امروز شما روی
              انرژی، شفافیت ذهنی و طول عمر فرداست — و کاملاً رایگان هست.
            </p>

            <Link
              href="/ai"
              className="flex h-[54px] w-[210px] cursor-pointer items-center justify-between rounded-full bg-black px-3 text-white"
            >
              {/* Button text */}
              <span className="font-aria pr-4 text-base font-medium">
                تست هوش مصنوعی
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
            </Link>
          </div>
        </div>

        {/* LEFT — Card with Image + Circle Icon */}
        <div className="relative flex justify-center rounded-2xl border border-black/25">
          <div className="flex h-[745px] w-[665px] flex-col items-center rounded-2xl bg-white p-5">
            {/* Image */}
            <Image
              src="/images/health-test-two.png"
              alt="Card Image"
              width={705}
              height={627}
              style={{ borderRadius: '10px' }}
            />

            {/* Circle with Icon */}
            <div className="absolute top-10 right-10 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white shadow-lg">
              <Image src="/images/AI.svg" alt="Icon" width={32} height={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthTestSection
