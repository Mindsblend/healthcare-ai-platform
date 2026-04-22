'use client'

import Image from 'next/image'
import { useMemo, useRef, useState } from 'react'
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

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)

  const hasCategories = Boolean(categories?.length)

  const filteredProducts = useMemo(() => {
    if (!activeCategoryId) return products
    return products.filter((product) => product.categoryId === activeCategoryId)
  }, [products, activeCategoryId])

  if (!filteredProducts.length) return null

  return (
    <div className="mt-6 flex w-full flex-col">
      {/* HEADER */}
      <div
        className={`mb-3 flex w-full items-center ${hasCategories ? '' : ''}`}
      >
        {/* LEFT */}
        <div className="flex flex-1 items-center">
          {hasCategories ? (
            <div className="flex flex-wrap gap-4">
              {categories!.map((category) => (
                <div
                  key={category.id}
                  onClick={() =>
                    setActiveCategoryId(
                      activeCategoryId === category.id ? null : category.id,
                    )
                  }
                  className={`flex h-[46px] w-[122px] cursor-pointer items-center justify-center rounded-full px-4 transition ${
                    activeCategoryId === category.id
                      ? 'bg-black text-white'
                      : 'bg-[#D9D9D9] text-black'
                  } `}
                >
                  <span className="font-aria text-[16px] font-bold">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <NavButtons prevRef={prevRef} nextRef={nextRef} />
          )}
        </div>

        {/* RIGHT */}
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
        className="mt-4 w-full"
      >
        {filteredProducts.map((product) => (
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
    <div className="flex items-center gap-2.5 self-start pr-5 xl:mb-3 xl:pr-14">
      <div
        ref={prevRef}
        className="flex h-11.25 w-11.25 cursor-pointer items-center justify-center rounded-full bg-black xl:h-15 xl:w-15"
      >
        <Image
          src="/images/arrow-white.svg"
          alt="prev"
          width={30}
          height={30}
          className="rotate-180 max-xl:h-5 max-xl:w-5"
        />
      </div>

      <div
        ref={nextRef}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#D9D9D9] xl:h-12.5 xl:w-12.5"
      >
        <Image
          src="/images/arrow-white.svg"
          alt="next"
          width={20}
          height={20}
          className="invert max-xl:h-3.75 max-xl:w-3.75"
        />
      </div>
    </div>
  )
}
