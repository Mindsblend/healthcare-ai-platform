import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Bundle from './Bundle'
import { ProductSummary } from '@/features/shop/shop.types'

interface BundleSwiperProps {
  products: ProductSummary[]
}

const BundleSwiper = ({ products }: BundleSwiperProps) => {
  if (!products || products.length === 0) return null

  return (
    <div className="flex flex-col items-center justify-center px-0 sm:px-2 md:px-4">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          el: '#custom-pagination',
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          // Mobile
          0: {
            slidesPerView: 1,
            spaceBetween: 12,
          },
          // Small Tablet
          640: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          // Tablet
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          // Desktop
          1024: {
            slidesPerView: 1,
            spaceBetween: 24,
          },
        }}
        className="w-full"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-auto">
            <Bundle product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Container */}
      <div className="mt-3 flex items-center justify-center gap-1 sm:mt-4 sm:gap-2 md:mt-5">
        <div
          id="custom-pagination"
          className="flex items-center justify-center"
        />
      </div>
    </div>
  )
}

export default BundleSwiper
