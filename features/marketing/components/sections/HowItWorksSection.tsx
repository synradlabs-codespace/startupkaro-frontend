"use client";

import { Mail, MousePointerClick, FileCheck2, CheckCircle2 } from "lucide-react";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

const steps = [
    {
        icon: MousePointerClick,
        step: "01",
        title: "Choose a service",
        description:
            "Browse our catalogue and pick what your startup needs. Every service has a fixed, upfront price — no hidden fees, no surprise invoices.",
        itemClassName: "bg-canvas border border-hairline",
        dark: false,
    },
    {
        icon: Mail,
        step: "02",
        title: "Email your documents",
        description:
            "We send you a precise checklist and our official email address. Share the required documents by email, and our team reviews everything before filing.",
        itemClassName: "bg-canvas border border-hairline",
        dark: false,
    },
    {
        icon: FileCheck2,
        step: "03",
        title: "We file for you",
        description:
            "A dedicated CA, CS, or legal professional prepares and submits all filings with the relevant authority. You get milestone updates by email and call.",
        itemClassName: "bg-canvas border border-hairline",
        dark: false,
    },
    {
        icon: CheckCircle2,
        step: "04",
        title: "You are compliant",
        description:
            "Your certificate, GSTIN, or licence is shared with you over email. Your assigned expert also keeps you informed about renewal dates and compliance deadlines.",
        itemClassName: "bg-ink border border-ink",
        dark: true,
    },
];

function StepCard({ item }: { item: typeof steps[number] }) {
    const Icon = item.icon;
    return (
        <div className="flex h-full flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <div className="shrink-0 flex flex-col items-center gap-4">
                <div className={`h-20 w-20 rounded-xl flex items-center justify-center ${item.dark ? "bg-white/10" : "bg-primary-soft"}`}>
                    <Icon className={`h-10 w-10 ${item.dark ? "text-white" : "text-primary-brand"}`} />
                </div>
                <span className={`text-xs font-semibold tracking-widest ${item.dark ? "text-white/70" : "text-primary-brand"}`}>{item.step}</span>
            </div>
            <div className="flex flex-col gap-3 min-w-0">
                <h3 className={`font-display text-2xl md:text-3xl font-medium leading-snug ${item.dark ? "text-white" : "text-ink"}`}>
                    {item.title}
                </h3>
                <p className={`text-base md:text-lg leading-relaxed ${item.dark ? "text-white/85" : "text-charcoal"}`}>{item.description}</p>
            </div>
        </div>
    );
}

export function HowItWorksSection() {
    return (
        <section className="bg-canvas py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-8">
                <div className="text-center mb-12">
                    <p className="text-xs uppercase tracking-[0.28px] text-graphite font-medium mb-2">
                        Simple process
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl text-ink font-medium">
                        How it works
                    </h2>
                </div>
            </div>

            {/* Mobile — plain visible stack */}
            <div className="md:hidden max-w-3xl mx-auto px-4 flex flex-col gap-4">
                {steps.map((item) => (
                    <div
                        key={item.step}
                        className={`${item.itemClassName} rounded-2xl min-h-72 p-6 shadow-[0_2px_8px_rgba(26,26,26,0.08)]`}
                    >
                        <StepCard item={item} />
                    </div>
                ))}
            </div>

            {/* Desktop — animated ScrollStack */}
            <div className="hidden md:block">
                <ScrollStack
                    useWindowScroll
                    itemDistance={80}
                    itemScale={0.04}
                    itemStackDistance={20}
                    stackPosition="15%"
                    scaleEndPosition="5%"
                    baseScale={0.88}
                    scrollBuffer={240}
                    className="max-w-3xl mx-auto px-0 md:px-4 [&_.scroll-stack-inner]:px-4 md:[&_.scroll-stack-inner]:px-20"
                >
                    {steps.map((item) => (
                        <ScrollStackItem
                            key={item.step}
                            itemClassName={`${item.itemClassName} !rounded-2xl !h-auto !min-h-72 !p-6 md:!p-10 !shadow-[0_2px_8px_rgba(26,26,26,0.08)]`}
                        >
                            <StepCard item={item} />
                        </ScrollStackItem>
                    ))}
                </ScrollStack>
            </div>
        </section>
    );
}
