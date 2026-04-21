import { getSession } from '@/features/auth/services/sessionService'
import Image from 'next/image'
import Link from 'next/link'

export default async function Navbar() {
  const user = await getSession()

  return (
    <div>
      <nav className="container flex w-full items-center justify-between bg-white py-4 text-black">
        {/* Navigation + Logo */}
        <div className="font-ray flex items-center gap-8 text-[16px] font-medium text-black">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={190}
                height={20}
              />
            </Link>
          </div>
          {/* Navigation links */}
          {user && (
            <>
              <ul className="hidden gap-6 font-medium md:flex">
                <li>
                  <a
                    href="/"
                    className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                  >
                    خانه
                  </a>
                </li>
                <li>
                  <a
                    href="/ai"
                    className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                  >
                    تست هوش مصنوعی
                  </a>
                </li>
                <li>
                  <a
                    href="/blogs"
                    className="text-black no-underline visited:text-black hover:text-gray-900 focus:text-black active:text-black"
                  >
                    وبلاگ
                  </a>
                </li>
                <li>
                  <a
                    href="/products"
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
              <Link href={'/cart'}>
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
            <div className="flex gap-3 lg:gap-7.5">
              <Link
                href="/ai"
                className="bg-page flex cursor-pointer items-center justify-between gap-1 rounded-full text-white"
              >
                {/* Button text */}
                <span className="font-ray text-color-title-on-light mr-3.5 text-xs font-medium whitespace-nowrap lg:text-base">
                  تست هوش مصنوعی
                </span>

                {/* Circle with icon */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white sm:h-8 sm:w-8">
                  <Image
                    src="/images/cognition-black.svg"
                    alt="Arrow"
                    width={24}
                    height={24}
                    className="max-sm:h-5 max-sm:w-5"
                  />
                </div>
              </Link>

              {/* Button text */}
              <Link
                href={'/auth'}
                className="flex h-10 w-38 cursor-pointer items-center justify-between rounded-full bg-black px-2 whitespace-nowrap sm:h-13.5 sm:w-45 xl:w-48.5"
              >
                <span className="font-ray pr-2 text-xs font-medium text-white sm:text-base">
                  ورود به حساب کاربری
                </span>
                {/* Circle with icon */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white sm:h-10 sm:w-10">
                  <Image
                    src="/images/right-up.svg"
                    alt="Top Right Image"
                    width={35}
                    height={35}
                    className="max-sm:h-3.75 max-sm:w-3.75"
                  />
                </div>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
