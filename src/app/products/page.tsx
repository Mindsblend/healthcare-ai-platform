// src/app/products/page.tsx

'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useProductsPreview } from '@/features/shop/hooks/products/useProductsPreview'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import Product from '@/components/layout/Product'
import PriceRangeSlider from '@/components/domain/shop/product/PriceRangeSlider'
import LoadingBar from '@/components/layout/LoadingBar'
import Pagination from '@/components/domain/dashboard/tables/Pagination'

function ProductsContent() {
  const { productsPreview, loading, error } = useProductsPreview()
  const { categories } = useCategories()
  const searchParams = useSearchParams()

  const [page, setPage] = useState<number>(1)

  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [isPriceOpen, setIsPriceOpen] = useState(true)

  // On mobile/tablet this now controls the bottom-sheet filter panel
  const [isFilterOpenMobile, setIsFilterOpenMobile] = useState(false)

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

  // Lock body scroll while the mobile bottom sheet is open
  useEffect(() => {
    if (isFilterOpenMobile) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }
  }, [isFilterOpenMobile])

  const filteredProducts = useMemo(() => {
    return productsPreview.filter((product) => {
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
    productsPreview,
    appliedCategoryIds,
    appliedMinPrice,
    appliedMaxPrice,
    appliedSearchQuery,
  ])

  const itemsPerPage = 9
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages)

  const startIndex = (safePage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredProducts.slice(startIndex, endIndex)

  const appliedCategoryNames = useMemo(() => {
    if (appliedCategoryIds.size === 0) return []
    return categories
      .filter((cat) => appliedCategoryIds.has(cat.id))
      .map((cat) => cat.name)
  }, [appliedCategoryIds, categories])

  const activeFilterCount =
    appliedCategoryIds.size +
    (appliedMinPrice > 0 || appliedMaxPrice < 1_000_000 ? 1 : 0)

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
    setIsFilterOpenMobile(false)
  }

  const resetFilters = () => {
    setMinPrice(0)
    setMaxPrice(1_000_000)
    setActiveCategoryIds(new Set())
    setAppliedMinPrice(0)
    setAppliedMaxPrice(1_000_000)
    setAppliedCategoryIds(new Set())
    setSearchQuery('')
    setAppliedSearchQuery('')
    setIsFilterOpenMobile(false)
  }

  const EmptyState = () => {
    const hasCategories = appliedCategoryIds.size > 0
    const hasPrice = appliedMinPrice > 0 || appliedMaxPrice < 1_000_000
    const hasSearch = appliedSearchQuery !== ''

    let message = ''
    let suggestion = ''

    if (hasSearch) {
      message = `نتیجه‌ای برای جستجوی "${appliedSearchQuery}" یافت نشد`
      suggestion = 'لطفاً عبارت دیگری را جستجو کنید یا فیلترها را حذف کنید.'
    } else if (hasCategories && appliedCategoryNames.length > 0) {
      const categoryNames = appliedCategoryNames.join(' و ')
      message = `محصولی در دسته ${categoryNames} یافت نشد`
      suggestion =
        'لطفاً دسته‌بندی دیگری را انتخاب کنید یا فیلترها را حذف کنید.'
    } else if (hasPrice) {
      message = `محصولی در بازه قیمتی ${appliedMinPrice.toLocaleString('fa-IR')} تا ${appliedMaxPrice.toLocaleString('fa-IR')} تومان یافت نشد`
      suggestion =
        'لطفاً بازه قیمتی دیگری را انتخاب کنید یا فیلترها را حذف کنید.'
    } else {
      message = 'محصولی یافت نشد'
      suggestion = 'لطفاً فیلترهای دیگری را امتحان کنید یا بعداً مراجعه کنید.'
    }

    return (
      <div className="col-span-full min-h-screen flex w-full flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 rounded-full bg-gray-100 p-6">
          <svg
            className="h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-gray-800">{message}</h3>
        <p className="mb-8 text-gray-500">{suggestion}</p>
        <button
          onClick={resetFilters}
          className="cursor-pointer rounded-full bg-black px-8 py-3 text-white transition hover:bg-gray-800"
        >
          حذف همه فیلترها
        </button>
      </div>
    )
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // Shared filter content used both in the desktop sidebar and the mobile bottom sheet
  const filterContent = (
    <>
      <div className="space-y-4">
        <div
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="flex cursor-pointer items-center justify-between rounded-md bg-[#f2f2f2] px-4 py-3"
        >
          <h3 className="font-aria text-color-title-on-light text-sm font-bold">
            دسته‌بندی محصولات
          </h3>
          <div className={`transition ${isCategoryOpen ? 'rotate-180' : ''}`}>
            <Image
              src="/images/dropdown.svg"
              alt="Arrow"
              width={14}
              height={12}
            />
          </div>
        </div>

        {isCategoryOpen && (
          <div className="space-y-3 rounded-xl">
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
                حذف همه
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )

  return (
    <div className="pb-10">
      <section className="container-wide pt-15.5 pb-10 sm:pt-20.75 xl:pt-25">
        <div className="mb-10 flex flex-col items-center text-center xl:mb-25">
          <h1 className="font-aria text-color-title-on-light max-w-133 text-4xl leading-tight font-extrabold sm:text-[54px]">
            کالای دلخواهت را همین حالا پیدا کن
          </h1>

          <div className="mx-auto mt-8 flex w-full max-w-127.25 items-center gap-2.5">
            {/* Filter trigger — mobile & tablet only, sits to the right of the search bar */}
            <button
              type="button"
              onClick={() => setIsFilterOpenMobile(true)}
              className="font-ray relative flex h-16.25 w-20 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-2xl bg-[#f2f2f2] text-black transition hover:bg-gray-200 lg:hidden"
              aria-label="فیلترها"
            >
              <Image
                src="/images/filter.svg"
                alt="filter"
                width={22}
                height={22}
              />
              فیلتر
              {activeFilterCount > 0 && (
                <span className="font-ray absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {activeFilterCount.toLocaleString('fa-IR')}
                </span>
              )}
            </button>

            <div className="relative flex-1">
              <div
                onClick={() => setAppliedSearchQuery(searchQuery)}
                className="absolute top-1/2 left-3 flex h-11.5 w-11.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm sm:left-4"
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
                placeholder="جستجو محصول"
                id="search"
                name="search"
                className="font-ray text-color-body-on-light h-16.25 w-full rounded-2xl bg-[#f2f2f2] pr-5 text-[16px] font-bold transition outline-none focus:bg-white focus:ring-2 focus:ring-black"
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
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden w-72 shrink-0 lg:block">
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

            {filterContent}
          </aside>

          <div className="min-w-0 flex-1">
            <LoadingBar loading={loading} error={error}>
              {currentData.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {currentData.map((product) => (
                    <Product key={product.id} product={product} />
                  ))}
                </div>
              )}
            </LoadingBar>
          </div>
        </div>
      </section>

      {/* Mobile & tablet filter — iOS-style bottom sheet */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${isFilterOpenMobile ? '' : 'pointer-events-none'}`}
        aria-hidden={!isFilterOpenMobile}
      >
        <div
          onClick={() => setIsFilterOpenMobile(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
            isFilterOpenMobile ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isFilterOpenMobile ? 'translate-y-0' : 'translate-y-full'
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex justify-center pt-3">
            <span className="h-1.5 w-12 rounded-full bg-gray-300" />
          </div>

          <div className="flex items-center justify-between px-5 pt-4">
            <div className="flex items-center">
              <Image
                src="/images/filter.svg"
                alt="Filter"
                width={22}
                height={22}
              />
              <h3 className="font-aria text-color-title-on-light pr-2 text-[18px] font-bold">
                فیلترها
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpenMobile(false)}
              aria-label="بستن"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#f2f2f2] text-lg text-gray-500 transition hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto px-5 pt-4 pb-8">{filterContent}</div>
        </div>
      </div>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          در حال بارگذاری...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}
