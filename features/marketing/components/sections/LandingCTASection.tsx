// features/marketing/components/sections/LandingCTASection.tsx

import { ShieldCheck } from "lucide-react";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";

export function LandingCTASection() {
    return (
        <section className="bg-tint-peach rounded-2xl px-8 py-16 md:py-20 text-center">
            <div className="max-w-2xl mx-auto">
                <h2 className="font-display text-4xl md:text-5xl text-ink font-semibold tracking-tight mb-4">
                    Ready to start your business?
                </h2>
                <p className="text-slate text-base mb-8 max-w-xl mx-auto">
                    Join thousands of founders who trust StartupKaro for their compliance and legal needs. Get started in minutes.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <FlowButton
                        href="/services"
                        text="Browse Services"
                        iconName="briefcase"
                        colorVariant="navy"
                    />
                    <FlowSecondaryButton
                        href="/contact"
                        text="Talk to an Expert"
                        iconName="message-circle"
                    />
                </div>
                <p className="mt-6 text-steel text-xs flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    No hidden fees · Expert CAs assigned · 100% online
                </p>
            </div>
        </section>
    );
}
