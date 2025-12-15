import Image from 'next/image'

const NewsletterSection = () => {
  return (
    <div>
      <div className="px-18">
        <div className="bg-section text-color-title-on-dark flex h-[444px] w-full flex-col items-center justify-center rounded-2xl text-center">
          <h1 className="font-aria mb-2 text-2xl text-[50px] font-bold">
            دانشی که سلامتی فردای تو را می‌سازد
          </h1>

          <p className="font-ray text-color-body-on-dark mb-4 max-w-xl text-[16px]">
            با عضویت در خبرنامه ما، به محتوای اختصاصی، راهنمایی‌های علمی و
            قدم‌های ساده‌ای دسترسی پیدا می‌کنید که می‌تواند کیفیت زندگی و انرژی
            روزانه شما را متحول کند. از آخرین تحقیقات پزشکی تا توصیه‌های عملی
            برای تغذیه و سبک زندگی سالم—همه در یک ایمیل کوتاه و کاربردی، مخصوص
            شما.
          </p>

          {/* Newsletter Input Box */}
          <div className="bg-section-deep flex h-[85px] w-[810px] items-center rounded-2xl px-4 text-black">
            <div className="bg-section-deep flex h-[85px] w-[810px] flex-row-reverse items-center rounded-2xl px-3">
              {/* Button (will go to the left automatically) */}
              <button className="bg-accent-purple flex h-[54px] w-[210px] cursor-pointer items-center justify-between rounded-full px-3 text-white">
                {/* Button text */}
                <span className="font-aria pr-8 text-base font-medium text-black">
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

              {/* Text field (will stay on the right) */}
              <input
                type="email"
                placeholder="ایمیل"
                className="font-ray w-full bg-transparent pr-3 text-right text-[26px] placeholder-color-body-on-dark text-color-body-on-dark outline-none"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsletterSection
