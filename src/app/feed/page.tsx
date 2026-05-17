'use client'

import { useFeedCategories } from '@/features/shop/hooks/feed/useFeedCategories'
import ShopHeroSection from '@/components/domain/shop/ShopHeroSection'
import ProductCategorySection from '@/components/domain/shop/ProductCategorySection'
import ShopProductsSection from '@/components/domain/shop/ShopProductsSection'
import ShopBundle from '@/components/domain/shop/ShopBundle'
import LoadingBar from '@/components/layout/LoadingBar'

export default function Feed() {
  const { feedCategories, loading, error } = useFeedCategories()

  // Find special offers for the bundle
  const specialOffers = feedCategories?.find(
    (cat) => cat.slug === 'limited-offers',
  )

  // Filter out categories that have no products (excluding limited-offers)
  const categoriesWithProducts =
    feedCategories?.filter(
      (cat) =>
        cat.slug !== 'limited-offers' &&
        cat.products &&
        cat.products.length > 0,
    ) || []

  return (
    <div>
      <ShopHeroSection />
      <ProductCategorySection />

      {/* Dynamically map through all categories with products */}
      <LoadingBar loading={loading} error={error}>
        {categoriesWithProducts.map((category) => {
          // Check if this is the best-sellers category to show bundle after it
          const showBundle = category.slug === 'best-sellers'

          return (
            <div key={category.id}>
              <ShopProductsSection
                title={category.name}
                description={category.description || ''}
                products={category.products}
              />
              {showBundle &&
                specialOffers &&
                specialOffers.products.length > 0 && (
                  <ShopBundle products={specialOffers.products} />
                )}
            </div>
          )
        })}
      </LoadingBar>
    </div>
  )
}
