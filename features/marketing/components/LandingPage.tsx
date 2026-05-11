// features/marketing/components/LandingPage.tsx

import { HeroSection } from "./sections/HeroSection";
import { BrandsMarqueeSection } from "./sections/BrandsMarqueeSection";
import { ServiceJourneySection } from "./sections/ServiceJourneySection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { LatestArticlesSection } from "./sections/LatestArticlesSection";
import { LandingCTASection } from "./sections/LandingCTASection";
import { getLatestArticles } from "@/features/articles/api/articles.service";

export async function LandingPage() {
    const articles = await getLatestArticles(3);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            <HeroSection />
            <BrandsMarqueeSection />
            <ServiceJourneySection />
            <HowItWorksSection />
            <WhyChooseUsSection />
            <LatestArticlesSection articles={articles} />
            <LandingCTASection />
        </div>
    );
}