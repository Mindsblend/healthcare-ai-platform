'use client'

import Image from 'next/image'

import { ProductType } from '../types/types'
import Product from './Product'
import { useProducts } from '@/features/shop/hooks/useProducts'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import { useRef } from 'react'

export default function ProductSwiper() {
  const nextRef = useRef<HTMLDivElement>(null)
  const prevRef = useRef<HTMLDivElement>(null)

  const { products, loading, error } = useProducts()

  if (loading) return <div>در حال بارگذاری محصولات...</div>
  if (error) return <div>خطا در بارگذاری محصولات: {error}</div>

  return (
    <div className="mt-2.5 flex w-full max-w-[1450px] flex-col items-center justify-center px-5">
      <div className="flex items-center gap-2.5 self-start pr-14 pb-2">
        {/* PREV REF - Circle with icon */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black"
          ref={prevRef}
        >
          <Image
            src="/images/arrow-white.svg"
            alt="Top Right Image"
            width={20}
            height={20}
            className="rotate-180"
          />
        </div>

        {/* NEXT REF - Circle with icon */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9D9D9]"
          ref={nextRef}
        >
          <Image
            src="/images/arrow-white.svg"
            alt="Top Right Image"
            width={20}
            height={20}
            className="invert"
          />
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (
            typeof swiper.params.navigation !== 'boolean' &&
            swiper.params.navigation
          ) {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
          }
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false, // keeps autoplay running even after user interacts
        }}
        spaceBetween={20}
        slidesPerView={3}
        className="w-full"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="flex items-center justify-center">
              <Product product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
