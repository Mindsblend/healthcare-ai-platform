import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-page px-45 pt-20 pb-10" dir="rtl">
      <div className="flex justify-between gap-20">
        {/* RIGHT SIDE — Logo + Paragraph + Social Icons + Numbers */}
        <div className="max-w-sm text-right">
          {/* Logo */}
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={200}
            height={60}
            className="mb-4"
          />

          {/* Paragraph */}
          <p className="font-ray text-color-body-on-light mb-6 text-[18px] leading-7">
            انتخاب ارگانیک امروز، یعنی هدیه‌دادن آینده‌ای سالم‌تر به فرزندان؛ با
            عادت‌های درست و بدنی پاک‌تر و محیطی سبزتر.
          </p>

          {/* Numbers */}
          <div className="font-aria text-color-body-on-light flex justify-start gap-6 text-lg font-normal">
            {/* Social Media */}
            <div className="flex justify-end gap-4">
              <Image
                src="/images/whatsapp.svg"
                width={28}
                height={28}
                alt="Whatsapp"
              />
              <Image
                src="/images/telegram.svg"
                width={28}
                height={28}
                alt="Telegram"
              />
              <Image
                src="/images/instagram.svg"
                width={28}
                height={28}
                alt="Instagram"
              />
            </div>
            <span>۰۲۱۶۶۴۳۱۹۵۵</span>
            <span>۰۹۱۲۸۴۵۵۹۰۷</span>
          </div>
        </div>

        {/* LEFT SIDE — 3 Categories */}
        <div className="flex gap-20">
          {/* Category 1 */}
          <div>
            <h3 className="font-aria mb-4 text-[20px] font-extrabold">
              محصولات
            </h3>
            <ul className="font-ray space-y-4 text-[18px]">
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

          {/* Category 2 */}
          <div>
            <h3 className="font-aria mb-4 text-[20px] font-extrabold">خدمات</h3>
            <ul className="font-ray space-y-4 text-[18px]">
              <li>
                <a href="#" className="hover:text-gray-300">
                  مشاوره رایگان
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  تست هوش مصنوعی
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  ارسال سریع
                </a>
              </li>
            </ul>
          </div>

          {/* Category 3 */}
          <div>
            <h3 className="font-aria mb-4 text-[20px] font-extrabold">
              ارتباط با ما
            </h3>
            <ul className="font-ray space-y-4 text-[18px]">
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
      <div className="mt-10 mb-6 h-px w-full bg-[#D9D9D9]"></div>

      {/* Footer Bottom Links */}
      <div
        className="font-ray flex justify-between text-[20px] font-extrabold text-black"
        dir="rtl"
      >
        <a href="#" className="hover:text-gray-200">
          © ۲۰۲۵ عطاری ۲۴ ساعته – تمامی حقوق محفوظ است
        </a>
        <div className="flex gap-9">
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
