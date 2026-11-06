import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer
      className="bg-page text-color-title-on-light container pb-5"
      id="contact-us"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between">
        {/* RIGHT SIDE — Logo + Paragraph + Social Icons + Numbers */}
        <div className="flex w-full max-w-sm flex-col justify-between sm:items-start sm:text-right">
          {/* Logo */}
          <div className="flex justify-start">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={140}
              height={20}
              className="w-35 sm:w-43.75 xl:w-35"
            />
          </div>

          {/* Paragraph */}
          <p className="font-ray mb-4 text-base text-wrap text-[#555555] sm:max-w-2xs sm:text-right xl:max-w-lg">
            انتخاب ارگانیک امروز، یعنی هدیه‌دادن آینده‌ای سالم‌تر به فرزندان؛ با
            عادت‌های درست و بدنی پاک‌تر و محیطی سبزتر.
          </p>

          {/* Numbers */}
          <div className="font-ray flex flex-wrap text-base font-extrabold text-[#161A1D] sm:justify-start">
            <span className="tracking-widest">
              پشتیبانی تلفنی: ۰۲۱۶۶۴۳۱۹۵۵, ۰۹۱۲۸۴۵۵۹۰۷
            </span>
            <p className="font-ray mt-0.5 text-sm font-normal text-[#555555]">
              ۷ روز هفته، ۲۴ ساعته در خدمت شما هستیم
            </p>
          </div>
        </div>

        {/* LEFT SIDE — 3 Categories */}
        <div className="flex items-center gap-x-12.5 gap-y-5 max-sm:mt-5 max-sm:flex-wrap sm:justify-end sm:gap-x-10 xl:gap-x-20">
          {/* Category 1 */}
          <div className="text-right">
            <h3 className="font-aria mb-2.5 text-base font-extrabold">
              صفحه اصلی
            </h3>
            <ul className="font-ray space-y-2 text-base">
              <li>
                <a href="/products" className="transition hover:text-gray-500">
                  محصولات
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-gray-500">
                  تست هوش مصنوعی
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-gray-500">
                  بلاگ
                </a>
              </li>
            </ul>
          </div>

          {/* Category 2 */}
          <div className="text-center sm:text-right">
            <h3 className="font-aria mb-2 text-base font-extrabold">فروشگاه</h3>
            <ul className="font-ray space-y-2 text-base">
              <li>
                <a
                  href="/products?categoryId=6"
                  className="transition hover:text-gray-500"
                >
                  لوازم خانه
                </a>
              </li>
              <li>
                <a
                  href="/products?categoryId=5"
                  className="transition hover:text-gray-500"
                >
                  موادغذایی
                </a>
              </li>
              <li>
                <a
                  href="/products?categoryId=3"
                  className="transition hover:text-gray-500"
                >
                  مراقبت ذهنی
                </a>
              </li>
            </ul>
          </div>

          {/* Category 3 */}
          <div className="text-right">
            <h3 className="font-aria mb-2 text-base font-extrabold">
              نماد الکترونیک
            </h3>
            <ul className="font-ray flex items-center justify-center space-y-2 text-sm">
              <Image
                src="/images/enamad.svg"
                alt="enamad"
                width={104}
                height={94}
              />
            </ul>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="my-4 h-px w-full bg-[#D9D9D9]"></div>

      {/* Footer Bottom Links - Centered for mobile/tablet */}
      <div className="font-ray flex flex-col items-center justify-center gap-2 text-sm font-bold text-[#555555] sm:flex-row sm:justify-between sm:gap-0">
        <a href="#" className="text-center transition hover:text-gray-500">
          © ۲۰۲۶ تمامی حقوق مادی و معنوی این وب‌سایت متعلق به شرکت دیجی‌سلامت
          می‌باشد.
        </a>
        <div className="flex flex-wrap justify-center gap-2 text-sm sm:gap-5 xl:gap-8">
          <a
            href="/legal/privacy-policy"
            className="transition hover:text-gray-500"
          >
            سیاست حریم خصوصی
          </a>
          <a
            href="/legal/platform-rules"
            className="transition hover:text-gray-500"
          >
            قوانین خدمات
          </a>
          <a
            href="/legal/return-policy"
            className="transition hover:text-gray-500"
          >
            سیاست بازگشت کالا
          </a>
          <a
            href="/legal/ai-transparency"
            className="transition hover:text-gray-500"
          >
            شفافیت هوش مصنوعی
          </a>
          <a
            href="/legal/medical-disclaimer"
            className="transition hover:text-gray-500"
          >
            مسئولیت پزشکی
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
