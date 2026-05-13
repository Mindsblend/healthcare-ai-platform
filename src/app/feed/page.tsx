'use client'

import { useFeedCategories } from '@/features/shop/hooks/feed/useFeedCategories'
import ShopHeroSection from '@/components/domain/shop/ShopHeroSection'
import ProductCategorySection from '@/components/domain/shop/ProductCategorySection'
import ShopProductsSection from '@/components/domain/shop/ShopProductsSection'
import ShopBundle from '@/components/domain/shop/ShopBundle'

export default function Feed() {
  const { feedCategories, loading, error } = useFeedCategories()

  if (loading) {
    return (
      <div>
        <ShopHeroSection />
        <ProductCategorySection />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
            <p className="text-black">در حال بارگذاری محصولات...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <ShopHeroSection />
        <ProductCategorySection />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-2 text-lg text-red-500">⚠️ خطا در بارگذاری</div>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    )
  }

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
      {categoriesWithProducts.map((category, index) => {
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
    </div>
  )
}
