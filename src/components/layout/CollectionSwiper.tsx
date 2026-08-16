// features/shop/collections/components/CollectionSwiper.tsx
'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import CollectionCard from './CollectionCard'
import 'swiper/css'
import 'swiper/css/pagination'

interface CollectionSwiperProps {
  collections: any[]
  title?: string
  description?: string
  forceDiscount?: boolean
}

const CollectionSwiper = ({
  collections,
  title,
  description,
  forceDiscount = false,
}: CollectionSwiperProps) => {
  const swiperRef = useRef<SwiperType | null>(null)

  if (!collections || collections.length === 0) return null

  return (
    <div className="w-full">
      {title && (
        <div className="mb-6 text-center">
          <h3 className="font-aria text-2xl font-bold text-black md:text-[40px]">
            {title}
          </h3>
          {description && (
            <p className="font-ray mx-auto mt-2 max-w-[380px] text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={false}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          el: '.collection-pagination',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        breakpoints={{
          480: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 3 },
        }}
        className="pb-12"
      >
        {collections.map((collection) => (
          <SwiperSlide key={collection.id}>
            <div className="flex w-full justify-center px-1">
              <CollectionCard
                collection={collection}
                hasDiscount={forceDiscount}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="collection-pagination mt-6 flex justify-center gap-2" />
    </div>
  )
}

export default CollectionSwiper
