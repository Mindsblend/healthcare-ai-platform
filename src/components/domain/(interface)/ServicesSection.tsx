import Image from 'next/image'

const ServicesSection = () => {
  return (
    <div className="mt-28 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-color-title-on-light font-aria max-w-lg text-5xl font-extrabold">
          راهکاری کامل برای سلامتی و تجربه خرید مطمئن
        </h1>
        <p className="font-ray text-color-body-on-light mt-7 max-w-lg text-xl">
          با ما، سلامتی و تجربه خرید شما به بالاترین استانداردها می‌رسد. هر
          محصول ارگانیک ما با دقت انتخاب و بسته‌بندی می‌شود تا کیفیت و تازگی آن
          حفظ شود.
        </p>
      </div>
      <div className="mt-14 grid w-full grid-cols-1 flex-wrap sm:grid-cols-2 lg:grid-cols-4">
        {/* Fast Delivery */}
        <div className="flex h-[337px] flex-col justify-between border-t-2 border-dashed border-black pt-6 pr-8 pb-16">
          <Image
            src="/images/delivery-truck.png"
            alt="delivery_truck"
            width={70}
            height={70}
          />
          <div className="text-color-title-on-light">
            <h1 className="font-ray text-xl font-extrabold">
              ارسال سریع و مطمئن
            </h1>
            <p className="text-color-body-on-light font-ray mt-1.5 max-w-[266px] text-lg">
              سفارش شما در کوتاه‌ترین زمان و با نهایت اطمینان به دستتان می‌رسد..
            </p>
          </div>
        </div>
        {/* Standard Packaging */}
        <div className="flex h-[337px] flex-col justify-between border-t-2 border-r-2 border-dashed border-black pt-6 pr-8 pb-16">
          <Image
            src="/images/package.png"
            alt="package"
            width={70}
            height={70}
          />
          <div className="text-color-title-on-light">
            <h1 className="font-ray text-xl font-extrabold">
              بسته‌بندی استاندارد
            </h1>
            <p className="text-color-body-on-light font-ray mt-1.5 max-w-[266px] text-lg">
              هر محصول با دقت و در بسته‌بندی امن و مناسب ارسال می‌شود تا کیفیت
              حفظ شود.
            </p>
          </div>
        </div>
        {/* Customers Support */}
        <div className="flex h-[337px] flex-col justify-between border-t-2 border-r-2 border-dashed border-black pt-6 pr-8 pb-16">
          <Image
            src="/images/support.png"
            alt="support"
            width={70}
            height={70}
          />
          <div className="text-color-title-on-light">
            <h1 className="font-ray text-xl font-extrabold">
              پشتیبانی همیشه در دسترس
            </h1>
            <p className="text-color-body-on-light font-ray mt-1.5 max-w-[266px] text-lg">
              از انتخاب محصول تا بعد از خرید، تیم ما آماده پاسخگویی و راهنمایی
              شماست.
            </p>
          </div>
        </div>
        {/* Easy Payment */}
        <div className="flex h-[337px] flex-col justify-between border-t-2 border-r-2 border-dashed border-black pt-6 pr-8 pb-16">
          <Image
            src="/images/credit-card.png"
            alt="credit_card"
            width={70}
            height={70}
          />
          <div className="text-color-title-on-light">
            <h1 className="font-ray text-xl font-extrabold">
              پرداخت امن و آسان
            </h1>
            <p className="text-color-body-on-light font-ray mt-1.5 max-w-[266px] text-lg">
              با روش‌های متنوع و مطمئن، خریدی بی‌دغدغه و راحت را تجربه کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesSection
