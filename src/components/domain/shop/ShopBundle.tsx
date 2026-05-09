'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import { useProductsPreview } from '@/features/shop/hooks/products/useProductsPreview'
import BundleSwiper from '@/components/layout/BundleSwiper'

const ShopBundle = () => {
  const { productsPreview, loading, error } = useProductsPreview()
  const { categories } = useCategories()

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)

  const hasCategories = Boolean(categories?.length)

  const filteredProducts = useMemo(() => {
    if (!activeCategoryId) return productsPreview
    return productsPreview.filter(
      (product) => product.categoryId === activeCategoryId,
    )
  }, [productsPreview, activeCategoryId])

  if (!filteredProducts.length) return null

  return (
    <div className="relative container mt-20 pb-52 lg:mt-28">
      <div className="bg-section relative h-[420px] w-full rounded-3xl px-6 py-12 md:h-[570px] md:px-24">
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
        <h1 className="text-color-title-on-dark font-aria text-center text-3xl font-extrabold">
          تخفیفات ویژه
        </h1>
        <div className="absolute top-[60%] left-1/2 z-50 w-[92%] max-w-[1200px] -translate-x-1/2 rounded-3xl bg-white px-5 py-4 outline-10 outline-[#C9C9C94D] sm:w-[95%] sm:px-8 sm:pt-8 sm:pb-4 md:top-32 md:w-full">
          <div className="flex flex-col items-center justify-center px-5">
            <div className="flex flex-wrap space-x-[69px]">
              <h1 className="font-aria text-color-title-on-light text-xl font-bold">
                دسته بندی ها
              </h1>
              {categories!.map((category) => (
                <div
                  key={category.id}
                  onClick={() =>
                    setActiveCategoryId(
                      activeCategoryId === category.id ? null : category.id,
                    )
                  }
                  className={`flex items-center justify-center ${
                    activeCategoryId === category.id
                      ? 'font-bold text-black'
                      : 'text-color-body-on-light'
                  } `}
                >
                  <span className="font-ray cursor-pointer text-xl">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
            <hr className="my-7 w-full border border-[#E9E9E8]" />
          </div>
          <BundleSwiper />
        </div>
      </div>
    </div>
  )
}

export default ShopBundle
