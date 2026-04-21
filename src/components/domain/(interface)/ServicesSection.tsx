import Image from 'next/image'

const ServicesSection = () => {
  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center text-center">
        <h1 className="text-color-title-on-light font-aria max-w-lg text-3xl font-extrabold max-sm:max-w-xs sm:text-4xl xl:text-5xl">
          راهکاری کامل برای سلامتی و تجربه خرید مطمئن
        </h1>
        <p className="font-ray text-color-body-on-light mt-7 max-w-lg text-xs font-medium max-sm:max-w-sm sm:text-base xl:text-lg">
          با ما، سلامتی و تجربه خرید شما به بالاترین استانداردها می‌رسد. هر
          محصول ارگانیک ما با دقت انتخاب و بسته‌بندی می‌شود تا کیفیت و تازگی آن
          حفظ شود.
        </p>
      </div>
      <div className="mt-14 grid w-full grid-cols-1 flex-wrap sm:grid-cols-2 lg:grid-cols-4">
        {/* Fast Delivery */}
        <div className="flex h-[260px] flex-col justify-between border-t-2 border-dashed border-black px-8 pt-6 pb-5 xl:h-[337px] xl:pb-16">
          <Image
            src="/images/delivery.svg"
            alt="delivery_truck"
            width={70}
            height={70}
            className="w-[50] xl:w-[70px]"
          />
          <div className="text-color-title-on-light">
            <h1 className="font-ray text-lg font-extrabold xl:text-xl">
              ارسال سریع و مطمئن
            </h1>
            <p className="text-color-body-on-light font-ray mt-2.5 max-w-[266px] text-sm xl:text-lg">
              سفارش شما در کوتاه‌ترین زمان و با نهایت اطمینان به دستتان می‌رسد..
            </p>
          </div>
        </div>
        {/* Standard Packaging */}
        <div className="flex h-[260px] flex-col justify-between border-t-2 border-r-2 border-dashed border-black px-8 pt-6 pb-5 xl:h-[337px] xl:pb-16">
          <Image
            src="/images/package.svg"
            alt="package"
            width={70}
            height={70}
            className="w-[50] xl:w-[70px]"
          />
          <div className="text-color-title-on-light">
            <h1 className="font-ray text-lg font-extrabold xl:text-xl">
              بسته‌بندی استاندارد
            </h1>
            <p className="text-color-body-on-light font-ray mt-2.5 max-w-[266px] text-sm xl:text-lg">
              هر محصول با دقت و در بسته‌بندی امن و مناسب ارسال می‌شود تا کیفیت
              حفظ شود.
            </p>
          </div>
        </div>
        {/* Customers Support */}
        <div className="flex h-[260px] flex-col justify-between border-t-2 border-r-2 border-dashed border-black px-8 pt-6 pb-5 xl:h-[337px] xl:pb-16">
          <Image
            src="/images/support.svg"
            alt="support"
            width={70}
            height={70}
            className="w-[50] xl:w-[70px]"
          />
          <div className="text-color-title-on-light">
            <h1 className="font-ray text-lg font-extrabold xl:text-xl">
              پشتیبانی همیشه در دسترس
            </h1>
            <p className="text-color-body-on-light font-ray mt-2.5 max-w-[266px] text-sm xl:text-lg">
              از انتخاب محصول تا بعد از خرید، تیم ما آماده پاسخگویی و راهنمایی
              شماست.
            </p>
          </div>
        </div>
        {/* Easy Payment */}
        <div className="flex h-[260px] flex-col justify-between border-t-2 border-r-2 border-dashed border-black px-8 pt-6 pb-5 xl:h-[337px] xl:pb-16">
          <Image
            src="/images/card.svg"
            alt="credit_card"
            width={70}
            height={70}
            className="w-[50] xl:w-[70px]"
          />
          <div className="text-color-title-on-light">
            <h1 className="font-ray text-lg font-extrabold xl:text-xl">
              پرداخت امن و آسان
            </h1>
            <p className="text-color-body-on-light font-ray mt-2.5 max-w-[266px] text-sm xl:text-lg">
              با روش‌های متنوع و مطمئن، خریدی بی‌دغدغه و راحت را تجربه کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesSection
