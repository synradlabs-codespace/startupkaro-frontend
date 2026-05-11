// features/marketing/components/sections/HowItWorksSection.tsx

import { MousePointerClick, Upload, FileCheck2, CheckCircle2 } from "lucide-react";

const steps = [
    {
        icon: MousePointerClick,
        step: "01",
        title: "Choose a service",
        description: "Browse our catalogue and pick the service your startup needs, pricing is fixed and transparent.",
        iconBg: "bg-coral/10",
        iconColor: "text-coral",
        stepColor: "text-coral",
    },
    {
        icon: Upload,
        step: "02",
        title: "Share your documents",
        description: "Upload the required documents securely through our portal. We tell you exactly what's needed.",
        iconBg: "bg-primary-brand/8",
        iconColor: "text-primary-brand",
        stepColor: "text-primary-brand",
    },
    {
        icon: FileCheck2,
        step: "03",
        title: "We file for you",
        description: "Our CA / CS reviews and files everything with the relevant government authority on your behalf.",
        iconBg: "bg-deep-green/10",
        iconColor: "text-deep-green",
        stepColor: "text-deep-green",
    },
    {
        icon: CheckCircle2,
        step: "04",
        title: "You're compliant",
        description: "Receive your registration certificate, licence, or filed return, and stay compliant from day one.",
        iconBg: "bg-coral/10",
        iconColor: "text-coral",
        stepColor: "text-coral",
    },
];

export function HowItWorksSection() {
    return (
        <section className="bg-white py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="font-mono text-xs uppercase tracking-[0.28px] text-coral mb-2">Simple process</p>
                    <h2 className="font-display text-4xl md:text-5xl text-ink font-normal tracking-tight">How it works</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.step} className="relative flex flex-col items-start">
                                {/* Connector line (between cards on desktop) */}
                                {idx < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-5 left-[calc(100%+0px)] w-full h-px border-t border-dashed border-gray-300 -translate-x-1/2" />
                                )}
                                <div className={`h-10 w-10 rounded-lg ${item.iconBg} flex items-center justify-center mb-4 shrink-0`}>
                                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                                </div>
                                <span className={`font-mono text-xs uppercase tracking-[0.28px] ${item.stepColor} mb-2`}>{item.step}</span>
                                <h3 className="font-display text-base font-normal text-ink mb-1.5">{item.title}</h3>
                                <p className="text-sm text-body-muted leading-relaxed">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
