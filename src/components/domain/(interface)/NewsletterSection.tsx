import Image from 'next/image'

const NewsletterSection = () => {
  return (
    <div className="container py-12">
      <div className="bg-section text-color-title-on-dark flex w-full flex-col items-center justify-center rounded-2xl px-14 py-10 text-center lg:p-14">
        <h1 className="font-aria mb-2 text-3xl font-bold sm:text-4xl xl:text-5xl">
          دانشی که سلامتی فردای تو را می‌سازد
        </h1>

        <p className="font-ray text-color-body-on-dark mt-5 max-w-2xl text-xs sm:text-base xl:text-lg">
          با عضویت در خبرنامه ما، به محتوای اختصاصی، راهنمایی‌های علمی و قدم‌های
          ساده‌ای دسترسی پیدا می‌کنید که می‌تواند کیفیت زندگی و انرژی روزانه شما
          را متحول کند. از آخرین تحقیقات پزشکی تا توصیه‌های عملی برای تغذیه و
          سبک زندگی سالم—همه در یک ایمیل کوتاه و کاربردی، مخصوص شما.
        </p>

        {/* Newsletter Input Box */}
        <div className="bg-section-deep mt-9 flex w-full max-w-3xl items-center rounded-2xl text-black md:h-[85px]">
          <div className="bg-section-deep flex w-full flex-row-reverse items-center rounded-2xl px-4 py-3 xl:py-0">
            {/* Button */}
            <button className="bg-accent-purple flex h-[50px] w-[170px] cursor-pointer items-center justify-between rounded-full px-2 text-white xl:h-[54px] xl:w-[210px]">
              {/* Button text */}
              <span className="font-aria pr-3 text-base font-semibold text-black xl:pr-8">
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
              className="font-ray placeholder-color-body-on-dark text-color-body-on-dark w-full bg-transparent pr-3 text-right text-2xl outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsletterSection
