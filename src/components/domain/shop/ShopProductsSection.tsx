'use client'

import Product from '@/components/layout/Product'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import { useProducts } from '@/features/shop/hooks/products/useProducts'

interface Props {
  title: string
  description: string
}

const ShopProductsSection = ({ title, description }: Props) => {
  const { products, loading, error } = useProducts()
  const { categories } = useCategories()

  if (loading) return <div>در حال بارگذاری محصولات...</div>
  if (error) return <div>خطا در بارگذاری محصولات: {error}</div>

  return (
    <div className="mt-28 flex flex-col">
      {/* only this block is centered */}
      <div className="text-color-title-on-light flex w-full flex-wrap items-center justify-between text-right">
        {/* Right: Title & Paragraph */}
        <div className="flex max-w-xl flex-col items-start">
          <h1 className="font-aria text-color-title-on-light mt-3 text-[30px] font-extrabold">
            {title}
          </h1>
          <p className="font-ray font-regular text-color-body-on-light mt-1 text-[16px]">
            {description}
          </p>
        </div>

        {/* Left: Categories */}
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex h-[46px] w-[122px] items-center justify-center rounded-full bg-[#D9D9D9] px-4"
            >
              <span className="font-aria text-color-body-on-light text-[16px] font-bold">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* slider below, full width */}
      <div className="mt-8 grid w-full grid-cols-1 items-center justify-between gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ShopProductsSection
