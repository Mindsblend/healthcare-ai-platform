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
          <p className="font-ray text-color-body-on-dark mt-3.5 max-w-[490px] text-base xl:max-w-xl xl:text-xl">
            ما بیش از یک دهه است که به خانواده‌ها و افراد در ایران کمک می‌کنیم
            تا زندگی سالم‌تر و پرانرژی‌تری داشته باشند. هر محصول ارگانیک ما از
            کشاورزی پایدار و استانداردهای دقیق انتخاب می‌شود، بسته‌بندی می‌شود و
            به دست شما می‌رسد، تا مطمئن باشید کیفیت و اثرگذاری واقعی دریافت
            می‌کنید.
          </p>
          <div className="mt-5 mb-6 flex gap-4">
            <Link
              href="/ai"
              className="bg-accent-purple flex h-[54px] w-[195px] cursor-pointer items-center justify-between rounded-full px-2 text-black xl:w-[210px]"
            >
              {/* Button text */}
              <span className="font-ray pr-4 text-base font-medium">
                تست هوش مصنوعی
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
            </Link>
            <Link
              href="/auth"
              className="font-ray flex h-[54px] w-[145px] cursor-pointer items-center justify-center rounded-full border border-white px-0 text-base font-medium whitespace-nowrap text-white transition hover:bg-black hover:text-white"
            >
              آشنایی با محصولات
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-16">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-aria text-color-title-on-dark text-left text-5xl font-black">
                ۹۳%
              </h1>
              <p className="font-ray text-color-body-on-dark text-xl">
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
              <h1 className="font-aria text-color-title-on-dark text-left text-5xl font-black">
                ۵۰۰۰+
              </h1>
              <p className="font-ray text-color-body-on-dark text-xl">
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
              <h1 className="font-aria text-color-title-on-dark text-left text-5xl font-black">
                ۱۲
              </h1>
              <p className="font-ray text-color-body-on-dark text-xl">
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
              <h1 className="font-aria text-color-title-on-dark text-left text-5xl font-black">
                ۳۰۰۰+
              </h1>
              <p className="font-ray text-color-body-on-dark text-xl">
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
