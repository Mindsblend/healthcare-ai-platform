'use client'

import Image from 'next/image'
import { useMemo, useRef, useState, useEffect, memo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import Product from './Product'
import { ProductSummary, CategorySummary } from '@/features/shop/shop.types'

import 'swiper/css'

type ProductSwiperProps = {
  products: ProductSummary[]
  categories?: CategorySummary[]
}

const ProductSwiper = memo(({ products, categories }: ProductSwiperProps) => {
  const swiperRef = useRef<SwiperType | null>(null)

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)

  const hasCategories = Boolean(categories?.length)

  const filteredProducts = useMemo(() => {
    if (!activeCategoryId) return products
    return products.filter((product) => product.categoryId === activeCategoryId)
  }, [products, activeCategoryId])

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId || !categories) return null
    const category = categories.find((c) => c.id === activeCategoryId)
    return category?.name || null
  }, [activeCategoryId, categories])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isCategoryMenuOpen && !target.closest('.category-menu-container')) {
        setIsCategoryMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isCategoryMenuOpen])

  return (
    <div className="mt-3 flex w-full flex-col xl:mt-6">
      {/* Category Header */}
      <div className="mb-3 flex w-full items-center justify-between">
        <div className="hidden flex-1 items-center lg:flex">
          {hasCategories && (
            <div className="flex flex-wrap gap-4">
              <div
                onClick={() => setActiveCategoryId(null)}
                className={`flex h-11.5 w-30.5 cursor-pointer items-center justify-center rounded-full px-4 transition ${
                  activeCategoryId === null
                    ? 'bg-black text-white'
                    : 'bg-[#D9D9D9] text-black'
                }`}
              >
                <span className={`font-aria text-base font-bold ${activeCategoryId === null ? 'text-white' : 'text-[#555]'}`}>همه</span>
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
                  }`}
                >
                  <span
                    className={`font-aria text-base font-bold ${activeCategoryId === category.id ? 'text-white' : 'text-[#555]'}`}
                  >
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        {hasCategories && (
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
                    <span className="block font-medium">همه</span>
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
        )}

        {/* Navigation Buttons */}
        {hasCategories && (
          <div className="flex items-center gap-x-2.5 self-start pr-5 xl:pr-14">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-11.25 w-11.25 cursor-pointer items-center justify-center rounded-full bg-black xl:h-15 xl:w-15"
            >
              <Image
                src="/images/arrow-white.svg"
                alt="prev"
                width={30}
                height={30}
                className="rotate-180 max-xl:h-5 max-xl:w-5"
              />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#D9D9D9] xl:h-12.5 xl:w-12.5"
            >
              <Image
                src="/images/arrow-white.svg"
                alt="next"
                width={20}
                height={20}
                className="invert max-xl:h-3.75 max-xl:w-3.75"
              />
            </button>
          </div>
        )}
      </div>

      {/* SWIPER */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        modules={[Autoplay]}
        spaceBetween={20}
        autoplay={
          filteredProducts.length > 1
            ? { delay: 3000, disableOnInteraction: false }
            : false
        }
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1440: { slidesPerView: 4 },
        }}
        className="mt-4 w-full"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="flex justify-center">
                <Product product={product} />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="mt-8 flex w-full flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              {activeCategoryName
                ? `محصولی در دسته ${activeCategoryName} یافت نشد`
                : 'محصولی یافت نشد'}
            </h3>
            <p className="text-gray-500">
              لطفاً دسته‌بندی دیگری را انتخاب کنید.
            </p>
            <button
              onClick={() => setActiveCategoryId(null)}
              className="mt-6 cursor-pointer rounded-full bg-black px-6 py-2 text-white transition hover:bg-gray-800"
            >
              مشاهده همه محصولات
            </button>
          </div>
        )}
      </Swiper>
    </div>
  )
})

export default ProductSwiper
