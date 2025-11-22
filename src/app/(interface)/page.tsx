import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left: Image */}
        <div className="md:w-1/2 flex justify-start items-center pl-8">
          <Image
            src="/images/hero.svg"
            alt="Healthy Lifestyle"
            width={660}
            height={100}
          />
        </div>

        {/* Right: Text + Buttons */}
        <div className="md:w-1/2 flex flex-col justify-center items-end text-right mt-12 pr-26">
          <h1 className="font-aria font-extrabold text-[64px] text-black leading-[85px] max-w-[473px]">
            سلامتی امروز، پلی به فردایی شادتر
          </h1>
          <p className="font-ray font-medium text-[18px] leading-[24px] text-black max-w-[463px]">
            سلامتی چیزی نیست که بتوان آن را به فردا موکول کرد. هر تصمیم کوچک امروز، یا پلی به سوی تمرکز، انرژی و عمری طولانی‌تر است —یا قدمی خاموش به سوی آینده‌ای پر از خستگی و محدودیت. ما اینجا هستیم تا با یک تست سادهٔ هوش مصنوعی و انتخاب محصولات سالم، راهی عملی برای تغییر واقعی پیش روی شما بگذاریم.
          </p>

          <div className="flex justify-end gap-4 mt-5 mb-6">
            <button className="flex items-center justify-center w-[145px] h-[54px] border border-black rounded-full text-black font-ray font-medium text-[16px] hover:bg-black hover:text-white transition whitespace-nowrap px-0">
              آشنایی با محصولات
            </button>
            <button className="w-[210px] h-[54px] bg-black text-white rounded-full flex items-center px-4 gap-4">
              {/* Circle with icon */}
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/images/arrow.svg"
                  alt="Top Right Image"
                  width={20}
                  height={20}
                />
              </div>

              {/* Button text */}
              <span className="font-aria font-medium text-[16px]">شروع سفر سلامتی</span>
            </button>
          </div>
          <div className="w-full flex flex-col justify-between items-end mb-6">
            {/* Top: Image */}
            <Image
              src="/images/mini-products.svg"
              alt="Top Right Image"
              width={140}
              height={50}
            />

            {/* Bottom: Paragraph */}
            <p className="text-black font-ray font-medium text-[16px] text-right max-w-xs transition whitespace-nowrap">
              هر محصول ما، یک قدم به سوی آینده‌ای سالم‌تر
            </p>
          </div>

          <div className='flex justify-end gap-22'>
            <div>
              <h1 className='font-aria font-extrabold text-[64px] text-black leading-[50px]'>+۲۰۰</h1>
              <p className='font-ray text-medium text-[14px] text-black'>محصول سالم و ارگانیک</p>
            </div>
            <div>
              <h1 className='font-aria font-extrabold text-[64px] text-black leading-[50px]'>+۵۰۰۰</h1>
              <p className='font-ray text-medium text-[14px] text-black'>مشتری از سراسر کشور </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
