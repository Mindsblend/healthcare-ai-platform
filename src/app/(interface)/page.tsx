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

export default async function Home() {
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
}
