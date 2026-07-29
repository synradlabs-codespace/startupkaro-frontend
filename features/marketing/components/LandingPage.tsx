// features/marketing/components/LandingPage.tsx

import dynamic from "next/dynamic";
import { HeroSection } from "./sections/HeroSection";
import { BrandsMarqueeSection } from "./sections/BrandsMarqueeSection";
import { ServicesOverviewSection } from "./sections/ServicesOverviewSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { LatestArticlesSection } from "./sections/LatestArticlesSection";
import { LandingCTASection } from "./sections/LandingCTASection";
import { SectionReveal } from "./ui/SectionReveal";
import { getLatestArticles } from "@/features/articles/api/articles.service";

const PromotionsSection = dynamic(() => import("./sections/PromotionsSection").then((mod) => mod.PromotionsSection));
const ConsultantCTASection = dynamic(() => import("./sections/ConsultantCTASection").then((mod) => mod.ConsultantCTASection));
const ProductDevelopmentSection = dynamic(() => import("./sections/ProductDevelopmentSection").then((mod) => mod.ProductDevelopmentSection));
const ServiceJourneySection = dynamic(() => import("./sections/ServiceJourneySection").then((mod) => mod.ServiceJourneySection));
const HowItWorksSection = dynamic(() => import("./sections/HowItWorksSection").then((mod) => mod.HowItWorksSection));
const FounderStorySection = dynamic(() => import("./sections/FounderStorySection").then((mod) => mod.FounderStorySection));
const LandingFAQSection = dynamic(() => import("./sections/LandingFAQSection").then((mod) => mod.LandingFAQSection));
const ConsultancyDock = dynamic(() => import("./ui/ConsultancyDock").then((mod) => mod.ConsultancyDock));

export async function LandingPage() {
    const articles = await getLatestArticles(3);

    return (
        <div className="w-full overflow-x-clip bg-canvas py-6">
            <HeroSection />
            <SectionReveal delay={0.04}>
                <BrandsMarqueeSection />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <PromotionsSection />
            </SectionReveal>
            <SectionReveal delay={0.04}>
                <ServicesOverviewSection />
            </SectionReveal>
            <ConsultantCTASection />
            <ServiceJourneySection />
            <SectionReveal delay={0.04}>
                <WhyChooseUsSection />
            </SectionReveal>
            <ProductDevelopmentSection />
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
            <ConsultancyDock />
        </div>
    );
}
