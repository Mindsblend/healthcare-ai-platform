import ScrollStepsTimeline from '@/components/domain/(interface)/ScrollStepsTimeline'
import Image from 'next/image'
import Link from 'next/link'

const StepsSection = () => {
  return (
    <div className="text-color-title-on-light bg-section">
      <div className="container flex flex-wrap justify-between pt-20">
        <div>
          <h1 className="font-aria text-color-title-on-dark max-w-lg text-4xl font-bold xl:max-w-2xl xl:text-5xl">
            راهکار کامل شما برای سلامتی، بدون پیچیدگی و دغدغه
          </h1>
          <p className="font-ray text-color-body-on-dark mt-3.5 max-w-122.5 text-xs font-medium sm:text-base xl:max-w-xl xl:text-lg">
            ما بیش از یک دهه است که به خانواده‌ها و افراد در ایران کمک می‌کنیم
            تا زندگی سالم‌تر و پرانرژی‌تری داشته باشند. هر محصول ارگانیک ما از
            کشاورزی پایدار و استانداردهای دقیق انتخاب می‌شود، بسته‌بندی می‌شود و
            به دست شما می‌رسد، تا مطمئن باشید کیفیت و اثرگذاری واقعی دریافت
            می‌کنید.
          </p>
          <div className="mt-5 mb-6 flex gap-4">
            <Link
              href="/ai"
              className="flex h-10 w-38 cursor-pointer items-center justify-between rounded-full bg-accent-purple px-2 text-black sm:h-13.5 sm:w-48.75 xl:w-52.5"
            >
              {/* Button text */}
              <span className="font-ray pr-2 text-xs font-medium sm:pr-4 sm:text-base">
                تست هوش مصنوعی
              </span>

              {/* Circle with icon */}
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black sm:h-10 sm:w-10">
                <Image
                  src="/images/arrow-white.svg"
                  alt="Top Right Image"
                  width={20}
                  height={20}
                  className="max-sm:h-3.75 max-sm:w-3.75"
                />
              </div>
            </Link>
            <Link
              href="/auth"
              className="font-ray flex h-10 w-26 cursor-pointer items-center justify-center rounded-full border border-white px-0 text-xs font-medium whitespace-nowrap text-white transition hover:bg-black hover:text-white sm:h-13.5 sm:w-36.25 sm:text-base"
            >
              آشنایی با محصولات
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-16">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-aria text-color-title-on-dark text-left font-black text-4xl xl:max-w-2xl xl:text-5xl">
                ۹۳%
              </h1>
              <p className="font-ray text-color-body-on-dark text-base xl:text-lg">
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
              <h1 className="font-aria text-color-title-on-dark text-left font-black text-4xl xl:max-w-2xl xl:text-5xl">
                ۵۰۰۰+
              </h1>
              <p className="font-ray text-color-body-on-dark text-base xl:text-lg">
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
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-aria text-color-title-on-dark text-left font-black text-4xl xl:max-w-2xl xl:text-5xl">
                ۱۲
              </h1>
              <p className="font-ray text-color-body-on-dark text-base xl:text-lg">
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
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-aria text-color-title-on-dark text-left font-black text-4xl xl:max-w-2xl xl:text-5xl">
                ۳۰۰۰+
              </h1>
              <p className="font-ray text-color-body-on-dark text-base xl:text-lg">
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
      <div className="container w-full">
        <ScrollStepsTimeline />
      </div>
    </div>
  )
}

export default StepsSection
