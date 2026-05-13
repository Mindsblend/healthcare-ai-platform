import Image from 'next/image'

const ShopHeroSection = () => {
  return (
    <div className="container flex w-full items-center justify-center lg:justify-between">
      {/* Right: Text + Buttons */}
      <div className="mt-12 flex flex-col justify-center max-lg:items-center max-lg:text-center">
        <h1 className="font-aria text-color-title-on-light max-w-sm text-4xl font-extrabold sm:text-[40px] lg:max-w-118.25 lg:text-[64px]">
          سلامتی امروز، پلی به فردایی شادتر
        </h1>
        <p className="font-ray text-color-body-on-light mt-3.75 max-w-115.75 text-sm font-medium lg:text-lg">
          به دنیای محصولات طبیعی و ارگانیک خوش آمدید. اینجا می‌توانید متناسب با
          نیازهای خود، بهترین انتخاب‌ها را داشته باشید و با اطمینان بیشتری از
          سلامت و کیفیت زندگی‌تان مراقبت کنید.
        </p>

        <div className="mt-5 mb-6 flex gap-4">
          <button className="primary-btn flex cursor-pointer items-center justify-between rounded-full bg-black text-white transition hover:bg-gray-800">
            {/* Button text */}
            <span className="font-ray pr-2 font-medium">تست هوش مصنوعی</span>

            {/* Circle with icon */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white xl:h-10 xl:w-10">
              <Image
                src="/images/arrow.svg"
                alt="Top Right Image"
                width={20}
                height={20}
                className="max-xl:h-3.75 max-xl:w-3.75"
              />
            </div>
          </button>
          <button className="secondary-btn flex items-center justify-center rounded-full border border-black font-medium whitespace-nowrap text-black transition hover:bg-black hover:text-white">
            آشنایی با محصولات
          </button>
        </div>
      </div>
      {/* Left: Image */}
      <div className="hidden lg:block">
        <Image
          src="/images/basket.svg"
          alt="Healthy Lifestyle"
          width={500}
          height={100}
          priority
          fetchPriority="high"
          loading="eager"
        />
      </div>
    </div>
  )
}

export default ShopHeroSection
