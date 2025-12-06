import Image from 'next/image'
import HeroSection from '@/components/domain/(interface)/HeroSection'
import HealthInvestmentSection from '@/components/domain/(interface)/HealthInvestmentSection'
import HealthTestSection from '@/components/domain/(interface)/HealthTestSection'
import ServicesSection from '@/components/domain/(interface)/ServicesSection'
import ReviewSection from '@/components/domain/(interface)/ReviewSection'
import ProductsSection from '@/components/domain/(interface)/ProductsSection'
import { products } from '@/features/shop/services/fetchProducts'
import NewsletterSection from '@/components/domain/(interface)/NewsletterSection'
import FeaturesSection from '@/components/domain/(interface)/FeaturesSection'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HealthInvestmentSection />
      <HealthTestSection />
      <ServicesSection />
      <ReviewSection />
      <ProductsSection products={products} />
      <NewsletterSection />
      <FeaturesSection />
    </div>
  )
}
