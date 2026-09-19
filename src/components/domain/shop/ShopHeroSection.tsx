'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

interface HeroSlide {
  id: string
  image: string
  alt: string
  href: string
  badge?: string
}

// Placeholder banners — replace `image` with your real banner assets
// (recommended size ~1600x700px) and point `href` at the right product/campaign page.
const slides: HeroSlide[] = [
  {
    id: 'ai-test',
    image: '/images/banner.webp',
    alt: 'تست هوش مصنوعی سلامت، فقط ۵ دقیقه و کاملاً رایگان',
    href: '/ai',
    badge: 'رایگان',
  },
  {
    id: 'new-products',
    image: '/images/banner1.webp',
    alt: 'محصولات ارگانیک جدید فروشگاه',
    href: '/products?filter=new',
    badge: 'جدید',
  },
  {
    id: 'bestsellers',
    image: '/images/535c0c1dcd8930648a9a39971162bded7dbb07ad_1788350109.webp',
    alt: 'پرفروش‌ترین محصولات سالم و ارگانیک',
    href: '/products?filter=bestsellers',
    badge: 'پرفروش',
  },
]

const AUTOPLAY_DELAY_MS = 5000
const SWIPE_THRESHOLD_PX = 50

const ShopHeroSection = () => {
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const pointerStartX = useRef<number | null>(null)
  const pointerDeltaX = useRef(0)
  const total = slides.length

  const goTo = useCallback(
    (index: number) => setActive(((index % total) + total) % total),
    [total],
  )
  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  // Autoplay — pauses on hover/focus/drag and is skipped for reduced-motion users.
  useEffect(() => {
    if (isPaused || total <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % total)
    }, AUTOPLAY_DELAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, total])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      next()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      prev()
    }
  }

  const resetPointerState = () => {
    pointerStartX.current = null
    setIsPaused(false)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX
    pointerDeltaX.current = 0
    setIsPaused(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return
    pointerDeltaX.current = event.clientX - pointerStartX.current
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerDeltaX.current > SWIPE_THRESHOLD_PX) {
      prev()
    } else if (pointerDeltaX.current < -SWIPE_THRESHOLD_PX) {
      next()
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    resetPointerState()
  }

  // Swallow the click that follows a real drag so it doesn't also navigate the link.
  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (Math.abs(pointerDeltaX.current) > 10) {
      event.preventDefault()
    }
  }

  return (
    <div className="container mt-5 mb-7 w-full">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="بنرهای فروشگاه"
        tabIndex={0}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetPointerState}
        onClickCapture={handleClickCapture}
        className="group relative h-[180px] w-full touch-pan-y overflow-hidden rounded-[10px] bg-neutral-100 outline-none select-none sm:h-[400px]"
      >
        {slides.map((slide, index) => (
          <Link
            key={slide.id}
            href={slide.href}
            aria-hidden={index !== active}
            tabIndex={index === active ? 0 : -1}
            draggable={false}
            className={`absolute inset-0 block cursor-grab transition-opacity duration-700 ease-in-out active:cursor-grabbing motion-reduce:transition-none ${
              index === active ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
              draggable={false}
            />

            {slide.badge ? (
              <span className="font-ray absolute top-4 right-4 rounded-full bg-black px-3.5 py-1.5 text-xs font-medium text-white sm:top-6 sm:right-6 sm:text-sm">
                {slide.badge}
              </span>
            ) : null}
          </Link>
        ))}

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="بنر قبلی"
              className="absolute top-1/2 right-4 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 sm:h-11 sm:w-11"
            >
              <ChevronIcon direction="right" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="بنر بعدی"
              className="absolute top-1/2 left-4 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 sm:h-11 sm:w-11"
            >
              <ChevronIcon direction="left" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-6">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`رفتن به بنر ${index + 1} از ${total}`}
                  aria-current={index === active}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === active
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

const ChevronIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={direction === 'left' ? 'rotate-180' : ''}
  >
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default ShopHeroSection
