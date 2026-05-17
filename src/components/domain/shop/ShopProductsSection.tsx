'use client'

import { useEffect, useRef, useState } from 'react'
import ProductSwiper from '@/components/layout/ProductSwiper'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import { useProductsPreview } from '@/features/shop/hooks/products/useProductsPreview'
import { ProductSummary } from '@/features/shop/shop.types'

interface Props {
  title: string
  description: string
  products?: ProductSummary[]
}

const ShopProductsSection = ({
  title,
  description,
  products: propProducts,
}: Props) => {
  const { productsPreview } = useProductsPreview()
  const { categories } = useCategories()
  const products = propProducts || productsPreview
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className="container mt-20 flex flex-col lg:mt-28">
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

      <div className="flex items-center justify-center">
        {isVisible ? (
          <ProductSwiper products={products} categories={categories} />
        ) : (
          <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200" />
        )}
      </div>
    </div>
  )
}

export default ShopProductsSection
