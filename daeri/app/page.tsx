import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import PremiumCalculator from "@/components/premium-calculator"
import { ProductCards } from "@/components/product-cards"
import { ServiceTypeSection } from "@/components/service-type-section"
import { ApplicationForm } from "@/components/application-form"
import { ConsultationCTA } from "@/components/consultation-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PremiumCalculator />
        <ProductCards />
        <ServiceTypeSection />
        <ApplicationForm />
        <ConsultationCTA />
      </main>
      <Footer />
    </div>
  )
}
