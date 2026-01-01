import Image from 'next/image'

const NewsletterSection = () => {
  return (
    <div className="container py-12">
      <div className="bg-section p-14 text-color-title-on-dark flex h-[444px] w-full flex-col items-center justify-center rounded-2xl text-center">
        <h1 className="font-aria mb-2 text-5xl font-bold">
          دانشی که سلامتی فردای تو را می‌سازد
        </h1>

        <p className="font-ray text-color-body-on-dark mt-5 max-w-xl text-base">
          با عضویت در خبرنامه ما، به محتوای اختصاصی، راهنمایی‌های علمی و قدم‌های
          ساده‌ای دسترسی پیدا می‌کنید که می‌تواند کیفیت زندگی و انرژی روزانه شما
          را متحول کند. از آخرین تحقیقات پزشکی تا توصیه‌های عملی برای تغذیه و
          سبک زندگی سالم—همه در یک ایمیل کوتاه و کاربردی، مخصوص شما.
        </p>

        {/* Newsletter Input Box */}
        <div className="bg-section-deep mt-9 flex w-full max-w-3xl items-center rounded-2xl text-black md:h-[85px]">
          <div className="bg-section-deep flex w-full flex-row-reverse items-center px-4 py-3 rounded-2xl xl:py-0">
            {/* Button */}
            <button className="bg-accent-purple  flex h-[50px] xl:h-[54px] w-[170px] xl:w-[210px] cursor-pointer items-center justify-between rounded-full px-2 text-white">
              {/* Button text */}
              <span className="font-aria pr-3 xl:pr-8 text-base font-semibold text-black">
                عضویت
              </span>

              {/* Circle with icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <Image
                  src="/images/arrow-white.svg"
                  alt="Top Right Image"
                  width={20}
                  height={20}
                />
              </div>
            </button>

            {/* Input */}
            <input
              type="email"
              placeholder="ایمیل"
              dir="rtl"
              className="font-ray placeholder-color-body-on-dark text-color-body-on-dark w-full bg-transparent pr-3 text-right outline-none text-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsletterSection
