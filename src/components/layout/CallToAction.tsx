import Image from 'next/image'

const CallToAction = () => {
  return (
    <div className="container">
      <div className="bg-section text-color-title-on-dark flex h-[327px] w-full flex-col items-center justify-center rounded-2xl text-center">
        <h1 className="font-aria mb-2 text-2xl text-[50px] font-bold">
          سلامتی آینده‌ات را امروز بساز
        </h1>
        <p className="font-ray text-color-body-on-dark mb-4 max-w-xl text-[16px]">
          هیچ‌کس فردا را تضمین نمی‌کند، اما امروز در اختیار توست. عطاری ۲۴ ساعته
          اینجاست تا ساده‌ترین مسیر را برایت هموار کند: از تست هوش مصنوعی که
          برنامه شخصی به تو می‌دهد، تا محصولاتی که کیفیت و اصالتشان تضمین شده
          است. آینده‌ای سالم و شاد، تنها یک تصمیم با تو فاصله دارد.
        </p>

        <div className="flex gap-4">
          <button className="bg-accent-purple flex h-[54px] w-[210px] cursor-pointer items-center justify-between rounded-full px-3 text-white">
            {/* Button text */}
            <span className="font-aria text-base font-medium text-black pr-4">
              شروع سفر سلامتی
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
          <button className="font-ray flex h-[54px] w-[145px] cursor-pointer items-center justify-center rounded-full border border-white px-0 text-base font-medium whitespace-nowrap text-white transition hover:bg-black hover:text-white">
            آشنایی با محصولات
          </button>
        </div>
      </div>
    </div>
  )
}

export default CallToAction
