import Image from 'next/image'

const HealthTestSection = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-center p-12 gap-9">
        {/* RIGHT — Title + Paragraph */}
        <div className="flex flex-col h-[745px] items-center justify-between max-w-xl">
          <h1 className="font-aria text-6xl font-bold text-color-title-on-light py-4">
            سرمایه‌گذاری روی بدن، سرمایه‌گذاری روی آینده
          </h1>

          <div>
            <p className="font-ray text-lg text-color-body-on-light mb-4">
              بدن شما شایستهٔ زندگی‌ای پرانرژی و بدون محدودیت است. محصولات ارگانیک ما، ابزار شما
              برای ساختن فردایی سالم و طولانی است. همین حالا قدم اول را بردار و سرمایه‌گذاری روی
              سلامتت را آغاز کن.
            </p>

            <button className="bg-black text-white rounded-full flex items-center justify-between h-[54px] min-w-[187px] px-2">
              <span className="font-ray font-medium text-base text-white whitespace-nowrap mr-2">
                مشاهده محصولات
              </span>

              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/images/arrow.svg"
                  alt="Arrow"
                  width={20}
                  height={20}
                  className="rotate-45"
                />
              </div>
            </button>
          </div>
        </div>

        {/* LEFT — Card with Image + Circle Icon */}
        <div className="flex justify-center relative border border-black/25 rounded-2xl">
          <div className="bg-white rounded-2xl p-5 w-[665px] h-[745px] flex flex-col items-center">
            {/* Image */}
            <Image
              src="/images/health-test-one.png"
              alt="Card Image"
              width={705}
              height={627}
              style={{ borderRadius: '10px' }}
            />

            {/* Circle with Icon */}
            <div className="absolute top-10 right-10 w-[70px] h-[70px] bg-white rounded-full shadow-lg flex items-center justify-center">
              <Image src="/image/trust.svg" alt="Icon" width={20} height={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center justify-center p-12 gap-9">
        {/* RIGHT — Title + Paragraph */}
        <div className="flex flex-col h-[745px] items-center justify-between max-w-xl">
          <h1 className="font-aria text-6xl font-bold text-color-title-on-light py-4">
            یک تست هوشمند، برای آینده‌ای بدون محدودیت
          </h1>

          <div>
            <p className="font-ray text-lg text-color-body-on-light mb-4">
              با یک تست هوش مصنوعی ساده، برنامه غذایی و مسیر سلامتی شخصی خود را دریافت کن. ارزش
              واقعی این ابزار، در سرمایه‌گذاری امروز شما روی انرژی، شفافیت ذهنی و طول عمر فرداست — و
              کاملاً رایگان هست.
            </p>

            <button className="bg-black text-white rounded-full flex items-center justify-between h-[54px] min-w-[187px] px-2">
              <span className="font-ray font-medium text-base text-white whitespace-nowrap mr-2">
                مشاهده محصولات
              </span>

              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/images/arrow.svg"
                  alt="Arrow"
                  width={20}
                  height={20}
                  className="rotate-45"
                />
              </div>
            </button>
          </div>
        </div>

        {/* LEFT — Card with Image + Circle Icon */}
        <div className="flex justify-center relative border border-black/25 rounded-2xl">
          <div className="bg-white rounded-2xl p-5 w-[665px] h-[745px] flex flex-col items-center">
            {/* Image */}
            <Image
              src="/images/health-test-two.png"
              alt="Card Image"
              width={705}
              height={627}
              style={{ borderRadius: '10px' }}
            />

            {/* Circle with Icon */}
            <div className="absolute top-10 right-10 w-h-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <Image src="/public/images/AI.svg" alt="Icon" width={20} height={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthTestSection
