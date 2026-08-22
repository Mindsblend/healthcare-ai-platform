import ScrollStepsTimeline from '@/components/domain/(interface)/ScrollStepsTimeline'
import MobileStepsTimeline from './MobileScriollTimeLine'
import Image from 'next/image'
import Link from 'next/link'

const StepsSection = () => {
  return (
    <div className="text-color-title-on-light bg-section">
      <div className="container flex flex-col sm:flex-row justify-between pt-20">
        <div className="text-center sm:text-right">
          <h1 className="font-aria text-color-title-on-dark max-w-sm text-3xl font-bold xl:max-w-2xl xl:text-5xl">
            راهکار کامل شما برای سلامتی، بدون پیچیدگی و دغدغه
          </h1>
          <p className="font-ray text-color-body-on-dark mt-3.5 max-w-sm text-xs font-medium lg:text-base xl:max-w-xl xl:text-lg">
            ما بیش از یک دهه است که به خانواده‌ها و افراد در ایران کمک می‌کنیم
            تا زندگی سالم‌تر و پرانرژی‌تری داشته باشند. هر محصول ارگانیک ما از
            کشاورزی پایدار و استانداردهای دقیق انتخاب می‌شود، بسته‌بندی می‌شود و
            به دست شما می‌رسد، تا مطمئن باشید کیفیت و اثرگذاری واقعی دریافت
            می‌کنید.
          </p>
          <div className="mt-5 mb-6 flex justify-center gap-4 sm:justify-start">
            <Link
              href="/ai"
              className="primary-btn bg-accent-purple flex items-center justify-between rounded-full text-black"
            >
              {/* Button text */}
              <span className="font-ray pr-2 font-medium">تست هوش مصنوعی</span>

              {/* Circle with icon */}
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black xl:h-10 xl:w-10">
                <Image
                  src="/images/arrow-white.svg"
                  alt="Top Right Image"
                  width={20}
                  height={20}
                  className="max-xl:h-3.75 max-xl:w-3.75"
                />
              </div>
            </Link>
            <Link
              href="/auth"
              className="secondary-btn flex items-center justify-center rounded-full border border-white font-medium whitespace-nowrap text-white transition hover:bg-black hover:text-white"
            >
              آشنایی با محصولات
            </Link>
          </div>
        </div>
        <div className="mx-auto grid grid-cols-2 justify-center gap-x-18 sm:gap-x-10 lg:gap-x-16 max-sm:mt-8 sm:mx-0">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-aria text-color-title-on-dark text-left text-3xl font-black xl:max-w-2xl xl:text-5xl">
                ۹۳%
              </h1>
              <p className="font-ray text-color-body-on-dark text-xs xl:text-lg">
                رضایت مشتریان
              </p>
            </div>
            <Image
              src="/images/happy.svg"
              alt="face icon"
              width={32}
              height={32}
            />
          </div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-aria text-color-title-on-dark text-left text-3xl font-black xl:max-w-2xl xl:text-5xl">
                ۵۰۰۰+
              </h1>
              <p className="font-ray text-color-body-on-dark text-xs xl:text-lg">
                تعداد ارسال ها
              </p>
            </div>
            <Image
              src="/images/cube.svg"
              alt="cube icon"
              width={32}
              height={32}
            />
          </div>
          <div className="flex items-center gap-3 max-lg:mt-6">
            <div>
              <h1 className="font-aria text-color-title-on-dark text-left text-3xl font-black xl:max-w-2xl xl:text-5xl">
                ۱۲
              </h1>
              <p className="font-ray text-color-body-on-dark text-xs xl:text-lg">
                سال ها تجربه
              </p>
            </div>
            <Image
              src="/images/verified.svg"
              alt="verified icon"
              width={32}
              height={32}
            />
          </div>
          <div className="flex items-center gap-3 max-lg:mt-6">
            <div>
              <h1 className="font-aria text-color-title-on-dark text-left text-3xl font-black xl:max-w-2xl xl:text-5xl">
                ۳۰۰۰+
              </h1>
              <p className="font-ray text-color-body-on-dark text-xs xl:text-lg">
                تعداد مشتریان
              </p>
            </div>
            <Image
              src="/images/health.svg"
              alt="health icon"
              width={32}
              height={32}
            />
          </div>
        </div>
      </div>
      <div className="container max-w-[1400px] w-full">
        <div className="hidden sm:block">
          <ScrollStepsTimeline />
        </div>
        <div className="sm:hidden">
          <MobileStepsTimeline />
        </div>
      </div>
    </div>
  )
}

export default StepsSection
