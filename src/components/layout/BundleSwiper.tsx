import {
  Navigation,
  Pagination,
  Autoplay,
} from 'swiper/modules'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Bundle from './Bundle'

const BundleSwiper = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{
          el: '#custom-pagination',
          clickable: true,
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="w-full"
      >
        <SwiperSlide className="w-full">
          <Bundle />
        </SwiperSlide>
        <SwiperSlide className="w-full">
          <Bundle />
        </SwiperSlide>
        <SwiperSlide className="w-full">
          <Bundle />
        </SwiperSlide>
      </Swiper>
      <div className="mt-3 flex items-center justify-center">
        <div id="custom-pagination" />
      </div>
    </div>
  )
}

export default BundleSwiper
