'use client'

import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import Image from 'next/image'

const ProductCategorySection = () => {
  const { categories } = useCategories()

  return (
    <div className="container mt-20 mb-12">
      <div className="text-center">
        <h1 className="font-aria text-color-title-on-light text-[32px] font-extrabold xl:text-[40px]">
          دسته بندی محصولات
        </h1>
        <p className="font-ray font-regular text-color-body-on-light text-sm xl:text-base">
          سالم‌ترین و ارگانیک‌ترین انتخاب‌ها، با دقت برای شما آماده شده‌اند
        </p>
      </div>
      <div className="text-color-title-on-light mt-8 flex flex-wrap items-center justify-center gap-17">
        {categories.map((category) => (
          <div key={category.id} className="h-26.75 w-23 cursor-pointer">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-[#E9E9E8] text-center">
              <Image
                src={category.iconPath}
                alt={category.name}
                width={32}
                height={32}
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
