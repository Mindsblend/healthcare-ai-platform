import { getSession } from '@/features/auth/services/sessionService'

// Landing Page Components
import LandingHeroSection from '@/components/domain/(interface)/LandingHeroSection'
import HealthInvestmentSection from '@/components/domain/(interface)/HealthInvestmentSection'
import HealthTestSection from '@/components/domain/(interface)/HealthTestSection'
import ServicesSection from '@/components/domain/(interface)/ServicesSection'
import ReviewSection from '@/components/domain/(interface)/ReviewSection'
import ProductsSection from '@/components/domain/(interface)/ProductsSection'
import NewsletterSection from '@/components/domain/(interface)/NewsletterSection'
import FeaturesSection from '@/components/domain/(interface)/FeaturesSection'
import BlogsSection from '@/components/domain/(interface)/BlogsSection'
import StepsSection from '@/components/domain/(interface)/StepsSection'

// Shop Components
import ShopHeroSection from '@/components/domain/shop/ShopHeroSection'
import ProductCategorySection from '@/components/domain/shop/ProductCategorySection'
import ShopProductsSection from '@/components/domain/shop/ShopProductsSection'

export default async function Home() {
  const user = await getSession()

  if (!user) {
    return (
      <div>
        <LandingHeroSection />
        <HealthInvestmentSection />
        <HealthTestSection />
        <ServicesSection />
        <StepsSection />
        <ProductsSection />
        <ReviewSection />
        <BlogsSection />
        <NewsletterSection />
        <FeaturesSection />
      </div>
    )
  } else {
    return (
      <div>
        <ShopHeroSection />
        <ProductCategorySection />
        <ShopProductsSection
          title="پرفروش ترین محصولات"
          description="برترین و پر فروش ترین محصولات این هفته"
        />
        <ShopProductsSection
          title="محصولات پیشنهادی برای شما"
          description="محصولاتی که با توجه به نیازها و سبک زندگی شما، بیشترین تاثیر را دارند"
        />
        <ShopProductsSection
          title="محصولات جدید"
          description="تازه‌ترین محصولات و انتخاب‌های فصلی برای تجربه‌ای نو و به‌روز"
        />
      </div>
    )
  }
}
