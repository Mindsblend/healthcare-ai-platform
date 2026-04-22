'use client'

import Image from 'next/image'

import { useBlogs } from '@/features/shop/hooks/blogs/useBlogs'
import Blog from './Blog'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import { useRef } from 'react'

export default function BlogSwiper() {
  const nextRef = useRef<HTMLDivElement>(null)
  const prevRef = useRef<HTMLDivElement>(null)

  const { blogs, loading, error } = useBlogs()

  if (loading) return <div>در حال بارگذاری محصولات...</div>
  if (error) return <div>خطا در بارگذاری محصولات: {error}</div>

  return (
    <div className="mt-6 flex w-full flex-col">
      <div className="flex items-center gap-2.5 self-start pr-5 xl:mb-3 xl:pr-14">
        {/* PREV REF - Circle with icon */}
        <div
          className="flex h-11.25 w-11.25 items-center justify-center rounded-full bg-black xl:h-15 xl:w-15"
          ref={prevRef}
        >
          <Image
            src="/images/arrow-white.svg"
            alt="Top Right Image"
            width={30}
            height={30}
            className="rotate-180 max-xl:h-5 max-xl:w-5"
          />
        </div>

        {/* NEXT REF - Circle with icon */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9D9D9] xl:h-12.5 xl:w-12.5"
          ref={nextRef}
        >
          <Image
            src="/images/arrow-white.svg"
            alt="Top Right Image"
            width={20}
            height={20}
            className="invert max-xl:h-3.75 max-xl:w-3.75"
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
        {blogs.map((blog) => (
          <SwiperSlide key={blog.id}>
            <div className="mt-4 flex justify-center">
              <Blog blog={blog} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
