'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import CollectionSwiper from '@/components/layout/CollectionSwiper'
import { CollectionSummary } from '@/features/shop/shop.types'

interface ShopBundleProps {
  collections: CollectionSummary[]
}

const ShopBundle = ({ collections }: ShopBundleProps) => {
  const { categories } = useCategories()
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)

  const hasCategories = Boolean(categories?.length)

  const activeCategoryName = useMemo(() => {
    if (!activeCategoryId || !categories) return null
    const category = categories.find((c) => c.id === activeCategoryId)
    return category?.name || null
  }, [activeCategoryId, categories])

  const filteredCollections = useMemo(() => {
    if (!activeCategoryId) return collections
    return collections.filter(
      (collection) => collection.categoryId === activeCategoryId,
    )
  }, [collections, activeCategoryId])

  if (!collections.length) return null

  return (
    <div className="relative container mt-12.5 sm:mt-20">
      <div className="bg-section relative h-105 w-full rounded-3xl px-6 py-10 sm:py-12 md:h-142.5 md:px-24">
        <Image
          src="/images/discount.svg"
          alt="discount image"
          width={700}
          height={200}
          className="absolute right-0"
        />
        <Image
          src="/images/discount.svg"
          alt="discount image"
          width={700}
          height={200}
          className="absolute left-0 rotate-180"
        />
        <h1 className="text-color-title-on-dark font-aria text-center text-2xl font-extrabold sm:text-3xl">
          تخفیفات ویژه
        </h1>
        <div className="absolute top-[25%] left-1/2 z-50 w-[calc(100%-40px)] max-w-300 -translate-x-1/2 rounded-3xl bg-white p-3 outline-10 outline-[#C9C9C94D] sm:p-5 md:top-32">
          <div className="flex flex-wrap gap-3 px-5 sm:gap-5 lg:flex-col lg:items-center lg:justify-center">
            <div className="flex flex-wrap items-center gap-5">
              <h1 className="font-aria text-color-title-on-light text-base font-bold sm:text-xl">
                دسته بندی ها
              </h1>
              {hasCategories && (
                <div className="hidden gap-5 lg:flex">
                  <div
                    onClick={() => setActiveCategoryId(null)}
                    className={`flex cursor-pointer items-center justify-center rounded-full px-4 transition ${
                      activeCategoryId === null
                        ? 'bg-black text-white'
                        : 'bg-[#D9D9D9] text-black'
                    }`}
                  >
                    <span className="font-aria text-[16px] font-bold">همه</span>
                  </div>

                  {categories!.map((category) => (
                    <div
                      key={category.id}
                      onClick={() =>
                        setActiveCategoryId(
                          activeCategoryId === category.id ? null : category.id,
                        )
                      }
                      className={`flex h-11.5 w-30 cursor-pointer items-center justify-center rounded-full px-4 transition ${
                        activeCategoryId === category.id
                          ? 'bg-black text-white'
                          : 'bg-[#D9D9D9] text-black'
                      }`}
                    >
                      <span className="font-aria text-[16px] font-bold">
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="category-menu-container relative block lg:hidden">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="secondary-btn flex items-center justify-center gap-1 rounded-full border border-black bg-black px-4 py-2 font-medium whitespace-nowrap text-white"
              >
                <Image
                  src="/public/images/discover_tune.svg"
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
                <div className="absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
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
                            activeCategoryId === category.id
                              ? null
                              : category.id,
                          )
                          setIsCategoryMenuOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-right transition-colors ${
                          activeCategoryId === category.id
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="block font-medium">
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="px-4">
            <hr className="my-3 w-full border border-[#E9E9E8] sm:my-4" />
          </div>
          {filteredCollections.length > 0 ? (
            <CollectionSwiper collections={filteredCollections} />
          ) : (
            <div className="mt-8 flex w-full flex-col items-center justify-center py-24 text-center sm:py-32 lg:py-40">
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
                  ? `مجموعه‌ای در دسته ${activeCategoryName} یافت نشد`
                  : 'مجموعه‌ای یافت نشد'}
              </h3>
              <p className="text-gray-500">
                لطفاً دسته‌بندی دیگری را انتخاب کنید.
              </p>
              <button
                onClick={() => setActiveCategoryId(null)}
                className="mt-6 cursor-pointer rounded-full bg-black px-6 py-2 text-white transition hover:bg-gray-800"
              >
                مشاهده همه مجموعه‌ها
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopBundle
