import Image from 'next/image'

const ServicesSection = () => {
  return (
    <div className="mt-28">
      <div className="flex flex-col items-center text-center justify-center">
        <h1 className="text-color-title text-5xl max-w-lg font-aria font-extrabold">
          راهکاری کامل برای سلامتی و تجربه خرید مطمئن
        </h1>
        <p className="font-ray text-xl mt-7 text-color-title max-w-lg">
          با ما، سلامتی و تجربه خرید شما به بالاترین استانداردها می‌رسد. هر محصول ارگانیک ما با دقت
          انتخاب و بسته‌بندی می‌شود تا کیفیت و تازگی آن حفظ شود.
        </p>
      </div>
      <div className="grid grid-cols-1 mt-14 sm:grid-cols-2 lg:grid-cols-4 flex-wrap">
        <div className="flex flex-col w-[350px] pb-16 pt-6 px-8 h-[337px] justify-between">
          <Image src="/images/support.png" alt="support" width={70} height={70} />
          <div className="text-color-title">
            <h1 className="font-ray font-extrabold text-xl">پشتیبانی همیشه در دسترس</h1>
            <p className="text-lg mt-1.5 font-ray max-w-3xs">
              از انتخاب محصول تا بعد از خرید، تیم ما آماده پاسخگویی و راهنمایی شماست.
            </p>
          </div>
        </div>
        <div className="flex flex-col w-[350px] pb-16 pt-6 px-8 h-[337px] justify-between">
          <Image src="/images/package.png" alt="package" width={70} height={70} />
          <div className="text-color-title">
            <h1 className="font-ray font-extrabold text-xl">بسته‌بندی استاندارد</h1>
            <p className="text-lg mt-1.5 font-ray max-w-3xs">
              هر محصول با دقت و در بسته‌بندی امن و مناسب ارسال می‌شود تا کیفیت حفظ شود.
            </p>
          </div>
        </div>
        <div className="flex flex-col w-[350px] pb-16 pt-6 px-8 h-[337px] justify-between">
          <Image src="/images/credit_card.png" alt="credit_card" width={70} height={70} />
          <div className="text-color-title">
            <h1 className="font-ray font-extrabold text-xl">پرداخت امن و آسان</h1>
            <p className="text-lg mt-1.5 font-ray max-w-3xs">
              با روش‌های متنوع و مطمئن، خریدی بی‌دغدغه و راحت را تجربه کنید.
            </p>
          </div>
        </div>
        <div className="flex flex-col w-[350px] pb-16 pt-6 px-8 h-[337px] justify-between">
          <Image src="/images/delivery_truck.png" alt="delivery_truck" width={70} height={70} />
          <div className="text-color-title">
            <h1 className="font-ray font-extrabold text-xl">ارسال سریع و مطمئن</h1>
            <p className="text-lg mt-1.5 font-ray max-w-3xs">
              سفارش شما در کوتاه‌ترین زمان و با نهایت اطمینان به دستتان می‌رسد..
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesSection
