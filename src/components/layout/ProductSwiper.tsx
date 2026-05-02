'use client'

import Image from 'next/image'
import { useMemo, useRef, useState, useEffect } from 'react'
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
  const swiperRef = useRef<any>(null)

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)

  const hasCategories = Boolean(categories?.length)

  const filteredProducts = useMemo(() => {
    if (!activeCategoryId) return products
    return products.filter((product) => product.categoryId === activeCategoryId)
  }, [products, activeCategoryId])

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current
      swiperRef.current.params.navigation.nextEl = nextRef.current
      swiperRef.current.navigation.destroy()
      swiperRef.current.navigation.init()
      swiperRef.current.navigation.update()
    }
  }, [products, categories, activeCategoryId])

  if (!filteredProducts.length) return null

  return (
    <div className="mt-3 flex w-full flex-col xl:mt-6">
      {/* HEADER */}
      <div
        className={`mb-3 flex w-full items-center justify-between ${hasCategories ? '' : ''}`}
      >
        {/* LEFT */}
        <div className="hidden flex-1 items-center lg:flex">
          {hasCategories ? (
            <div className="flex flex-wrap gap-4">
              <div
                onClick={() => setActiveCategoryId(null)}
                className={`flex h-11.5 w-30.5 cursor-pointer items-center justify-center rounded-full px-4 transition ${
                  activeCategoryId === null
                    ? 'bg-black text-white'
                    : 'bg-[#D9D9D9] text-black'
                } `}
              >
                <span className="font-aria text-base font-bold">همه</span>
              </div>

              {categories!.map((category) => (
                <div
                  key={category.id}
                  onClick={() =>
                    setActiveCategoryId(
                      activeCategoryId === category.id ? null : category.id,
                    )
                  }
                  className={`flex h-11.5 w-30.5 cursor-pointer items-center justify-center rounded-full px-4 transition ${
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

        <div className="category-menu-container relative block lg:hidden">
          <button
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className="secondary-btn flex items-center justify-center gap-1 rounded-full border border-black bg-black px-4 py-2 font-medium whitespace-nowrap text-white"
          >
            <Image
              src="/images/discover_tune.svg"
              width={15}
              height={15}
              alt="discover tune image"
            />
            دسته بندی
            <svg
              className={`transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isCategoryMenuOpen && hasCategories && (
            <div className="absolute top-full right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
              <div className="py-2">
                <button
                  onClick={() => {
                    setActiveCategoryId(null)
                    setIsCategoryMenuOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-right transition-colors ${
                    activeCategoryId === null
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="block font-medium">همه محصولات</span>
                </button>

                {categories!.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategoryId(
                        activeCategoryId === category.id ? null : category.id,
                      )
                      setIsCategoryMenuOpen(false)
                    }}
                    className={`w-full px-4 py-3 text-right transition-colors ${
                      activeCategoryId === category.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT - دکمه‌های نویگیشن */}
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
        onSwiper={(swiper) => {
          swiperRef.current = swiper
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
    <div className="z-50 flex items-center gap-2.5 self-start pr-5 xl:mb-3 xl:pr-14">
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
