'use client'

import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const ProductCategorySection = () => {
  const { categories } = useCategories()
  const router = useRouter()

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/products?categoryId=${categoryId}`)
  }

  return (
    <div className="container pb-12">
      <div className="text-color-title-on-light flex flex-wrap items-center justify-center gap-4 gap-y-14 md:gap-17">
        {categories.map((category) => (
          <div
            key={category.id}
            className="h-26.75 w-23 cursor-pointer"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-[#E9E9E8] text-center">
              <Image
                src={category.iconPath}
                alt={category.name}
                width={32}
                height={32}
                className="h-8 w-8"
                loading="lazy"
                style={{ width: '32px', height: '32px' }}
              />
            </div>
            <h1 className="font-ray mt-2 text-center text-base font-medium">
              {category.name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductCategorySection
