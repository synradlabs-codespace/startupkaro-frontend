// features/marketing/components/LandingPage.tsx

import { HeroSection } from "./sections/HeroSection";
import { BrandsMarqueeSection } from "./sections/BrandsMarqueeSection";
import { ServicesOverviewSection } from "./sections/ServicesOverviewSection";
import { ServiceJourneySection } from "./sections/ServiceJourneySection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { FounderStorySection } from "./sections/FounderStorySection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { LatestArticlesSection } from "./sections/LatestArticlesSection";
import { LandingCTASection } from "./sections/LandingCTASection";
import { LandingFAQSection } from "./sections/LandingFAQSection";
import { SectionReveal } from "./ui/SectionReveal";
import { getLatestArticles } from "@/features/articles/api/articles.service";

export async function LandingPage() {
    const articles = await getLatestArticles(3);

    return (
        <div className="bg-canvas py-6">
            <HeroSection />
            <SectionReveal delay={0.04}>
                <BrandsMarqueeSection />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <ServicesOverviewSection />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <ServiceJourneySection />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <WhyChooseUsSection />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <FounderStorySection />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <TestimonialsSection />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <HowItWorksSection />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <LatestArticlesSection articles={articles} />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <LandingFAQSection />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <LandingCTASection />
            </SectionReveal>
        </div>
    );
}
