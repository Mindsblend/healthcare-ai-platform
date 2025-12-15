import { getSession } from '@/features/auth/services/sessionService'

import HeroSection from '@/components/domain/(interface)/HeroSection'
import HealthInvestmentSection from '@/components/domain/(interface)/HealthInvestmentSection'
import HealthTestSection from '@/components/domain/(interface)/HealthTestSection'
import ServicesSection from '@/components/domain/(interface)/ServicesSection'
import ReviewSection from '@/components/domain/(interface)/ReviewSection'
import ProductsSection from '@/components/domain/(interface)/ProductsSection'
import { products } from '@/features/shop/services/fetchProducts'
import { blogs } from '@/features/shop/services/fetchBlogs'
import NewsletterSection from '@/components/domain/(interface)/NewsletterSection'
import FeaturesSection from '@/components/domain/(interface)/FeaturesSection'
import BlogsSection from '@/components/domain/(interface)/BlogsSection'
import StepsSection from '@/components/domain/(interface)/StepsSection'

export default async function Home() {
  const user = await getSession()

  if (!user) {
    return (
      <div>
        <HeroSection />
        <HealthInvestmentSection />
        <HealthTestSection />
        <ServicesSection />
        <StepsSection />
        <ReviewSection />
        <ProductsSection products={products} />
        <NewsletterSection />
        <BlogsSection blogs={blogs} />
        <FeaturesSection />
      </div>
    )
  } else {
    return(
      <div>Welcome back! You are logged in. SHOPPING CART</div>
    )
  }
}
