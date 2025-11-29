'use client'

import { ProductType } from '../types/types'
import Product from './Product'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import { useRef } from 'react'

interface Props {
  products: ProductType[]
}

export default function ProductSwiper({ products }: Props) {
  const nextRef = useRef<HTMLButtonElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="mt-2.5 flex w-full max-w-[1450px] flex-col items-center justify-center px-5">
      <div className="self-start">
        <button ref={prevRef} className="text-black">
          prev
        </button>
        <button ref={nextRef} className="text-black">
          next
        </button>
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
