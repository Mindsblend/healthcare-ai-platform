import Image from 'next/image'
import Link from 'next/link'

const CallToAction = () => {
  return (
    <div className="container py-12">
      <div className="bg-section text-color-title-on-dark flex w-full flex-col items-center justify-center rounded-2xl px-8 py-9 text-center sm:py-12">
        <h1 className="font-aria mb-3 text-3xl font-bold sm:text-[50px]">
          سلامتی آینده‌ات را امروز بساز
        </h1>
        <p className="font-ray text-color-body-on-dark mb-5 max-w-xl text-xs sm:text-base">
          هیچ‌کس فردا را تضمین نمی‌کند، اما امروز در اختیار توست. زیستیار
          اینجاست تا ساده‌ترین مسیر را برایت هموار کند: از تست هوش مصنوعی که
          برنامه شخصی به تو می‌دهد، تا محصولاتی که کیفیت و اصالتشان تضمین شده
          است. آینده‌ای سالم و شاد، تنها یک تصمیم با تو فاصله دارد.
        </p>

        <div className="flex items-center justify-center gap-2">
          <Link
            href="/ai"
            className="primary-btn bg-accent-purple flex items-center justify-between rounded-full text-white"
          >
            {/* Button text */}
            <span className="font-ray pr-2 font-medium text-black">
              شروع سفر سلامتی
            </span>

            {/* Circle with icon */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black xl:h-10 xl:w-10">
              <Image
                src="/images/arrow-white.svg"
                alt="Top Right Image"
                width={20}
                height={20}
                className=''
              />
            </div>
          </Link>
          <Link
            href="/products"
            className="secondary-btn flex items-center justify-center rounded-full border border-white font-medium whitespace-nowrap text-white transition hover:bg-black hover:text-white"
          >
            آشنایی با محصولات
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CallToAction
