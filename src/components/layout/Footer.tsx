import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-page text-color-title-on-light container pt-12 pb-5">
      <div className="flex flex-col justify-between sm:flex-row">
        {/* RIGHT SIDE — Logo + Paragraph + Social Icons + Numbers */}
        <div className="flex max-w-sm flex-col justify-between">
          {/* Logo */}
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={140}
            height={20}
            className="w-43.75 xl:w-35"
          />

          {/* Paragraph */}
          <p className="font-ray text-color-title-on-light mb-2.5 text-wrap sm:max-w-2xs sm:text-sm xl:max-w-lg xl:text-xl">
            انتخاب ارگانیک امروز، یعنی هدیه‌دادن آینده‌ای سالم‌تر به فرزندان؛ با
            عادت‌های درست و بدنی پاک‌تر و محیطی سبزتر.
          </p>

          {/* Numbers */}
          <div className="font-aria text-color-title-on-light flex justify-start gap-3 text-lg font-normal sm:gap-6">
            {/* Social Media */}
            <div className="flex justify-end gap-4">
              <Image
                src="/images/whatsapp.svg"
                width={22}
                height={22}
                alt="Whatsapp"
              />
              <Image
                src="/images/telegram.svg"
                width={22}
                height={22}
                alt="Telegram"
              />
              <Image
                src="/images/instagram.svg"
                width={22}
                height={22}
                alt="Instagram"
              />
            </div>
            <span className="font-ray sm:text-sm xl:text-xl">۰۲۱۶۶۴۳۱۹۵۵</span>
            <span className="font-ray sm:text-sm xl:text-xl">۰۹۱۲۸۴۵۵۹۰۷</span>
          </div>
        </div>

        {/* LEFT SIDE — 3 Categories */}
        <div className="flex gap-12.5 max-sm:mt-5 max-sm:flex-wrap sm:gap-x-10 xl:gap-x-20">
          {/* Category 1 */}
          <div>
            <h3 className="font-aria mb-2.5 font-extrabold sm:text-base xl:text-xl">
              صفحه اصلی
            </h3>
            <ul className="font-ray space-y-2 sm:text-sm xl:text-lg">
              <li>
                <a href="#" className="hover:text-gray-300">
                  بلاگ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  تست هوش مصنوعی
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  فروشگاه
                </a>
              </li>
            </ul>
          </div>

          {/* Category 2 */}
          <div>
            <h3 className="font-aria mb-2 font-extrabold sm:text-base xl:text-xl">
              فروشگاه
            </h3>
            <ul className="font-ray space-y-2 sm:text-sm xl:text-lg">
              <li>
                <a href="#" className="hover:text-gray-300">
                  روغن‌ها
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  عرقیجات
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  دمنوش‌ها
                </a>
              </li>
            </ul>
          </div>

          {/* Category 3 */}
          <div>
            <h3 className="font-aria mb-2 font-extrabold sm:text-base xl:text-xl">
              ارتباط با ما
            </h3>
            <ul className="font-ray space-y-2 sm:text-sm xl:text-lg">
              <li>
                <a href="#" className="hover:text-gray-300">
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  پشتیبانی
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  همکاری
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="my-2.5 h-px w-full bg-[#D9D9D9]"></div>

      {/* Footer Bottom Links */}
      <div className="font-ray flex flex-wrap justify-center font-bold text-black sm:justify-between sm:text-sm xl:text-xl">
        <a href="#" className="hover:text-gray-200">
          © ۲۰۲۵ عطاری ۲۴ ساعته – تمامی حقوق محفوظ است
        </a>
        <div className="flex flex-wrap sm:gap-5 xl:gap-8">
          <a href="#" className="hover:text-gray-200">
            سیاست حریم خصوصی
          </a>
          <a href="#" className="hover:text-gray-200">
            قوانین خدمات
          </a>
          <a href="#" className="hover:text-gray-200">
            سیاست بازگشت کالا
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
