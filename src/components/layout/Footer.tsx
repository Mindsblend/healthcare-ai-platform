import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-page text-color-title-on-light container pb-5">
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
          <p className="font-ray text-color-title-on-light mb-2.5 text-wrap sm:max-w-2xs sm:text-right sm:text-sm xl:max-w-lg xl:text-xl">
            انتخاب ارگانیک امروز، یعنی هدیه‌دادن آینده‌ای سالم‌تر به فرزندان؛ با
            عادت‌های درست و بدنی پاک‌تر و محیطی سبزتر.
          </p>

          {/* Numbers */}
          <div className="font-aria text-color-title-on-light flex flex-wrap gap-3 text-lg font-normal sm:justify-start sm:gap-6">
            {/* Social Media */}
            <div className="flex justify-end gap-4">
              <Link href='#'>
                <Image
                  src="/images/whatsapp.svg"
                  width={22}
                  height={22}
                  alt="Whatsapp"
                />
              </Link>
              <Link href='#'>
                <Image
                  src="/images/telegram.svg"
                  width={22}
                  height={22}
                  alt="Telegram"
                />
              </Link>
              <Link href='#'>
                <Image
                  src="/images/instagram.svg"
                  width={22}
                  height={22}
                  alt="Instagram"
                />
              </Link>
            </div>
            <span className="font-ray sm:text-sm xl:text-xl">۰۲۱۶۶۴۳۱۹۵۵</span>
            <span className="font-ray sm:text-sm xl:text-xl">۰۹۱۲۸۴۵۵۹۰۷</span>
          </div>
        </div>

        {/* LEFT SIDE — 3 Categories */}
        <div className="flex gap-x-12.5 items-center gap-y-5 max-sm:mt-5 max-sm:flex-wrap sm:justify-end sm:gap-x-10 xl:gap-x-20">
          {/* Category 1 */}
          <div className="text-right">
            <h3 className="font-aria mb-2.5 font-extrabold sm:text-base xl:text-xl">
              صفحه اصلی
            </h3>
            <ul className="font-ray space-y-2 sm:text-sm xl:text-lg">
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
            <h3 className="font-aria mb-2 font-extrabold sm:text-base xl:text-xl">
              فروشگاه
            </h3>
            <ul className="font-ray space-y-2 sm:text-sm xl:text-lg">
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
            <h3 className="font-aria mb-2 font-extrabold sm:text-base xl:text-xl">
              ارتباط با ما
            </h3>
            <ul className="font-ray space-y-2 sm:text-sm xl:text-lg">
              <li>
                <a href="#" className="transition hover:text-gray-500">
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-gray-500">
                  پشتیبانی
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-gray-500">
                  همکاری
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="my-2.5 h-px w-full bg-[#D9D9D9]"></div>

      {/* Footer Bottom Links - Centered for mobile/tablet */}
      <div className="font-ray flex flex-col text-sm items-center justify-center gap-2 font-bold text-black sm:flex-row sm:justify-between sm:gap-0 sm:text-sm xl:text-xl">
        <a href="#" className="text-center transition hover:text-gray-500">
          © ۲۰۲۵ دیجی سلامت – تمامی حقوق محفوظ است
        </a>
        <div className="flex flex-wrap text-sm sm:text-base justify-center gap-2 sm:gap-5 xl:gap-8">
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
