// features/marketing/components/sections/HowItWorksSection.tsx

import { MousePointerClick, Upload, FileCheck2, CheckCircle2 } from "lucide-react";

const steps = [
    {
        icon: MousePointerClick,
        step: "01",
        title: "Choose a service",
        description: "Browse our catalogue and pick the service your startup needs, pricing is fixed and transparent.",
        iconBg: "bg-[#FF9933]/10",
        iconColor: "text-[#FF9933]",
        stepColor: "text-[#FF9933]",
    },
    {
        icon: Upload,
        step: "02",
        title: "Share your documents",
        description: "Upload the required documents securely through our portal. We tell you exactly what's needed.",
        iconBg: "bg-[#000080]/8",
        iconColor: "text-[#000080]",
        stepColor: "text-[#000080]",
    },
    {
        icon: FileCheck2,
        step: "03",
        title: "We file for you",
        description: "Our CA / CS reviews and files everything with the relevant government authority on your behalf.",
        iconBg: "bg-[#6BAE3A]/10",
        iconColor: "text-[#6BAE3A]",
        stepColor: "text-[#6BAE3A]",
    },
    {
        icon: CheckCircle2,
        step: "04",
        title: "You're compliant",
        description: "Receive your registration certificate, licence, or filed return, and stay compliant from day one.",
        iconBg: "bg-[#FF9933]/10",
        iconColor: "text-[#FF9933]",
        stepColor: "text-[#FF9933]",
    },
];

export function HowItWorksSection() {
    return (
        <section className="bg-gray-50/60 py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold text-[#FF9933] uppercase tracking-wider mb-2">Simple process</p>
                    <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal">How it works</h2>
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
                                <div className={`h-10 w-10 rounded-2xl ${item.iconBg} flex items-center justify-center mb-4 shrink-0`}>
                                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                                </div>
                                <span className={`text-[10px] font-mono font-bold ${item.stepColor} tracking-widest mb-2`}>{item.step}</span>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
