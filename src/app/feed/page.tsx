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

  // Find specific categories by slug
  const bestSellers = feedCategories?.find((cat) => cat.slug === 'best-sellers')
  const recommended = feedCategories?.find(
    (cat) => cat.slug === 'recommended-for-you',
  )
  const newArrivals = feedCategories?.find((cat) => cat.slug === 'new-arrivals')

  return (
    <div>
      <ShopHeroSection />
      <ProductCategorySection />

      {/* Best Sellers Section */}
      {bestSellers && bestSellers.products.length > 0 && (
        <ShopProductsSection
          title={bestSellers.name}
          description="برترین و پر فروش ترین محصولات این هفته"
          products={bestSellers.products}
        />
      )}

      <ShopBundle />

      {/* Recommended Section (can be personalized later) */}
      {recommended && recommended.products.length > 0 && (
        <ShopProductsSection
          title={recommended.name}
          description="محصولاتی که با توجه به نیازها و سبک زندگی شما، بیشترین تاثیر را دارند"
          products={recommended.products}
        />
      )}

      {/* New Arrivals Section */}
      {newArrivals && newArrivals.products.length > 0 && (
        <ShopProductsSection
          title={newArrivals.name}
          description="تازه‌ترین محصولات و انتخاب‌های فصلی برای تجربه‌ای نو و به‌روز"
          products={newArrivals.products}
        />
      )}
    </div>
  )
}
