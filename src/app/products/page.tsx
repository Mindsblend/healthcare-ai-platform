'use client'

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { useProductsPreview } from '@/features/shop/hooks/products/useProductsPreview'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'

import Product from '@/components/layout/Product'
import PriceRangeSlider from '@/components/domain/shop/product/PriceRangeSlider'
import LoadingBar from '@/components/layout/LoadingBar'
import Pagination from '@/components/domain/dashboard/tables/Pagination'

/* =========================================================
   Constants & types
========================================================== */

const PRICE_MIN = 0
const PRICE_MAX = 1_000_000
const ITEMS_PER_PAGE = 9

// زیر sm (۶۴۰px) لیست افقی، از sm به بالا گرید کارتی
const MOBILE_QUERY = '(max-width: 639px)'

type SortKey = 'default' | 'price-asc' | 'price-desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'default', label: 'پیش‌فرض' },
  { key: 'price-asc', label: 'ارزان‌ترین' },
  { key: 'price-desc', label: 'گران‌ترین' },
]

type PriceRange = { min: number; max: number }

const fmt = (n: number) => n.toLocaleString('fa-IR')

/* =========================================================
   Small helpers
========================================================== */

function useIsMobile() {
  const subscribe = useCallback((onChange: () => void) => {
    const mql = window.matchMedia(MOBILE_QUERY)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  )
}

/* ---------------------------------- Icons --------------------------------- */

function SortIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" />
    </svg>
  )
}

function CloseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

/* ---------------------------------- Chips --------------------------------- */

function Chip({
  active,
  size = 'md',
  onClick,
  children,
}: {
  active?: boolean
  size?: 'md' | 'sm'
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`font-ray flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border font-medium whitespace-nowrap transition ${
        size === 'sm' ? 'h-9 px-3.5 text-[13px]' : 'h-10 px-4 text-sm'
      } ${
        active
          ? 'border-black bg-black text-white'
          : 'border-gray-200 bg-white text-black hover:border-gray-400'
      }`}
    >
      {children}
    </button>
  )
}

function RemovableChip({
  label,
  onRemove,
  className = '',
}: {
  label: string
  onRemove: () => void
  className?: string
}) {
  return (
    <span
      className={`font-ray inline-flex h-8 items-center gap-1.5 rounded-full bg-[#f2f2f2] pr-3 pl-1.5 text-xs font-medium text-black ${className}`}
    >
      {label}

      <button
        type="button"
        onClick={onRemove}
        aria-label={`حذف ${label}`}
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-300 hover:text-black"
      >
        <CloseIcon size={12} />
      </button>
    </span>
  )
}

/* ------------------------------- Bottom sheet ------------------------------ */

function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  // قفل اسکرول صفحه وقتی شیت بازه
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  // بستن با Escape
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${
        open
          ? 'visible'
          : 'invisible transition-[visibility] delay-300 duration-0'
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h3 className="font-aria text-color-title-on-light text-[18px] font-bold">
            {title}
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#f2f2f2] text-gray-500 transition hover:bg-gray-200"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4">{children}</div>

        {footer && (
          <div className="border-t border-gray-100 bg-white px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------ Filter section ----------------------------- */

function FilterSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mt-4 first:mt-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between rounded-md bg-[#f2f2f2] px-4 py-3"
      >
        <h3 className="font-aria text-color-title-on-light text-sm font-bold">
          {title}
        </h3>

        <span className={`transition ${open ? 'rotate-180' : ''}`}>
          <Image src="/images/dropdown.svg" alt="" width={14} height={12} />
        </span>
      </button>

      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

/* -------------------------------- Empty state ------------------------------- */

function EmptyState({
  message,
  suggestion,
  onReset,
}: {
  message: string
  suggestion: string
  onReset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 rounded-full bg-gray-100 p-6">
        <svg
          className="h-14 w-14 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 className="font-aria mb-3 text-xl font-bold text-gray-800 sm:text-2xl">
        {message}
      </h3>

      <p className="font-ray mb-8 text-sm text-gray-500 sm:text-base">
        {suggestion}
      </p>

      <button
        type="button"
        onClick={onReset}
        className="font-ray cursor-pointer rounded-full bg-black px-8 py-3 text-white transition hover:bg-gray-800"
      >
        حذف همه فیلترها
      </button>
    </div>
  )
}

/* =========================================================
   Page content
========================================================== */

function ProductsContent() {
  const { productsPreview, loading, error } = useProductsPreview()
  const { categories } = useCategories()

  const searchParams = useSearchParams()
  const router = useRouter()
  const isMobile = useIsMobile()

  // جستجو از ناوبار میاد (?q=...)
  const query = (searchParams.get('q') ?? '').trim()
  const categoryIdParam = searchParams.get('categoryId')

  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortKey>('default')

  // دسته‌بندی‌ها: با کلیک فوراً اعمال می‌شن
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(
    () => new Set(),
  )

  // قیمت: draft (داخل اسلایدر) و applied (بعد از زدن «اعمال فیلتر»)
  const [minPrice, setMinPrice] = useState(PRICE_MIN)
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)
  const [appliedPrice, setAppliedPrice] = useState<PriceRange | null>(null)

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const closeFilter = useCallback(() => setIsFilterOpen(false), [])
  const closeSort = useCallback(() => setIsSortOpen(false), [])

  // =========================================================
  // Sync URL → state
  // =========================================================
  useEffect(() => {
    const id = categoryIdParam ? parseInt(categoryIdParam, 10) : NaN

    setSelectedCategoryIds(Number.isNaN(id) ? new Set() : new Set([id]))
    setPage(1)
  }, [categoryIdParam])

  useEffect(() => {
    setPage(1)
  }, [query])

  // =========================================================
  // Filter + sort
  // =========================================================
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase()

    const list = productsPreview.filter((product) => {
      if (
        selectedCategoryIds.size > 0 &&
        !selectedCategoryIds.has(product.categoryId)
      ) {
        return false
      }

      if (
        appliedPrice &&
        (product.price < appliedPrice.min || product.price > appliedPrice.max)
      ) {
        return false
      }

      if (
        normalizedQuery &&
        !product.title?.toLowerCase().includes(normalizedQuery)
      ) {
        return false
      }

      return true
    })

    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)

    return list
  }, [productsPreview, selectedCategoryIds, appliedPrice, query, sortBy])

  // =========================================================
  // Pagination
  // =========================================================
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const currentData = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  )

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // =========================================================
  // Derived UI values
  // =========================================================
  const selectedCategories = useMemo(
    () => categories.filter((category) => selectedCategoryIds.has(category.id)),
    [categories, selectedCategoryIds],
  )

  const activeFilterCount = selectedCategoryIds.size + (appliedPrice ? 1 : 0)

  const currentSortLabel =
    SORT_OPTIONS.find((option) => option.key === sortBy)?.label ?? ''

  const countText = `${fmt(filteredProducts.length)} کالا`

  const subtitle =
    loading || error
      ? '\u00A0'
      : query
        ? `نتایج جستجو برای «${query}» · ${countText}`
        : countText

  // =========================================================
  // Actions
  // =========================================================
  const updateUrl = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())
    mutate(params)

    const qs = params.toString()
    router.push(qs ? `/products?${qs}` : '/products')
  }

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev)

      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }

      return next
    })

    setPage(1)
  }

  const openFilter = () => {
    // draft رو با فیلتر اعمال‌شده هماهنگ کن
    setMinPrice(appliedPrice?.min ?? PRICE_MIN)
    setMaxPrice(appliedPrice?.max ?? PRICE_MAX)
    setIsFilterOpen(true)
  }

  const applyPrice = () => {
    const low = Math.max(PRICE_MIN, Math.min(minPrice, maxPrice))
    const high = Math.min(PRICE_MAX, Math.max(minPrice, maxPrice))

    setMinPrice(low)
    setMaxPrice(high)

    setAppliedPrice(
      low === PRICE_MIN && high === PRICE_MAX ? null : { min: low, max: high },
    )

    setPage(1)
    setIsFilterOpen(false)
  }

  const clearPrice = () => {
    setMinPrice(PRICE_MIN)
    setMaxPrice(PRICE_MAX)
    setAppliedPrice(null)
    setPage(1)
  }

  const resetFilters = () => {
    setSelectedCategoryIds(new Set())
    clearPrice()
    setIsFilterOpen(false)

    if (categoryIdParam) {
      updateUrl((params) => params.delete('categoryId'))
    }
  }

  // فیلترها + جستجو (برای دکمه‌ی صفحه‌ی خالی)
  const resetAll = () => {
    setSelectedCategoryIds(new Set())
    clearPrice()
    setIsFilterOpen(false)

    router.push('/products')
  }

  const selectSort = (key: SortKey) => {
    setSortBy(key)
    setPage(1)
    setIsSortOpen(false)
  }

  // =========================================================
  // Empty state message
  // =========================================================
  const getEmptyContent = () => {
    if (query) {
      return {
        message: `نتیجه‌ای برای جستجوی "${query}" یافت نشد`,
        suggestion: 'لطفاً عبارت دیگری را جستجو کنید یا فیلترها را حذف کنید.',
      }
    }

    if (selectedCategories.length > 0) {
      return {
        message: `محصولی در دسته ${selectedCategories
          .map((category) => category.name)
          .join(' و ')} یافت نشد`,
        suggestion:
          'لطفاً دسته‌بندی دیگری را انتخاب کنید یا فیلترها را حذف کنید.',
      }
    }

    if (appliedPrice) {
      return {
        message: `محصولی در بازه قیمتی ${fmt(appliedPrice.min)} تا ${fmt(
          appliedPrice.max,
        )} تومان یافت نشد`,
        suggestion:
          'لطفاً بازه قیمتی دیگری را انتخاب کنید یا فیلترها را حذف کنید.',
      }
    }

    return {
      message: 'محصولی یافت نشد',
      suggestion: 'لطفاً فیلترهای دیگری را امتحان کنید یا بعداً مراجعه کنید.',
    }
  }

  // =========================================================
  // Shared filter content (sidebar دسکتاپ + شیت موبایل)
  // =========================================================
  const renderFilters = (showPriceActions: boolean) => (
    <>
      <FilterSection title="دسته‌بندی محصولات">
        <div className="space-y-1">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Image src={category.iconPath} alt="" width={20} height={20} />

                <span className="text-color-title-on-light text-sm font-bold">
                  {category.name}
                </span>
              </div>

              <input
                type="checkbox"
                className="h-4 w-4 accent-black"
                checked={selectedCategoryIds.has(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="بازه قیمت">
        <div className="text-color-title-on-light space-y-4 px-1">
          <PriceRangeSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={(min, max) => {
              setMinPrice(min)
              setMaxPrice(max)
            }}
          />

          <p className="font-ray text-center text-xs text-gray-500">
            از {fmt(minPrice)} تا {fmt(maxPrice)} تومان
          </p>

          <div className="flex justify-between gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="font-aria w-24 rounded-md bg-[#f2f2f2] px-2 pt-2 pb-1 text-center font-semibold"
            />

            <input
              type="number"
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="font-aria w-24 rounded-md bg-[#f2f2f2] px-2 pt-2 pb-1 text-center font-semibold"
            />
          </div>

          {showPriceActions && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={applyPrice}
                className="flex-1 cursor-pointer rounded-md bg-black py-2 text-sm font-bold text-white"
              >
                اعمال فیلتر
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 cursor-pointer rounded-md bg-gray-200 py-2 text-sm font-bold"
              >
                حذف همه
              </button>
            </div>
          )}
        </div>
      </FilterSection>
    </>
  )

  const emptyContent = getEmptyContent()

  return (
    <div className="sm:pb-10">
      <section className="container-wide pt-4 pb-6 sm:pt-6 lg:pt-8">
        {/* =========================================================
            HEADING (+ sort روی دسکتاپ)
        ========================================================== */}
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-aria text-color-title-on-light text-2xl font-extrabold sm:text-3xl">
              محصولات
            </h1>

            <p className="font-ray mt-1 truncate text-sm text-gray-500">
              {subtitle}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <span className="font-ray ml-1 text-sm text-gray-500">
              مرتب‌سازی:
            </span>

            {SORT_OPTIONS.map((option) => (
              <Chip
                key={option.key}
                size="sm"
                active={sortBy === option.key}
                onClick={() => selectSort(option.key)}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* =========================================================
            MOBILE / TABLET TOOLBAR (sticky chips)
        ========================================================== */}
        <div className="sticky top-0 z-30 mt-4 border-b border-gray-100 bg-white lg:hidden">
          <div className="flex [scrollbar-width:none] items-center gap-2 overflow-x-auto py-2.5 [&::-webkit-scrollbar]:hidden">
            <Chip onClick={openFilter}>
              <Image src="/images/filter.svg" alt="" width={18} height={18} />
              فیلتر
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] leading-none font-bold text-white">
                  {fmt(activeFilterCount)}
                </span>
              )}
            </Chip>

            <Chip
              active={sortBy !== 'default'}
              onClick={() => setIsSortOpen(true)}
            >
              <SortIcon />
              {sortBy === 'default' ? 'مرتب‌سازی' : currentSortLabel}
            </Chip>

            <span
              aria-hidden="true"
              className="mx-1 h-6 w-px shrink-0 bg-gray-200"
            />

            {categories.map((category) => (
              <Chip
                key={category.id}
                active={selectedCategoryIds.has(category.id)}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </Chip>
            ))}
          </div>
        </div>

        {/* =========================================================
            CONTENT
        ========================================================== */}
        <div className="mt-6 flex gap-8 lg:gap-10">
          {/* ---------------- Desktop sidebar ---------------- */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-6">
              <div className="mb-6 flex items-center">
                <Image src="/images/filter.svg" alt="" width={24} height={24} />

                <h2 className="font-aria text-color-title-on-light pr-2 text-[20px] font-bold">
                  فیلترها
                </h2>
              </div>

              {renderFilters(true)}
            </div>
          </aside>

          {/* ---------------- Products ---------------- */}
          <div className="min-w-0 flex-1">
            {/* Applied filters */}
            {(selectedCategories.length > 0 || appliedPrice) && (
              <div
                className={`mb-4 flex flex-wrap items-center gap-2 ${
                  appliedPrice ? '' : 'max-lg:hidden'
                }`}
              >
                {selectedCategories.map((category) => (
                  <RemovableChip
                    key={category.id}
                    label={category.name}
                    onRemove={() => toggleCategory(category.id)}
                    className="max-lg:hidden"
                  />
                ))}

                {appliedPrice && (
                  <RemovableChip
                    label={`قیمت: ${fmt(appliedPrice.min)} تا ${fmt(
                      appliedPrice.max,
                    )} تومان`}
                    onRemove={clearPrice}
                  />
                )}

                <button
                  type="button"
                  onClick={resetFilters}
                  className="font-ray cursor-pointer px-1 text-xs font-medium text-red-600 hover:underline"
                >
                  حذف همه
                </button>
              </div>
            )}

            <LoadingBar loading={loading} error={error}>
              {currentData.length === 0 ? (
                <EmptyState
                  message={emptyContent.message}
                  suggestion={emptyContent.suggestion}
                  onReset={resetAll}
                />
              ) : isMobile ? (
                <div className="flex flex-col">
                  {currentData.map((product) => (
                    <Product key={product.id} product={product} variant="row" />
                  ))}
                </div>
              ) : (
                <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-3">
                  {currentData.map((product) => (
                    <Product key={product.id} product={product} />
                  ))}
                </div>
              )}
            </LoadingBar>
          </div>
        </div>
      </section>

      {/* =========================================================
          PAGINATION
      ========================================================== */}
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* =========================================================
          FILTER SHEET (mobile / tablet)
      ========================================================== */}
      <BottomSheet
        open={isFilterOpen}
        onClose={closeFilter}
        title="فیلترها"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={applyPrice}
              className="font-ray h-12 flex-1 cursor-pointer rounded-full bg-black text-sm font-bold text-white"
            >
              اعمال فیلتر
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="font-ray h-12 flex-1 cursor-pointer rounded-full bg-[#f2f2f2] text-sm font-bold text-black"
            >
              حذف همه
            </button>
          </div>
        }
      >
        {renderFilters(false)}
      </BottomSheet>

      {/* =========================================================
          SORT SHEET (mobile / tablet)
      ========================================================== */}
      <BottomSheet open={isSortOpen} onClose={closeSort} title="مرتب‌سازی">
        <ul className="pb-4">
          {SORT_OPTIONS.map((option) => {
            const isSelected = sortBy === option.key

            return (
              <li key={option.key}>
                <button
                  type="button"
                  onClick={() => selectSort(option.key)}
                  className={`font-ray flex w-full cursor-pointer items-center justify-between border-b border-gray-100 py-4 text-[15px] ${
                    isSelected ? 'font-bold text-black' : 'text-gray-600'
                  }`}
                >
                  {option.label}
                  {isSelected && <CheckIcon />}
                </button>
              </li>
            )
          })}
        </ul>
      </BottomSheet>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  )
}
