'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'

import Product from './Product'
import { ProductPreviewType } from '../types/types'

import 'swiper/css'
import 'swiper/css/navigation'

type ProductSwiperProps = {
  products: ProductPreviewType[]
}

export default function ProductSwiper({ products }: ProductSwiperProps) {
  const nextRef = useRef<HTMLDivElement>(null)
  const prevRef = useRef<HTMLDivElement>(null)

  if (!products?.length) return null

  return (
    <div className="mt-2.5 flex w-full max-w-[1450px] flex-col items-center justify-center px-5">
      <div className="flex items-center gap-2.5 self-start pr-14 pb-2">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black"
          ref={prevRef}
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
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9D9D9]"
          ref={nextRef}
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
        className="w-full"
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
