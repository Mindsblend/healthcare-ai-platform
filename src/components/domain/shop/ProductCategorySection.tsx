'use client'

import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Rotates through a food-forward accent palette so each category reads as
// its own colorful chip instead of a flat gray icon. Add/remove/reorder
// freely — colors are assigned by position, not tied to a specific category.
const CATEGORY_ACCENT_CLASSES = [
  'bg-[#F0F0F1]', // leafy green
  'bg-[#F0F0F1]', // citrus orange
  'bg-[#F0F0F1]', // fresh blue
  'bg-[#F0F0F1]', // berry red
  'bg-[#F0F0F1]', // plum purple
  'bg-[#F0F0F1]', // herb teal
  'bg-[#F0F0F1]', // grain gold
  'bg-[#F0F0F1]', // cocoa brown
]

const chipClassName =
  'group flex w-20 shrink-0 cursor-pointer flex-col items-center gap-2.5 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:w-24'

const circleClassName =
  'flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 sm:h-[4.5rem] sm:w-[4.5rem] md:h-[62px] md:w-[62px]'

const labelClassName =
  'font-ray text-color-title-on-light text-center text-sm leading-tight font-medium'

const ProductCategorySection = () => {
  const { categories } = useCategories()
  const router = useRouter()

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/products?categoryId=${categoryId}`)
  }

  const handleAllProductsClick = () => {
    router.push('/products')
  }

  if (!categories?.length) return null

  return (
    <div className="sm:container max-sm:pr-6.25">
      <div className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto py-1 [-ms-overflow-style:none] sm:px-9 md:snap-none md:flex-wrap md:justify-between md:gap-x-6 md:gap-y-8 md:overflow-visible [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={handleAllProductsClick}
          className={chipClassName}
        >
          <span className={`${circleClassName} bg-black`}>
            <AllProductsIcon className="h-6 w-6 text-white" />
          </span>
          <span className={labelClassName}>همه محصولات</span>
        </button>

        {categories.map((category, index) => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategoryClick(category.id)}
            className={chipClassName}
          >
            <span
              className={`${circleClassName} ${CATEGORY_ACCENT_CLASSES[index % CATEGORY_ACCENT_CLASSES.length]}`}
            >
              <Image
                src={category.iconPath}
                alt=""
                width={24}
                height={24}
                loading="lazy"
                className="h-6 w-6 object-contain"
              />
            </span>
            <span className={labelClassName}>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const AllProductsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect
      x="13"
      y="3"
      width="8"
      height="8"
      rx="2"
      fill="currentColor"
      opacity="0.75"
    />
    <rect
      x="3"
      y="13"
      width="8"
      height="8"
      rx="2"
      fill="currentColor"
      opacity="0.75"
    />
    <rect
      x="13"
      y="13"
      width="8"
      height="8"
      rx="2"
      fill="currentColor"
      opacity="0.5"
    />
  </svg>
)

export default ProductCategorySection
