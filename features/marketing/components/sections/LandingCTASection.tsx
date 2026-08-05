// features/marketing/components/sections/LandingCTASection.tsx

import { MarketingCTASection } from "./MarketingCTASection";

export function LandingCTASection() {
    return (
        <div className="py-10 md:py-14">
            <MarketingCTASection
                eyebrow="What's Stopping You?"
                title={
                    <>
                        STARTUPKARO <span className="text-primary-brand">INDIA</span>
                    </>
                }
                description={
                    <>
                        Join thousands of founders and businesses across India who trust StartupKaro for everything their business needs from launch to growth.
                        <br />
                        Get started in minutes.
                    </>
                }
                trustText="No hidden fees - Expert assigned - 100% online"
            />
        </div>
    );
}
