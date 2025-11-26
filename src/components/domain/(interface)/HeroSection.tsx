import Image from 'next/image'

const HeroSection = () => {
  return (
    <div className="px-24 flex justify-between items-center">
      {/* Right: Text + Buttons */}
      <div className="flex flex-col justify-center mt-12">
        <h1 className="font-aria font-extrabold text-[64px] text-black leading-[85px] max-w-[473px]">
          سلامتی امروز، پلی به فردایی شادتر
        </h1>
        <p className="font-ray font-medium text-[18px] leading-[24px] text-black max-w-[463px]">
          سلامتی چیزی نیست که بتوان آن را به فردا موکول کرد. هر تصمیم کوچک امروز، یا پلی به سوی
          تمرکز، انرژی و عمری طولانی‌تر است —یا قدمی خاموش به سوی آینده‌ای پر از خستگی و محدودیت. ما
          اینجا هستیم تا با یک تست سادهٔ هوش مصنوعی و انتخاب محصولات سالم، راهی عملی برای تغییر
          واقعی پیش روی شما بگذاریم.
        </p>

        <div className="flex gap-4 mt-5 mb-6">
          <button className="w-[210px] h-[54px] bg-black text-white rounded-full cursor-pointer flex items-center px-3 justify-between">
            {/* Button text */}
            <span className="font-aria font-medium text-base">شروع سفر سلامتی</span>

            {/* Circle with icon */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Image src="/images/arrow.svg" alt="Top Right Image" width={20} height={20} />
            </div>
          </button>
          <button className="flex items-center cursor-pointer justify-center w-[145px] h-[54px] border border-black rounded-full text-black font-ray font-medium text-base hover:bg-black hover:text-white transition whitespace-nowrap px-0">
            آشنایی با محصولات
          </button>
        </div>
        <div className="w-full flex flex-col justify-between mb-6">
          {/* Top: Image */}
          <Image src="/images/mini-products.svg" alt="Top Right Image" width={140} height={50} />

          {/* Bottom: Paragraph */}
          <p className="text-black font-ray font-medium text-base max-w-xs transition whitespace-nowrap">
            هر محصول ما، یک قدم به سوی آینده‌ای سالم‌تر
          </p>
        </div>

        <div className="flex gap-22">
          <div>
            <h1 className="font-aria font-extrabold text-[64px] text-black leading-[50px]">
              ۵۰۰۰+
            </h1>
            <p className="font-ray text-medium text-[14px] text-black">مشتری از سراسر کشور </p>
          </div>
          <div>
            <h1 className="font-aria font-extrabold text-[64px] text-black leading-[50px]">۲۰۰+</h1>
            <p className="font-ray text-medium text-[14px] text-black">محصول سالم و ارگانیک</p>
          </div>
        </div>
      </div>
      {/* Left: Image */}
      <div className="">
        <Image src="/images/hero.svg" alt="Healthy Lifestyle" width={660} height={100} />
      </div>
    </div>
  )
}

export default HeroSection
