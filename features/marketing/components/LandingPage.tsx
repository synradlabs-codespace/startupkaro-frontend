// features/marketing/components/LandingPage.tsx

import { HeroSection } from "./sections/HeroSection";
import { ServiceJourneySection } from "./sections/ServiceJourneySection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { LandingCTASection } from "./sections/LandingCTASection";

export function LandingPage() {
    return (
        <>
            <HeroSection />
            <ServiceJourneySection />
            <HowItWorksSection />
            <WhyChooseUsSection />
            <LandingCTASection />
        </>
    );
}
