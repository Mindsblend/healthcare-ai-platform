'use client'

import { useFeedCategories } from '@/features/shop/hooks/feed/useFeedCategories'
import { useCollections } from '@/features/shop/hooks/collections/useCollections'
import ShopHeroSection from '@/components/domain/shop/ShopHeroSection'
import ProductCategorySection from '@/components/domain/shop/ProductCategorySection'
import ShopProductsSection from '@/components/domain/shop/ShopProductsSection'
import ShopBundle from '@/components/domain/shop/ShopBundle'
import LoadingBar from '@/components/layout/LoadingBar'

// 🎯 The feed category slug after which the bundle should appear
const TARGET_CATEGORY_SLUG = 'aaa'

export default function Feed() {
  const {
    feedCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFeedCategories()
  const { collections, loading: collectionsLoading } = useCollections()

  // ✅ Get all active collections that have at least one product (price > 0 implies products)
  const activeCollections =
    collections?.filter((cat) => cat.isActive === true && cat.price > 0) || []

  // Filter categories with products (excluding the limited-offers category if empty)
  const categoriesWithProducts =
    feedCategories?.filter(
      (cat) =>
        cat.slug !== 'limited-offers' &&
        cat.products &&
        cat.products.length > 0,
    ) || []

  const isLoading = categoriesLoading || collectionsLoading

  return (
    <div>
      <ShopHeroSection />
      <ProductCategorySection />

      <LoadingBar loading={isLoading} error={categoriesError}>
        {categoriesWithProducts.map((category) => {
          // Show bundle after the TARGET_CATEGORY_SLUG category
          const showBundle = category.slug === TARGET_CATEGORY_SLUG

          return (
            <div key={category.id}>
              <ShopProductsSection
                title={category.name}
                description={category.description || ''}
                products={category.products}
              />
              <ShopBundle collections={activeCollections} />{' '}
            </div>
          )
        })}
      </LoadingBar>
    </div>
  )
}
