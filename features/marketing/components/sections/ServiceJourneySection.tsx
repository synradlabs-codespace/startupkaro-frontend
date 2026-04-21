"use client";

import { useRef, useState } from "react";
import Link from "next/link";
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
    ArrowRight,
} from "lucide-react";

const steps = [
    {
        number: "01",
        heading: "Start your business",
        Icon: Rocket,
        accent: "#FF9933",
        accentBg: "bg-[#FF9933]/10",
        accentText: "text-[#FF9933]",
        accentBorder: "border-[#FF9933]/25",
        gradientFrom: "from-orange-50",
        gradientTo: "to-amber-50",
        iconBg: "bg-[#FF9933]/15",
        iconText: "text-[#FF9933]",
        description:
            "Get legally incorporated and ready to operate. Our experts handle every filing end to end, so you can stay focused on building.",
        services: [
            "Private Ltd / LLP / OPC registration",
            "GST registration",
            "Startup India recognition",
            "PAN & TAN application",
        ],
        visualLabel: "Let\u2019s get you started",
    },
    {
        number: "02",
        heading: "Manage your business",
        Icon: LineChart,
        accent: "#000080",
        accentBg: "bg-[#000080]/8",
        accentText: "text-[#000080]",
        accentBorder: "border-[#000080]/20",
        gradientFrom: "from-indigo-50",
        gradientTo: "to-blue-50",
        iconBg: "bg-[#000080]/10",
        iconText: "text-[#000080]",
        description:
            "Stay compliant and financially healthy month to month. We handle the recurring filings so nothing slips through the cracks.",
        services: [
            "Bookkeeping & accounting",
            "ITR & GST filing",
            "Payroll processing",
            "ROC annual compliance",
        ],
        visualLabel: "Keeping things on track",
    },
    {
        number: "03",
        heading: "Protect your business",
        Icon: ShieldCheck,
        accent: "#6BAE3A",
        accentBg: "bg-[#6BAE3A]/10",
        accentText: "text-[#6BAE3A]",
        accentBorder: "border-[#6BAE3A]/20",
        gradientFrom: "from-green-50",
        gradientTo: "to-emerald-50",
        iconBg: "bg-[#6BAE3A]/15",
        iconText: "text-[#6BAE3A]",
        description:
            "Safeguard the brand, IP, and legal footing you've built. Lock in your trademarks and have expert legal cover on standby.",
        services: [
            "Trademark registration",
            "Copyright & patent filing",
            "Legal contracts & agreements",
            "Dispute & notice handling",
        ],
        visualLabel: "You\u2019re covered",
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
        <section className="bg-gray-50/40 py-16 md:py-20">
            {/* Section header */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-14">
                <p className="text-xs font-semibold text-[#FF9933] uppercase tracking-wider mb-2">
                    Your journey
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal">
                    Everything you need,{" "}
                    <span className="text-[#FF9933]">at every stage</span>
                </h2>
                <p className="mt-3 text-sm text-gray-500 max-w-lg mx-auto">
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
                                    className={`absolute inset-0 rounded-3xl bg-linear-to-br ${steps[activeStep].gradientFrom} ${steps[activeStep].gradientTo} flex flex-col items-center justify-center gap-5 border border-gray-200/50`}
                                >
                                    {/* Decorative rings */}
                                    <div
                                        className="absolute inset-0 rounded-3xl opacity-30"
                                        style={{
                                            background: `radial-gradient(circle at 70% 30%, ${activeAccent}22 0%, transparent 60%)`,
                                        }}
                                    />
                                    <div
                                        className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
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
                                            className="text-xs font-semibold uppercase tracking-wider mb-1"
                                            style={{ color: activeAccent }}
                                        >
                                            Step {steps[activeStep].number}
                                        </p>
                                        <p className="font-serif text-xl text-gray-800 font-normal">
                                            {steps[activeStep].heading}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1.5">
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
            className={`w-full rounded-2xl border bg-white/70 backdrop-blur-sm shadow-sm p-7 md:p-8 space-y-5 transition-shadow duration-300 ${
                isActive
                    ? `border-gray-200/60 shadow-md ${step.accentBorder}`
                    : "border-gray-100"
            }`}
        >
            {/* Step badge + icon */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span
                        className={`text-xs font-bold uppercase tracking-widest ${step.accentText}`}
                    >
                        {step.number}
                    </span>
                    <div className="w-px h-4 bg-gray-200" />
                    <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center ${step.accentBg}`}
                    >
                        <step.Icon className={`h-4.5 w-4.5 ${step.accentText}`} />
                    </div>
                </div>
            </div>

            {/* Heading + description */}
            <div>
                <h3 className="font-serif text-2xl md:text-3xl text-gray-900 font-normal mb-2">
                    {step.heading}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
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
                        <span className="text-sm text-gray-700">{service}</span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="pt-1">
                <Link
                    href="/services"
                    className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium text-white bg-[#FF9933] rounded-xl hover:bg-[#FF9933]/90 transition-colors shadow-sm shadow-[#FF9933]/20"
                >
                    Explore services
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        </motion.div>
    );
}
