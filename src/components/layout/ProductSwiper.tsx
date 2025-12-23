'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'

import Product from './Product'
import { CategoryType, ProductPreviewType } from '../types/types'

import 'swiper/css'
import 'swiper/css/navigation'

type ProductSwiperProps = {
  products: ProductPreviewType[]
  categories?: CategoryType[]
}

export default function ProductSwiper({
  products,
  categories,
}: ProductSwiperProps) {
  const nextRef = useRef<HTMLDivElement | null>(null)
  const prevRef = useRef<HTMLDivElement | null>(null)

  if (!products?.length) return null

  const hasCategories = Boolean(categories?.length)

  return (
    <div
      className={`mt-2.5 flex w-full max-w-[1450px] flex-col ${
        categories?.length ? 'pl-5' : 'px-5'
      }`}
    >
      {/* HEADER */}
      <div
        className={`mb-3 flex w-full items-center ${
          hasCategories ? '' : 'pr-14'
        }`}
      >
        {/* LEFT */}
        <div className="flex flex-1 items-center">
          {hasCategories ? (
            <div className="flex flex-wrap gap-4">
              {categories!.map((category) => (
                <div
                  key={category.id}
                  className="flex h-[46px] w-[122px] items-center justify-center rounded-full bg-[#D9D9D9] px-4"
                >
                  <span className="font-aria text-color-body-on-light text-[16px] font-bold">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <NavButtons prevRef={prevRef} nextRef={nextRef} />
          )}
        </div>

        {/* RIGHT (only if categories exist) */}
        {hasCategories && <NavButtons prevRef={prevRef} nextRef={nextRef} />}
      </div>

      {/* SWIPER */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation !== 'boolean') {
            swiper.params.navigation!.prevEl = prevRef.current
            swiper.params.navigation!.nextEl = nextRef.current
          }
        }}
        className="w-full mt-4"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="flex justify-center">
              <Product product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

/* ---------------------------------- */
/* NAV BUTTONS */
/* ---------------------------------- */

function NavButtons({
  prevRef,
  nextRef,
}: {
  prevRef: React.RefObject<HTMLDivElement | null>
  nextRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        ref={prevRef}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-black"
      >
        <Image
          src="/images/arrow-white.svg"
          alt="prev"
          width={20}
          height={20}
          className="rotate-180"
        />
      </div>

      <div
        ref={nextRef}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9D9D9]"
      >
        <Image
          src="/images/arrow-white.svg"
          alt="next"
          width={20}
          height={20}
          className="invert"
        />
      </div>
    </div>
  )
}
