import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedEditors from "@/components/landing/FeaturedEditors";
import TrustSection from "@/components/landing/TrustSection";
import PricingPreview from "@/components/landing/PricingPreview";
import CTASection from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <HeroSection />
      <ProblemSection />
      <HowItWorks />
      <FeaturedEditors />
      <TrustSection />
      <PricingPreview />
      <CTASection />
    </main>
  );
}
