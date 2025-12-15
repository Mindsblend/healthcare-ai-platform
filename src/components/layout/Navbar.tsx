import { getSession } from '@/features/auth/services/sessionService'
import Image from 'next/image'
import Link from 'next/link'

export default async function Navbar() {
  const user = await getSession()

  return (
    <div>
      <nav className="flex w-full items-center justify-between bg-white px-26 py-4 text-black">
        {/* Navigation + Logo */}
        <div className="font-ray flex items-center gap-8 text-[16px] font-medium text-black">
          {/* Logo */}
          <div className="">
            <Image src="/images/logo.svg" alt="Logo" width={190} height={20} />
          </div>
          {/* Navigation links */}
          {user && (
            <>
              <ul className="hidden gap-6 font-medium md:flex">
                <li>
                  <a
                    href="#home"
                    className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                  >
                    خانه
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                  >
                    تست هوش مصنوعی
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                  >
                    وبلاگ
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                  >
                    محصولات
                  </a>
                </li>
              </ul>
            </>
          )}
        </div>
        <div className="flex justify-center gap-3">
          {/* Left: Menu button */}
          {user ? (
            <div className="flex justify-center gap-6">
              <Link href={'/auth'}>
                <Image
                  src="/images/cart.svg"
                  alt="Arrow"
                  width={32}
                  height={32}
                />
              </Link>

              <Link href={'/auth'}>
                <Image
                  src="/images/profile.svg"
                  alt="Arrow"
                  width={32}
                  height={32}
                />
              </Link>
            </div>
          ) : (
            <div>
              <button className="bg-page flex h-[43px] min-w-[187px] items-center justify-between rounded-full px-2 text-white">
                {/* Button text */}
                <span className="font-ray text-color-title-on-light mr-3.5 text-[16px] font-medium whitespace-nowrap">
                  تست هوش مصنوعی
                </span>

                {/* Circle with icon */}
                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white">
                  <Image
                    src="/images/cognition.svg"
                    alt="Arrow"
                    width={24}
                    height={24}
                  />
                </div>
              </button>

              <button className="flex h-[43px] min-w-[187px] cursor-pointer items-center justify-between rounded-full bg-black px-2 text-white">
                {/* Button text */}
                <Link
                  href={'/auth'}
                  className="font-ray mr-3.5 text-[16px] font-medium whitespace-nowrap text-white"
                >
                  ورود به حساب کاربری
                </Link>

                {/* Circle with icon */}
                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white">
                  <Image
                    src="/images/arrow.svg"
                    alt="Arrow"
                    width={20}
                    height={20}
                    className="rotate-45"
                  />
                </div>
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
