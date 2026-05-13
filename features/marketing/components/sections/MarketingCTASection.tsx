import { ShieldCheck } from "lucide-react";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";

type MarketingCTASectionProps = {
    eyebrow?: string;
    title?: string;
    description?: string;
    primaryText?: string;
    primaryHref?: string;
    secondaryText?: string;
    secondaryHref?: string;
    trustText?: string;
};

export function MarketingCTASection({
    eyebrow,
    title = "Ready to start your business?",
    description = "Join thousands of founders who trust StartupKaro for their compliance and legal needs. Get started in minutes.",
    primaryText = "Browse Services",
    primaryHref = "/services",
    secondaryText = "Talk to an Expert",
    secondaryHref = "/contact",
    trustText = "No hidden fees - Expert CAs assigned - 100% online",
}: MarketingCTASectionProps) {
    return (
        <section className="mx-4 max-w-7xl rounded-2xl border border-ink bg-ink px-8 py-16 text-center sm:mx-6 md:py-20 lg:mx-auto">
            <div className="mx-auto max-w-2xl">
                {eyebrow && (
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.28px] text-white/70">
                        {eyebrow}
                    </p>
                )}
                <h2 className="mb-4 font-display text-4xl font-medium text-white md:text-5xl">
                    {title}
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-base text-white/80">
                    {description}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <FlowButton
                        href={primaryHref}
                        text={primaryText}
                        iconName="briefcase"
                        colorVariant="primary"
                    />
                    <FlowSecondaryButton
                        href={secondaryHref}
                        text={secondaryText}
                        iconName="message-circle"
                        className="border-white/70 bg-transparent text-white hover:border-white hover:bg-white hover:text-ink focus-visible:ring-white"
                    />
                </div>
                {trustText && (
                    <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/70">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {trustText}
                    </p>
                )}
            </div>
        </section>
    );
}
