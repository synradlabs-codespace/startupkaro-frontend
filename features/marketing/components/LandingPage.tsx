// features/marketing/components/LandingPage.tsx

import { HeroSection } from "./sections/HeroSection";
import { ServiceJourneySection } from "./sections/ServiceJourneySection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { LatestArticlesSection } from "./sections/LatestArticlesSection";
import { LandingCTASection } from "./sections/LandingCTASection";
import { getLatestArticles } from "@/features/articles/api/articles.service";

export async function LandingPage() {
    const articles = await getLatestArticles(3);

    return (
        <>
            <HeroSection />
            <ServiceJourneySection />
            <HowItWorksSection />
            <WhyChooseUsSection />
            <LatestArticlesSection articles={articles} />
            <LandingCTASection />
        </>
    );
}