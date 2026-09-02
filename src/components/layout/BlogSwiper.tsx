'use client'

import Image from 'next/image'

import { useBlogsPreview } from '@/features/shop/hooks/blogs/useBlogsPreview'
import Blog from './Blog'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import { useRef } from 'react'

export default function BlogSwiper() {
  const nextRef = useRef<HTMLDivElement>(null)
  const prevRef = useRef<HTMLDivElement>(null)

  const { blogs, loading, error } = useBlogsPreview()

  if (loading) return <div>در حال بارگذاری محصولات...</div>
  if (error) return <div>خطا در بارگذاری محصولات: {error}</div>

  return (
    <div className="mt-6 flex w-full flex-col">
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
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
          },
          640: {
            slidesPerView: 2.4,
          },
          1024: {
            slidesPerView: 3.3,
          },
          1280: {
            slidesPerView: 4.1,
          },
          1440: {
            slidesPerView: 4.3,
          },
        }}
        className="w-full"
      >
        {blogs.map((blog) => (
          <SwiperSlide key={blog.id}>
            <div className="flex justify-center">
              <Blog blog={blog} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
