'use client'

import ProductSwiper from '@/components/layout/ProductSwiper'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import { useProductsPreview } from '@/features/shop/hooks/products/useProductsPreview'
import { ProductSummary } from '@/components/types/types'

interface Props {
  title: string
  description: string
  products?: ProductSummary[] // Optional: products passed from parent
}

const ShopProductsSection = ({
  title,
  description,
  products: propProducts,
}: Props) => {
  const { productsPreview, loading, error } = useProductsPreview()
  const { categories } = useCategories()

  // Use passed products if available, otherwise use fetched products
  const products = propProducts || productsPreview
  const isLoading = !propProducts && loading // Only show loading if fetching internally
  const hasError = !propProducts && error // Only show error if fetching internally

  // Show loading only when fetching internally (no products passed)
  if (isLoading) {
    return (
      <div className="container mt-20 flex flex-col lg:mt-28">
        <div className="text-color-title-on-light flex w-full flex-wrap items-center justify-between text-right">
          <div className="flex max-w-xl flex-col items-start">
            <h1 className="font-aria text-color-title-on-light mt-3 text-3xl font-extrabold xl:text-[40px]">
              {title}
            </h1>
            <p className="font-ray font-regular text-color-body-on-light mt-1 text-sm xl:text-base">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
            <p className="text-black">در حال بارگذاری محصولات...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error only when fetching internally
  if (hasError) {
    return (
      <div className="container mt-20 flex flex-col lg:mt-28">
        <div className="text-color-title-on-light flex w-full flex-wrap items-center justify-between text-right">
          <div className="flex max-w-xl flex-col items-start">
            <h1 className="font-aria text-color-title-on-light mt-3 text-3xl font-extrabold xl:text-[40px]">
              {title}
            </h1>
            <p className="font-ray font-regular text-color-body-on-light mt-1 text-sm xl:text-base">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <div className="mb-2 text-lg text-red-500">⚠️ خطا در بارگذاری</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Don't render if no products
  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="container mt-20 flex flex-col lg:mt-28">
      {/* only this block is centered */}
      <div className="text-color-title-on-light flex w-full flex-wrap items-center justify-between text-right">
        {/* Right: Title & Paragraph */}
        <div className="flex max-w-xl flex-col items-start">
          <h1 className="font-aria text-color-title-on-light mt-3 text-3xl font-extrabold xl:text-[40px]">
            {title}
          </h1>
          <p className="font-ray font-regular text-color-body-on-light mt-1 text-sm xl:text-base">
            {description}
          </p>
        </div>
      </div>

      {/* slider below, full width */}
      <div className="flex items-center justify-center">
        <ProductSwiper products={products} categories={categories} />
      </div>
    </div>
  )
}

export default ShopProductsSection
