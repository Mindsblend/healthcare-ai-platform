'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function TopBanner() {
  const pathname = usePathname()

  const hiddenPaths = ['/profile', '/cart', '/order']

  const shouldHideBanner = hiddenPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )

  return (
    <section
      className={`h-[30px] w-full overflow-hidden bg-[#00152d] sm:h-[40px] ${
        shouldHideBanner ? 'max-md:hidden' : ''
      }`}
    >
      <a
        rel="noopener noreferrer"
        className="relative block h-full w-full"
        href="#"
      >
        <Image
          src="/images/navbar-banner.webp"
          alt="ارسال سریع و مطمئن به سراسر ایران"
          title="ارسال سریع و مطمئن به سراسر ایران"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </a>
    </section>
  )
}
