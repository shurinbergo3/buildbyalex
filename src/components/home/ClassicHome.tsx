import { Hero } from "@/components/home/Hero";
import { PainPoints } from "@/components/home/PainPoints";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { LegalwinHomeShowcase } from "@/components/home/LegalwinHomeShowcase";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ScrollStory } from "@/components/home/ScrollStory";
import { Pricing } from "@/components/home/Pricing";
import { QuoteForm } from "@/components/QuoteForm";
import { FitCheck } from "@/components/home/FitCheck";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";

/* The home page as it was before the film version (September 2026). It is
   still the home page in en/pl/ua; the Russian one runs PromoPage. */
export function ClassicHome({ reviewCount, now }: { reviewCount: number; now: number }) {
  return (
    <div className="home-sections">
      <Hero reviewCount={reviewCount} />
      <PainPoints />
      <ServicesOverview />
      <FeaturedWork />
      <LegalwinHomeShowcase />
      <HowItWorks />
      <ScrollStory />
      <Pricing />
      <QuoteForm tone="alt" />
      <FitCheck />
      <Testimonials now={now} />
      <FAQ />
      <FinalCTA reviewCount={reviewCount} />
    </div>
  );
}
