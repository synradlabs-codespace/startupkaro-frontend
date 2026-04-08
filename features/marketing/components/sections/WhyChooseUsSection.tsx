// features/marketing/components/sections/WhyChooseUsSection.tsx

import { Users, Globe, Tag, BarChart3 } from "lucide-react";

const reasons = [
    {
        icon: Users,
        title: "Expert CA & CS team",
        description: "Every filing is handled by a qualified Chartered Accountant or Company Secretary — not a software bot.",
        accent: "bg-violet-50 text-violet-600",
    },
    {
        icon: Globe,
        title: "100% online",
        description: "No office visits, no courier delays. Upload documents, sign digitally, and track progress — all online.",
        accent: "bg-blue-50 text-blue-600",
    },
    {
        icon: Tag,
        title: "Fixed, transparent pricing",
        description: "What you see is what you pay. Government fees are included. No surprises at checkout.",
        accent: "bg-[#FF9933]/10 text-[#FF9933]",
    },
    {
        icon: BarChart3,
        title: "Real-time status updates",
        description: "Track every step of your application in your dashboard. Know exactly where your filing stands.",
        accent: "bg-teal-50 text-teal-600",
    },
];

export function WhyChooseUsSection() {
    return (
        <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold text-[#FF9933] uppercase tracking-wider mb-2">Our edge</p>
                    <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal">Why founders choose us</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reasons.map((reason) => {
                        const Icon = reason.icon;
                        return (
                            <div
                                key={reason.title}
                                className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-6 space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${reason.accent}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{reason.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{reason.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
