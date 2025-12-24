'use client'
import { useState } from 'react'
import { useProducts } from '@/features/shop/hooks/products/useProducts'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import Product from '@/components/layout/Product'
import Image from 'next/image'
import PriceRangeSlider from '@/components/domain/shop/product/PriceRangeSlider'

const page = () => {
  const { products, loading, error } = useProducts()
  const [isOpen, setIsOpen] = useState(true)

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [isPriceOpen, setIsPriceOpen] = useState(false)

  const { categories } = useCategories()

  const toggleDropdown = () => setIsOpen(!isOpen)

  if (loading) return <div>در حال بارگذاری محصولات...</div>
  if (error) return <div>خطا در بارگذاری محصولات: {error}</div>

  return (
    <section className="mx-10 py-20">
      {/* ===== Header ===== */}
      <div className="mb-10 flex flex-col items-center text-center">
        <h1 className="font-aria text-color-title-on-light max-w-[532px] text-[54px] leading-16 font-extrabold">
          کالای دلخواهت را همین حالا پیدا کن
        </h1>

        {/* Search Bar */}
        <div className="relative mt-8 w-[469px]">
          <div className="absolute top-1/2 left-4 flex h-[46px] w-[46px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm">
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
            className="font-ray text-color-body-on-dark focus:ring-color-accent h-[65px] w-full rounded-2xl bg-[#f2f2f2] pr-5 pl-[50px] text-[16px] font-bold transition outline-none focus:bg-white focus:ring-2"
          />
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex gap-10">
        {/* ===== Sidebar Filters ===== */}
        <div className="w-72 shrink-0">
          <div className="mb-6 flex items-center rounded-2xl py-3">
            <Image
              src="/images/filter.svg"
              alt="Filter Icon"
              width={24}
              height={24}
            />
            <h3 className="font-aria text-color-title-on-light pr-2 text-[20px] font-bold">
              فیلترها
            </h3>
          </div>

          {/* Future filters (checkboxes, ranges, etc.) */}
          <div className="space-y-4">
            {/* Dropdown Filter */}
            <div
              onClick={toggleDropdown}
              className="mb-2 flex cursor-pointer items-center justify-between rounded-[5px] bg-[#f2f2f2f2] px-4 py-3 transition"
            >
              <h3 className="font-aria text-color-title-on-light text-[14px] font-bold">
                تمام محصولات
              </h3>
              <div
                className={`transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              >
                <Image
                  src="/images/dropdown.svg"
                  alt="Arrow"
                  width={14}
                  height={12}
                />
              </div>
            </div>

            {/* Checkbox List */}
            {isOpen && (
              <div className="space-y-3 rounded-2xl p-4">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg bg-white px-3 py-2 transition hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={category.iconPath}
                        alt="Check"
                        width={20}
                        height={20}
                      />
                      <span className="font-aria text-color-body-on-light text-sm font-bold">
                        {category.name}
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer appearance-none rounded-sm border-2 border-black checked:border-black checked:bg-black"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* ===== Toggle for In-Stock Items ===== */}
          <div className="mt-4 flex items-center justify-between rounded-[5px] px-4 py-3">
            <span className="font-aria text-color-title-on-light text-[14px] font-bold">
              نمایش کالاهای موجود
            </span>

            {/* Toggle */}
            <label className="relative inline-flex h-5 w-10 cursor-pointer">
              <input type="checkbox" className="peer sr-only" />
              {/* Track */}
              <div className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-black"></div>
              {/* Knob */}
              <div className="pointer-events-none absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-md transition peer-checked:translate-x-[18px]"></div>
            </label>
          </div>

          {/* ===== Price Range Dropdown ===== */}
          <div className="mt-4 space-y-2">
            <div
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="mb-2 flex cursor-pointer items-center justify-between rounded-[5px] bg-[#f2f2f2] px-4 py-3 transition"
            >
              <h3 className="font-aria text-color-title-on-light text-[14px] font-bold">
                بازه قیمت
              </h3>
              <div
                className={`transition-transform ${isPriceOpen ? 'rotate-180' : 'rotate-0'}`}
              >
                <Image
                  src="/images/dropdown.svg"
                  alt="Arrow"
                  width={14}
                  height={12}
                />
              </div>
            </div>

            {isPriceOpen && (
              <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                {/* Price Range Labels */}
                <div className="font-aria text-color-body-on-light flex justify-between text-sm font-bold">
                  <span>{priceRange[0]} تومان</span>
                  <span>{priceRange[1]} تومان</span>
                </div>

                {/* Slider */}
                <PriceRangeSlider />
              </div>
            )}
          </div>
        </div>

        {/* ===== Product Grid (3 columns) ===== */}
        <div className="grid flex-1 grid-cols-3 gap-6">
          {/* Example Product Cards */}
          {products.map((product) => (
            <Product product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default page
