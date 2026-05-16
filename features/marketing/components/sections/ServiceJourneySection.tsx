"use client";

import { useRef, useState } from "react";
import {
    motion,
    useScroll,
    useMotionValueEvent,
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
        accent: "#296ef9",
        accentBg: "bg-primary-soft",
        accentText: "text-primary-brand",
        description:
            "Get legally incorporated and ready to operate. Our experts handle every filing end to end, so you can stay focused on building.",
        services: [
            "Private Ltd / LLP / OPC registration",
            "GST registration",
            "Startup India recognition",
            "PAN & TAN application",
        ],
        visualLabel: "Let's get you started",
        colorVariant: "primary" as const,
        ctaText: "Start Now",
        metric: "10 days",
        metricLabel: "typical setup",
        docs: ["MCA", "GSTIN", "PAN", "DPIIT"],
    },
    {
        number: "02",
        heading: "Manage your business",
        Icon: LineChart,
        accent: "#296ef9",
        accentBg: "bg-primary-soft",
        accentText: "text-primary-brand",
        description:
            "Stay compliant and financially healthy month to month. We handle the recurring filings so nothing slips through the cracks.",
        services: [
            "Bookkeeping & accounting",
            "ITR & GST filing",
            "Payroll processing",
            "ROC annual compliance",
        ],
        visualLabel: "Keeping things on track",
        colorVariant: "primary" as const,
        ctaText: "Manage Now",
        metric: "12 mo",
        metricLabel: "compliance rhythm",
        docs: ["Books", "GST", "Payroll", "ROC"],
    },
    {
        number: "03",
        heading: "Protect your business",
        Icon: ShieldCheck,
        accent: "#296ef9",
        accentBg: "bg-primary-soft",
        accentText: "text-primary-brand",
        description:
            "Safeguard the brand, IP, and legal footing you've built. Lock in your trademarks and have expert legal cover on standby.",
        services: [
            "Trademark registration",
            "Copyright & patent filing",
            "Legal contracts & agreements",
            "Dispute & notice handling",
        ],
        visualLabel: "You're covered",
        colorVariant: "primary" as const,
        ctaText: "Protect Now",
        metric: "360",
        metricLabel: "brand cover",
        docs: ["TM", "IP", "NDA", "Notice"],
    },
];

const cubeFaces = [
    { label: "Start", Icon: Rocket, transform: "translateZ(64px)" },
    { label: "Protect", Icon: ShieldCheck, transform: "rotateY(180deg) translateZ(64px)" },
    { label: "Manage", Icon: LineChart, transform: "rotateY(90deg) translateZ(64px)" },
    { label: "Manage", Icon: LineChart, transform: "rotateY(-90deg) translateZ(64px)" },
];

const cubeRotations = [0, 90, 180];

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

    return (
        <section className="bg-cloud py-20 md:py-24">
            {/* Section header */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-14">
                <p className="text-xs uppercase tracking-[0.28px] text-graphite font-medium mb-2">
                    Your journey
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-ink font-medium">
                    From setup to scale,{" "}
                    <span className="italic font-normal">we stay with you</span>
                </h2>
                <p className="mt-3 text-base text-charcoal max-w-lg mx-auto">
                    Register, manage, and protect your business with one expert-led compliance partner.
                </p>
            </div>

            {/* DESKTOP: sticky-left + scrollable-right */}
            <div
                ref={containerRef}
                className="relative hidden lg:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
            >
                <div className="lg:grid lg:grid-cols-2 lg:gap-16">
                    <div>
                        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] flex flex-col justify-center items-center gap-6">
                            <JourneyVisual activeStep={activeStep} onSelectStep={setActiveStep} />

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
                                                    i === activeStep ? s.accent : "#c2c2c2",
                                            }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        {i < steps.length - 1 && (
                                            <div className="w-6 h-0.5 bg-hairline" />
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

            {/* MOBILE: stacked cards */}
            <div className="lg:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                {steps.map((step) => (
                    <StepCard key={step.number} step={step} isActive />
                ))}
            </div>
        </section>
    );
}

function JourneyVisual({
    activeStep,
    onSelectStep,
}: {
    activeStep: number;
    onSelectStep: (step: number) => void;
}) {
    const active = steps[activeStep];
    const ActiveIcon = active.Icon;

    return (
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-hairline bg-canvas p-5 shadow-[0_18px_48px_rgba(26,26,26,0.06)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary-brand" />

            <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.28px] text-graphite">Live service flow</p>
                    <p className="mt-1 font-display text-2xl font-medium text-ink">{active.visualLabel}</p>
                </div>
                <motion.div
                    key={active.number}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.24 }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-brand"
                >
                    <ActiveIcon className="h-5 w-5" />
                </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {steps.map((step, index) => (
                    <button
                        key={step.number}
                        type="button"
                        onClick={() => onSelectStep(index)}
                        className={`rounded-lg border px-3 py-2 text-left transition-all duration-200 ${
                            activeStep === index
                                ? "border-primary-brand bg-primary-soft text-primary-brand"
                                : "border-hairline bg-surface text-charcoal hover:border-hairline-strong"
                        }`}
                    >
                        <span className="block text-[11px] font-medium uppercase tracking-[0.28px]">{step.number}</span>
                        <span className="mt-0.5 block truncate text-xs font-semibold">{step.heading.split(" ")[0]}</span>
                    </button>
                ))}
            </div>

            <div className="relative my-8 flex h-52 items-center justify-center overflow-hidden rounded-xl border border-hairline bg-surface">
                <motion.div
                    className="absolute h-48 w-48 rounded-full border border-primary-brand/15"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute h-32 w-32 rounded-full border border-hairline-strong/40"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                />

                {active.docs.map((doc, index) => (
                    <motion.div
                        key={`${active.number}-${doc}`}
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: [0, index % 2 === 0 ? 8 : -8, 0],
                            y: [0, index < 2 ? -6 : 6, 0],
                        }}
                        transition={{
                            opacity: { duration: 0.2, delay: index * 0.05 },
                            scale: { duration: 0.2, delay: index * 0.05 },
                            x: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
                            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
                        }}
                        className="absolute rounded-md border border-hairline bg-canvas px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28px] text-charcoal shadow-sm"
                        style={{
                            left: `${index % 2 === 0 ? 15 : 70}%`,
                            top: `${index < 2 ? 18 : 70}%`,
                        }}
                    >
                        {doc}
                    </motion.div>
                ))}

                <ServiceCube activeStep={activeStep} />
            </div>

            <div className="rounded-xl border border-hairline bg-surface p-4">
                <motion.p
                    key={active.metric}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-display text-3xl font-medium text-ink"
                >
                    {active.metric}
                </motion.p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.28px] text-graphite">{active.metricLabel}</p>
            </div>
        </div>
    );
}

function ServiceCube({ activeStep }: { activeStep: number }) {
    const rotateY = cubeRotations[activeStep];
    const faceClass = "absolute flex h-32 w-32 items-center justify-center border border-white/35 bg-primary-brand text-white shadow-[inset_0_0_28px_rgba(255,255,255,0.18)] [backface-visibility:hidden]";

    return (
        <div className="relative h-32 w-32 [perspective:600px]" aria-hidden="true">
            <motion.div
                className="absolute inset-0 [transform-style:preserve-3d] will-change-transform"
                animate={{ transform: `translateZ(-64px) rotateX(0deg) rotateY(${rotateY}deg)` }}
                transition={{ type: "spring", stiffness: 100, damping: 30 }}
            >
                {cubeFaces.map(({ label, Icon, transform }, index) => {
                    return (
                        <div
                            key={`${label}-${index}`}
                            className={faceClass}
                            style={{ transform }}
                        >
                            <div className="text-center">
                                <Icon className="mx-auto mb-2 h-6 w-6" />
                                <span className="text-sm font-semibold uppercase tracking-[0.28px]">{label}</span>
                            </div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
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
            className={`w-full rounded-xl border bg-canvas p-7 md:p-8 space-y-5 ${
                isActive ? `border-primary-brand shadow-[0_2px_8px_rgba(26,26,26,0.08)]` : "border-hairline"
            }`}
        >
            {/* Step badge + icon */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className={`text-xs uppercase tracking-[0.28px] font-medium ${step.accentText}`}>
                        {step.number}
                    </span>
                    <div className="w-px h-4 bg-hairline" />
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${step.accentBg}`}>
                        <step.Icon className={`h-4.5 w-4.5 ${step.accentText}`} />
                    </div>
                </div>
            </div>

            {/* Heading + description */}
            <div>
                <h3 className="font-display text-2xl md:text-3xl text-ink font-medium mb-2">
                    {step.heading}
                </h3>
                <p className="text-sm text-charcoal leading-relaxed">{step.description}</p>
            </div>

            {/* Key services */}
            <div className="space-y-2.5">
                {step.services.map((service) => (
                    <div key={service} className="flex items-center gap-2.5">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${step.accentBg}`}>
                            <Check className={`h-3 w-3 ${step.accentText}`} />
                        </div>
                        <span className="text-sm text-charcoal">{service}</span>
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
