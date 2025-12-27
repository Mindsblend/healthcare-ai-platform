'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useProducts } from '@/features/shop/hooks/products/useProducts'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import Product from '@/components/layout/Product'
import PriceRangeSlider from '@/components/domain/shop/product/PriceRangeSlider'

const Page = () => {
  const { products, loading, error } = useProducts()
  const { categories } = useCategories()

  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [isPriceOpen, setIsPriceOpen] = useState(true)
  const [isFilterOpenMobile, setIsFilterOpenMobile] = useState(false)

  const [minPrice, setMinPrice] = useState(100)
  const [maxPrice, setMaxPrice] = useState(1000)

  if (loading) return <div>در حال بارگذاری محصولات...</div>
  if (error) return <div>خطا در بارگذاری محصولات: {error}</div>

  return (
    <section className="mx-4 py-20 sm:mx-10">
      {/* ===== Header ===== */}
      <div className="mb-10 flex flex-col items-center text-center">
        <h1 className="font-aria text-color-title-on-light max-w-[532px] text-[36px] leading-tight font-extrabold sm:text-[54px]">
          کالای دلخواهت را همین حالا پیدا کن
        </h1>

        {/* Search */}
        <div className="relative mt-8 w-full max-w-[469px] px-4 sm:px-0">
          <div className="absolute top-1/2 left-4 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm">
            <Image
              src="/images/search.svg"
              alt="Search"
              width={18}
              height={18}
            />
          </div>

          <input
            type="text"
            placeholder="جستجو هوشمندانه از میان صدها محصول"
            className="font-ray h-[65px] w-full rounded-2xl bg-[#f2f2f2] pr-5 pl-[50px] text-[16px] font-bold transition outline-none focus:bg-white focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* ===== Mobile Filter Button ===== */}
      <div className="mb-6 flex justify-end lg:hidden">
        <button
          onClick={() => setIsFilterOpenMobile((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-bold text-white"
        >
          فیلترها
          <Image src="/images/filter.svg" alt="Filter" width={16} height={16} />
        </button>
      </div>

      {/* ===== Main Layout ===== */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* ===== Sidebar ===== */}
        <aside
          className={`w-full shrink-0 lg:w-72 ${isFilterOpenMobile ? 'block' : 'hidden'} lg:block`}
        >
          {/* Title */}
          <div className="mb-6 flex items-center">
            <Image
              src="/images/filter.svg"
              alt="Filter"
              width={24}
              height={24}
            />
            <h3 className="font-aria pr-2 text-[20px] font-bold">فیلترها</h3>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <div
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex cursor-pointer items-center justify-between rounded-md bg-[#f2f2f2] px-4 py-3"
            >
              <h3 className="font-aria text-sm font-bold">تمام محصولات</h3>
              <div
                className={`transition ${isCategoryOpen ? 'rotate-180' : ''}`}
              >
                <Image
                  src="/images/dropdown.svg"
                  alt="Arrow"
                  width={14}
                  height={12}
                />
              </div>
            </div>

            {isCategoryOpen && (
              <div className="space-y-3 rounded-xl p-4">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg bg-white px-3 py-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={category.iconPath}
                        alt=""
                        width={20}
                        height={20}
                      />
                      <span className="text-sm font-bold">{category.name}</span>
                    </div>
                    <input type="checkbox" className="h-4 w-4 accent-black" />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="mt-6">
            <div
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="flex cursor-pointer items-center justify-between rounded-md bg-[#f2f2f2] px-4 py-3"
            >
              <h3 className="text-sm font-bold">بازه قیمت</h3>
              <div className={`transition ${isPriceOpen ? 'rotate-180' : ''}`}>
                <Image
                  src="/images/dropdown.svg"
                  alt="Arrow"
                  width={14}
                  height={12}
                />
              </div>
            </div>

            {isPriceOpen && (
              <div className="mt-4 space-y-4 bg-white p-4">
                <PriceRangeSlider />

                <div className="flex justify-between">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(+e.target.value)}
                    className="w-24 rounded-md bg-[#f2f2f2] px-2 py-1 text-center"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(+e.target.value)}
                    className="w-24 rounded-md bg-[#f2f2f2] px-2 py-1 text-center"
                  />
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 rounded-md bg-black py-2 text-sm font-bold text-white">
                    اعمال فیلتر
                  </button>
                  <button
                    onClick={() => {
                      setMinPrice(100)
                      setMaxPrice(1000)
                    }}
                    className="flex-1 rounded-md bg-gray-200 py-2 text-sm font-bold"
                  >
                    حذف
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ===== Products Grid ===== */}
        <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Page
