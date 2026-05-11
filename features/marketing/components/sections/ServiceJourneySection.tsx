"use client";

import { useRef, useState } from "react";
import {
    motion,
    useScroll,
    useMotionValueEvent,
    AnimatePresence,
} from "framer-motion";
import {
    Rocket,
    LineChart,
    ShieldCheck,
    Check,
} from "lucide-react";

import { FlowButton } from "@/components/custom/FlowButton";

const steps = [
    {
        number: "01",
        heading: "Start your business",
        Icon: Rocket,
        accent: "#ff7759",
        accentBg: "bg-coral/10",
        accentText: "text-coral",
        accentBorder: "border-coral/25",
        gradientFrom: "from-orange-50",
        gradientTo: "to-amber-50",
        iconBg: "bg-coral/15",
        iconText: "text-coral",
        description:
            "Get legally incorporated and ready to operate. Our experts handle every filing end to end, so you can stay focused on building.",
        services: [
            "Private Ltd / LLP / OPC registration",
            "GST registration",
            "Startup India recognition",
            "PAN & TAN application",
        ],
        visualLabel: "Let’s get you started",
        colorVariant: "saffron" as const,
        ctaText: "Start Now",
    },
    {
        number: "02",
        heading: "Manage your business",
        Icon: LineChart,
        accent: "#17171c",
        accentBg: "bg-primary-brand/8",
        accentText: "text-primary-brand",
        accentBorder: "border-primary-brand/20",
        gradientFrom: "from-indigo-50",
        gradientTo: "to-blue-50",
        iconBg: "bg-primary-brand/10",
        iconText: "text-primary-brand",
        description:
            "Stay compliant and financially healthy month to month. We handle the recurring filings so nothing slips through the cracks.",
        services: [
            "Bookkeeping & accounting",
            "ITR & GST filing",
            "Payroll processing",
            "ROC annual compliance",
        ],
        visualLabel: "Keeping things on track",
        colorVariant: "navy" as const,
        ctaText: "Manage Now",
    },
    {
        number: "03",
        heading: "Protect your business",
        Icon: ShieldCheck,
        accent: "#003c33",
        accentBg: "bg-deep-green/10",
        accentText: "text-deep-green",
        accentBorder: "border-deep-green/20",
        gradientFrom: "from-green-50",
        gradientTo: "to-emerald-50",
        iconBg: "bg-deep-green/15",
        iconText: "text-deep-green",
        description:
            "Safeguard the brand, IP, and legal footing you've built. Lock in your trademarks and have expert legal cover on standby.",
        services: [
            "Trademark registration",
            "Copyright & patent filing",
            "Legal contracts & agreements",
            "Dispute & notice handling",
        ],
        visualLabel: "You’re covered",
        colorVariant: "green" as const,
        ctaText: "Protect Now",
    },
];

export function ServiceJourneySection() {
    const [activeStep, setActiveStep] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        if (v < 0.34) setActiveStep(0);
        else if (v < 0.67) setActiveStep(1);
        else setActiveStep(2);
    });

    const activeAccent = steps[activeStep].accent;

    return (
        <section className="bg-white py-20 md:py-24">
            {/* Section header */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-14">
                <p className="font-mono text-xs uppercase tracking-[0.28px] text-coral mb-2">
                    Your journey
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-ink font-normal tracking-tight">
                    Everything you need,{" "}
                    <span className="text-coral">at every stage</span>
                </h2>
                <p className="mt-3 text-base text-body-muted max-w-lg mx-auto">
                    From the day you register to years of growth, we're with you at every step.
                </p>
            </div>

            {/* ── DESKTOP: sticky-left + scrollable-right ── */}
            <div
                ref={containerRef}
                className="relative hidden lg:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
            >
                <div className="lg:grid lg:grid-cols-2 lg:gap-16">
                    {/* Left — grid item stretches to full row height, inner div sticks */}
                    <div>
                    <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] flex flex-col justify-center items-center gap-6">
                        {/* Illustration area */}
                        <div className="relative w-full max-w-sm aspect-square">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, scale: 0.97, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.97, y: -10 }}
                                    transition={{ duration: 0.45, ease: "easeOut" }}
                                    className={`absolute inset-0 rounded-[22px] bg-linear-to-br ${steps[activeStep].gradientFrom} ${steps[activeStep].gradientTo} flex flex-col items-center justify-center gap-5 border border-hairline`}
                                >
                                    {/* Decorative rings */}
                                    <div
                                        className="absolute inset-0 rounded-[22px] opacity-30"
                                        style={{
                                            background: `radial-gradient(circle at 70% 30%, ${activeAccent}22 0%, transparent 60%)`,
                                        }}
                                    />
                                    <div
                                        className="w-24 h-24 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${activeAccent}22` }}
                                    >
                                        {(() => {
                                            const S = steps[activeStep];
                                            return (
                                                <S.Icon
                                                    className="h-10 w-10"
                                                    style={{ color: activeAccent }}
                                                />
                                            );
                                        })()}
                                    </div>
                                    <div className="text-center px-6 relative">
                                        <p
                                            className="font-mono text-xs uppercase tracking-[0.28px] mb-1"
                                            style={{ color: activeAccent }}
                                        >
                                            Step {steps[activeStep].number}
                                        </p>
                                        <p className="font-display text-xl text-ink font-normal">
                                            {steps[activeStep].heading}
                                        </p>
                                        <p className="text-xs text-body-muted mt-1.5">
                                            {steps[activeStep].visualLabel}
                                        </p>
                                    </div>
                                    {/* Decorative dot grid */}
                                    <div className="absolute bottom-6 right-6 grid grid-cols-3 gap-1.5 opacity-20">
                                        {Array.from({ length: 9 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: activeAccent }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Progress rail */}
                        <div className="flex items-center gap-3">
                            {steps.map((s, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <motion.div
                                        className="rounded-full transition-all duration-300"
                                        animate={{
                                            width: i === activeStep ? 24 : 8,
                                            height: 8,
                                            backgroundColor:
                                                i === activeStep ? s.accent : "#e5e7eb",
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    {i < steps.length - 1 && (
                                        <div className="w-6 h-0.5 bg-gray-200" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>

                    {/* Right — scrollable cards */}
                    <div>
                        {steps.map((step, i) => (
                            <div
                                key={step.number}
                                className="min-h-screen flex items-center py-12"
                            >
                                <StepCard step={step} isActive={activeStep === i} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MOBILE: stacked cards ── */}
            <div className="lg:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                {steps.map((step) => (
                    <StepCard key={step.number} step={step} isActive />
                ))}
            </div>
        </section>
    );
}

type StepCardProps = {
    step: (typeof steps)[number];
    isActive: boolean;
};

function StepCard({ step, isActive }: StepCardProps) {
    return (
        <motion.div
            animate={{ opacity: isActive ? 1 : 0.45 }}
            transition={{ duration: 0.35 }}
            className={`w-full rounded-lg border bg-white p-7 md:p-8 space-y-5 ${
                isActive
                    ? `border-hairline ${step.accentBorder}`
                    : "border-hairline"
            }`}
        >
            {/* Step badge + icon */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span
                        className={`font-mono text-xs uppercase tracking-[0.28px] ${step.accentText}`}
                    >
                        {step.number}
                    </span>
                    <div className="w-px h-4 bg-gray-200" />
                    <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center ${step.accentBg}`}
                    >
                        <step.Icon className={`h-4.5 w-4.5 ${step.accentText}`} />
                    </div>
                </div>
            </div>

            {/* Heading + description */}
            <div>
                <h3 className="font-display text-2xl md:text-3xl text-ink font-normal tracking-tight mb-2">
                    {step.heading}
                </h3>
                <p className="text-sm text-body-muted leading-relaxed">{step.description}</p>
            </div>

            {/* Key services */}
            <div className="space-y-2.5">
                {step.services.map((service) => (
                    <div key={service} className="flex items-center gap-2.5">
                        <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${step.accentBg}`}
                        >
                            <Check className={`h-3 w-3 ${step.accentText}`} />
                        </div>
                        <span className="text-sm text-ink">{service}</span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="pt-1">
                <FlowButton
                    href="/services"
                    text={step.ctaText}
                    icon={step.Icon}
                    colorVariant={step.colorVariant}
                />
            </div>
        </motion.div>
    );
}
