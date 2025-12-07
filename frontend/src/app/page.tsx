import { HeroSection } from '@/components/home/HeroSection'
import { SymptomFinder } from '@/components/home/SymptomFinder'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { TelehealthBanner } from '@/components/home/TelehealthBanner'
import { HealthTips } from '@/components/home/HealthTips'

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      <HeroSection />
      <TelehealthBanner />
      <SymptomFinder />
      <FeaturedProducts />
      <HealthTips />
    </div>
  )
}
