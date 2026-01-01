import Image from 'next/image'

const ShopHeroSection = () => {
  return (
    <div className="flex items-center justify-between w-full container">
      {/* Right: Text + Buttons */}
      <div className="mt-12 flex flex-col justify-center">
        <h1 className="font-aria text-color-title-on-light max-w-[473px] text-[64px] leading-21 font-extrabold">
          سلامتی امروز، پلی به فردایی شادتر
        </h1>
        <p className="font-ray text-color-body-on-light max-w-[463px] text-[18px] leading-5 font-medium">
          به دنیای محصولات طبیعی و ارگانیک خوش آمدید. اینجا می‌توانید متناسب با
          نیازهای خود، بهترین انتخاب‌ها را داشته باشید و با اطمینان بیشتری از
          سلامت و کیفیت زندگی‌تان مراقبت کنید.
        </p>

        <div className="mt-5 mb-6 flex gap-4">
          <button className="flex h-[54px] w-[210px] cursor-pointer items-center justify-between rounded-full bg-black px-2 text-white">
            {/* Button text */}
            <span className="font-aria pr-2.5 text-base font-medium">
              تست هوش مصنوعی
            </span>

            {/* Circle with icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <Image
                src="/images/arrow.svg"
                alt="Top Right Image"
                width={20}
                height={20}
              />
            </div>
          </button>
          <button className="font-ray flex h-[54px] w-[145px] cursor-pointer items-center justify-center rounded-full border border-black px-0 text-base font-medium whitespace-nowrap text-black transition hover:bg-black hover:text-white">
            آشنایی با محصولات
          </button>
        </div>
      </div>
      {/* Left: Image */}
      <div className="">
        <Image
          src="/images/basket.svg"
          alt="Healthy Lifestyle"
          width={500}
          height={100}
        />
      </div>
    </div>
  )
}

export default ShopHeroSection
