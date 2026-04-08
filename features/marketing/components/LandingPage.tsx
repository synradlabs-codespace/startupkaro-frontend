// features/marketing/components/LandingPage.tsx

import { HeroSection } from "./sections/HeroSection";
import { ServicesOverviewSection } from "./sections/ServicesOverviewSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { LandingCTASection } from "./sections/LandingCTASection";

export function LandingPage() {
    return (
        <>
            <HeroSection />
            <ServicesOverviewSection />
            <HowItWorksSection />
            <WhyChooseUsSection />
            <LandingCTASection />
        </>
    );
}
