import { ShieldCheck } from "lucide-react";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";
import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

const ctaGradientBackground =
    "radial-gradient(circle at 18% 78%, rgba(37,99,235,.42) 0%, rgba(37,99,235,.30) 16%, rgba(37,99,235,.12) 32%, transparent 48%), radial-gradient(circle at 82% 18%, rgba(59,130,246,.34) 0%, rgba(59,130,246,.24) 14%, rgba(59,130,246,.10) 30%, transparent 44%), linear-gradient(135deg,#081225,#0F172A,#142850)";

type MarketingCTASectionProps = {
    eyebrow?: string;
    title?: ReactNode;
    description?: ReactNode;
    primaryText?: string;
    primaryHref?: string;
    secondaryText?: string;
    secondaryHref?: string;
    trustText?: string;
    className?: string;
    style?: CSSProperties;
};

export function MarketingCTASection({
    eyebrow,
    title = "Ready to start your business?",
    description = (
        <>
            Join thousands of founders who trust StartupKaro for their compliance and legal needs.
            <br />
            Get started in minutes.
        </>
    ),
    primaryText = "Browse Services",
    primaryHref = "/services",
    secondaryText = "Talk to an Expert",
    secondaryHref = "/contact",
    trustText = "No hidden fees - Expert team assigned - 100% online",
    className,
    style,
}: MarketingCTASectionProps) {
    return (
        <section
            className={cn(
                "mx-4 max-w-7xl rounded-2xl border border-white/10 bg-ink px-8 py-16 text-center sm:mx-6 md:py-20 lg:mx-auto",
                className
            )}
            style={{ background: ctaGradientBackground, ...style }}
        >
            <div className="mx-auto max-w-2xl">
                {eyebrow && (
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.28px] text-white/80">
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
                        showIcon={secondaryText !== "Talk to an Expert"}
                        className="border-white/70 bg-transparent text-white hover:border-white hover:bg-white hover:text-ink focus-visible:ring-white"
                    />
                </div>
                {trustText && (
                    <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/80">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {trustText}
                    </p>
                )}
            </div>
        </section>
    );
}
