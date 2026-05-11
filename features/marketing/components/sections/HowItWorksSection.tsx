"use client";

import { MousePointerClick, Upload, FileCheck2, CheckCircle2 } from "lucide-react";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

const steps = [
    {
        icon: MousePointerClick,
        step: "01",
        title: "Choose a service",
        description:
            "Browse our catalogue and pick what your startup needs. Every service has a fixed, upfront price — no hidden fees, no surprise invoices.",
        itemClassName: "bg-tint-peach",
    },
    {
        icon: Upload,
        step: "02",
        title: "Share your documents",
        description:
            "We send you a precise checklist — nothing more, nothing less. Upload securely through our portal and our team reviews everything within one business day.",
        itemClassName: "bg-tint-sky",
    },
    {
        icon: FileCheck2,
        step: "03",
        title: "We file for you",
        description:
            "A dedicated CA, CS, or legal professional prepares and submits all filings with the relevant authority. You get real-time updates at every milestone.",
        itemClassName: "bg-tint-mint",
    },
    {
        icon: CheckCircle2,
        step: "04",
        title: "You are compliant",
        description:
            "Your certificate, GSTIN, or licence lands directly in your portal. We also track renewal dates and compliance deadlines so you never miss a thing.",
        itemClassName: "bg-tint-lavender",
    },
];

export function HowItWorksSection() {
    return (
        <section className="bg-canvas py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-8">
                <div className="text-center mb-12">
                    <p className="text-xs uppercase tracking-[0.28px] text-steel font-medium mb-2">
                        Simple process
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl text-ink font-semibold tracking-tight">
                        How it works
                    </h2>
                </div>
            </div>

            <ScrollStack
                useWindowScroll
                itemDistance={80}
                itemScale={0.04}
                itemStackDistance={20}
                stackPosition="15%"
                scaleEndPosition="5%"
                baseScale={0.88}
                scrollBuffer={240}
                className="max-w-3xl mx-auto px-4"
            >
                {steps.map((item) => {
                    const Icon = item.icon;
                    return (
                        <ScrollStackItem
                            key={item.step}
                            itemClassName={`${item.itemClassName} !rounded-2xl !h-72 !p-10`}
                        >
                            <div className="flex items-center gap-10 h-full">
                                {/* Left — icon centered vertically */}
                                <div className="shrink-0 flex flex-col items-center gap-4">
                                    <div className="h-20 w-20 rounded-2xl bg-white/60 flex items-center justify-center">
                                        <Icon className="h-10 w-10 text-charcoal" />
                                    </div>
                                    <span className="text-xs font-semibold text-stone tracking-widest">{item.step}</span>
                                </div>

                                {/* Right — text */}
                                <div className="flex flex-col gap-3 min-w-0">
                                    <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-base md:text-lg text-slate leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        </ScrollStackItem>
                    );
                })}
            </ScrollStack>
        </section>
    );
}
