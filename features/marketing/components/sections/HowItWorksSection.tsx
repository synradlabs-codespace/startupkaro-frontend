"use client";

import { useEffect, useState } from "react";
import { Mail, MousePointerClick, FileCheck2, CheckCircle2 } from "lucide-react";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

const steps = [
    {
        icon: MousePointerClick,
        step: "01",
        title: "Choose a Service",
        description:
            "Select the service you need and submit your basic details. Whether it's a consultation, registration, compliance, or assistance, we'll take it from there.",
        itemClassName: "bg-canvas border border-hairline",
        dark: false,
    },
    {
        icon: Mail,
        step: "02",
        title: "Expert Assigned",
        description:
            "Your request is carefully reviewed and assigned to the most suitable expert—based on your specific requirements.",
        itemClassName: "bg-canvas border border-hairline",
        dark: false,
    },
    {
        icon: FileCheck2,
        step: "03",
        title: "Work in Progress",
        description:
            "Your dedicated expert starts working on your request, coordinating documentation, filings, consultations, and approvals while keeping you informed throughout the process.",
        itemClassName: "bg-canvas border border-hairline",
        dark: false,
    },
    {
        icon: CheckCircle2,
        step: "04",
        title: "Delivered",
        description:
            "Once completed, you'll receive your documents, registrations, or expert solution along with continued support for any follow-up assistance you may need.",
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
            <div className="flex min-w-0 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
                <h3 className={`font-display text-2xl md:text-3xl font-medium leading-snug ${item.dark ? "text-white" : "text-ink"}`}>
                    {item.title}
                </h3>
                <p className={`text-base md:text-lg leading-relaxed text-justify ${item.dark ? "text-white/85" : "text-charcoal"}`}>{item.description}</p>
            </div>
        </div>
    );
}

function useDesktopStack() {
    const [isDesktopStack, setIsDesktopStack] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
        const update = () => setIsDesktopStack(query.matches);

        update();
        query.addEventListener("change", update);

        return () => query.removeEventListener("change", update);
    }, []);

    return isDesktopStack;
}

export function HowItWorksSection() {
    const isDesktopStack = useDesktopStack();

    return (
        <section className="bg-canvas pb-8 md:pb-10">
            <div className="sticky top-0 z-20 bg-canvas pt-14 pb-4 md:pt-18 md:pb-5">
                <div className="mx-auto max-w-7xl px-8">
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-[0.28px] text-graphite font-medium mb-2">
                            Simple process
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl text-ink font-medium">
                            How it works
                        </h2>
                    </div>
                </div>
            </div>

            {/* Mobile — plain visible stack */}
            {!isDesktopStack && (
                <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4">
                    {steps.map((item) => (
                        <div
                            key={item.step}
                            className={`${item.itemClassName} rounded-2xl min-h-72 p-6 shadow-[0_2px_8px_rgba(26,26,26,0.08)]`}
                        >
                            <StepCard item={item} />
                        </div>
                    ))}
                </div>
            )}

            {/* Desktop — animated ScrollStack */}
            {isDesktopStack && (
            <div className="hidden md:block">
                <ScrollStack
                    useWindowScroll
                    itemDistance={80}
                    itemScale={0.04}
                    itemStackDistance={20}
                    stackPosition="22%"
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
            )}
        </section>
    );
}
