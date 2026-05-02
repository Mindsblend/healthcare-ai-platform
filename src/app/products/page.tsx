'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useProducts } from '@/features/shop/hooks/products/useProducts'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import Product from '@/components/layout/Product'
import PriceRangeSlider from '@/components/domain/shop/product/PriceRangeSlider'

const Page = () => {
  const { products, loading, error } = useProducts()
  const { categories } = useCategories()
  const searchParams = useSearchParams()

  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [isPriceOpen, setIsPriceOpen] = useState(true)
  const [isFilterOpenMobile, setIsFilterOpenMobile] = useState(true)

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1_000_000)
  const [activeCategoryIds, setActiveCategoryIds] = useState<Set<number>>(
    () => new Set(),
  )

  const [appliedMinPrice, setAppliedMinPrice] = useState(0)
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(1_000_000)
  const [appliedCategoryIds, setAppliedCategoryIds] = useState<Set<number>>(
    () => new Set(),
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')

  // خواندن categoryId از URL هنگام بارگذاری اولیه
  useEffect(() => {
    const categoryIdFromUrl = searchParams.get('categoryId')
    if (categoryIdFromUrl) {
      const categoryId = parseInt(categoryIdFromUrl, 10)
      if (!isNaN(categoryId)) {
        const newSet = new Set([categoryId])
        setActiveCategoryIds(newSet)
        setAppliedCategoryIds(newSet)
      }
    }
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        appliedCategoryIds.size > 0 &&
        !appliedCategoryIds.has(product.categoryId)
      )
        return false

      if (product.price < appliedMinPrice || product.price > appliedMaxPrice)
        return false

      if (
        appliedSearchQuery &&
        !product.title?.toLowerCase().includes(appliedSearchQuery.toLowerCase())
      )
        return false

      return true
    })
  }, [
    products,
    appliedCategoryIds,
    appliedMinPrice,
    appliedMaxPrice,
    appliedSearchQuery,
  ])

  const toggleCategory = (categoryId: number) => {
    setActiveCategoryIds((prev) => {
      const next = new Set(prev)
      next.has(categoryId) ? next.delete(categoryId) : next.add(categoryId)
      return next
    })
  }

  const applyFilters = () => {
    setAppliedMinPrice(minPrice)
    setAppliedMaxPrice(maxPrice)
    setAppliedCategoryIds(new Set(activeCategoryIds))
  }

  const resetFilters = () => {
    setMinPrice(0)
    setMaxPrice(1_000_000)
    setActiveCategoryIds(new Set())
    setAppliedMinPrice(0)
    setAppliedMaxPrice(1_000_000)
    setAppliedCategoryIds(new Set())
  }

  if (loading) return <div>در حال بارگذاری محصولات...</div>
  if (error) return <div>خطا در بارگذاری محصولات: {error}</div>

  return (
    <section className="container-wide py-20">
      {/* ===== Header ===== */}
      <div className="mb-10 flex flex-col items-center text-center">
        <h1 className="font-aria text-color-title-on-light max-w-133 text-[36px] leading-tight font-extrabold sm:text-[54px]">
          کالای دلخواهت را همین حالا پیدا کن
        </h1>

        {/* Search */}
        <div className="relative mx-auto mt-8 w-full max-w-117.25 px-4 sm:px-0">
          <div
            onClick={() => setAppliedSearchQuery(searchQuery)}
            className="absolute top-1/2 left-4 flex h-11.5 w-11.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm"
          >
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
            className="font-ray text-color-body-on-light h-16.25 w-full rounded-2xl bg-[#f2f2f2] pr-5 pl-12.5 text-[16px] font-bold transition outline-none focus:bg-white focus:ring-2 focus:ring-black"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value
              setSearchQuery(value)
              if (value === '') setAppliedSearchQuery('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setAppliedSearchQuery(searchQuery)
            }}
          />
        </div>
      </div>

      {/* ===== Main Layout ===== */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* ===== Sidebar ===== */}
        <aside
          className={`w-full shrink-0 transition-all duration-300 ease-in-out lg:w-72 ${isFilterOpenMobile ? 'max-h-screen opacity-100' : 'max-h-0 overflow-hidden opacity-0'} lg:block lg:max-h-full lg:opacity-100`}
        >
          {/* Title */}
          <div className="mb-6 flex items-center">
            <Image
              src="/images/filter.svg"
              alt="Filter"
              width={24}
              height={24}
            />
            <h3 className="font-aria text-color-title-on-light pr-2 text-[20px] font-bold">
              فیلترها
            </h3>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <div
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex cursor-pointer items-center justify-between rounded-md bg-[#f2f2f2] px-4 py-3"
            >
              <h3 className="font-aria text-color-title-on-light text-sm font-bold">
                تمام محصولات
              </h3>
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
                      <span className="text-color-title-on-light text-sm font-bold">
                        {category.name}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-black"
                      checked={activeCategoryIds.has(category.id)}
                      onChange={() => toggleCategory(category.id)}
                    />
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
              <h3 className="text-color-title-on-light text-sm font-bold">
                بازه قیمت
              </h3>
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
              <div className="text-color-title-on-light mt-4 space-y-4 bg-white p-4">
                <PriceRangeSlider
                  min={0}
                  max={1_000_000}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onChange={(min, max) => {
                    setMinPrice(min)
                    setMaxPrice(max)
                  }}
                />

                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(+e.target.value)}
                    className="font-aria w-24 rounded-md bg-[#f2f2f2] px-2 pt-2 pb-1 text-center font-semibold"
                  />
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(+e.target.value)}
                    className="font-aria w-24 rounded-md bg-[#f2f2f2] px-2 pt-2 pb-1 text-center font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    className="flex-1 cursor-pointer rounded-md bg-black py-2 text-sm font-bold text-white"
                    onClick={applyFilters}
                  >
                    اعمال فیلتر
                  </button>
                  <button
                    className="flex-1 cursor-pointer rounded-md bg-gray-200 py-2 text-sm font-bold"
                    onClick={resetFilters}
                  >
                    حذف
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ===== Products Grid ===== */}
        <div className="grid-cols-[repeat(auto-fit,minmax(250px, 1fr))] grid flex-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Page
