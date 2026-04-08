// features/customers/components/CustomerServiceDetailPage.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { mockServices } from "@/lib/mock-data";
import {
    Clock,
    ShieldCheck,
    ArrowRight,
    FileText,
    Building2,
    Scale,
    FileCheck,
    LayoutGrid,
    CheckCircle2,
    Tag,
    ArrowLeft,
} from "lucide-react";

const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
    Tax: { icon: FileText, color: "text-violet-600", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700" },
    Business: { icon: Building2, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
    Legal: { icon: Scale, color: "text-rose-600", bg: "bg-rose-50", badge: "bg-rose-100 text-rose-700" },
    License: { icon: FileCheck, color: "text-teal-600", bg: "bg-teal-50", badge: "bg-teal-100 text-teal-700" },
};
const fallbackMeta = { icon: LayoutGrid, color: "text-gray-600", bg: "bg-gray-100", badge: "bg-gray-100 text-gray-600" };

const highlights = [
    "100% legal compliance guaranteed",
    "Expert CA / CS assigned to your case",
    "End-to-end document handling",
    "Real-time status updates",
];

export function CustomerServiceDetailPage({ id }: { id: string }) {
    const service = mockServices.find((s) => s.id === id) ?? mockServices[0];
    const meta = categoryMeta[service.category] ?? fallbackMeta;
    const Icon = meta.icon;

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={service.name}
                description={service.category}
                action={
                    <Link href="/customer/services" className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back
                    </Link>
                }
            />

            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                    {/* ── Left: Service details ───────────── */}
                    <div className="md:col-span-2 space-y-5">

                        {/* Hero banner */}
                        <div className="relative overflow-hidden rounded-2xl border border-[#FF9933]/15 bg-gradient-to-br from-[#FF9933]/8 via-white/90 to-orange-50/50 p-6">
                            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#FF9933]/8 blur-3xl" />
                            <div className="flex items-start gap-4">
                                <div className={`h-12 w-12 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
                                    <Icon className={`h-6 w-6 ${meta.color}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-semibold text-gray-900">{service.name}</h2>
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                                            {service.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* What's included */}
                        <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#FF9933]" />
                                What's Included
                            </h3>
                            <ul className="space-y-3">
                                {highlights.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-[#FF9933]/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <ShieldCheck className="h-3 w-3 text-[#FF9933]" />
                                        </div>
                                        <span className="text-sm text-gray-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ── Right: Pricing card ─────────────── */}
                    <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                        {/* Card header accent */}
                        <div className="h-1.5 bg-gradient-to-r from-[#FF9933] to-orange-300" />

                        <div className="p-6 space-y-5">
                            {/* Price */}
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Service Fee</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{service.price.toLocaleString("en-IN")}
                                </p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1.5">
                                    <Clock className="h-3 w-3" /> Delivered in {service.duration}
                                </p>
                            </div>

                            <div className="h-px bg-gray-100" />

                            {/* Details */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500 flex items-center gap-1.5">
                                        <Tag className="h-3 w-3" /> Category
                                    </span>
                                    <span className={`font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                                        {service.category}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500 flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" /> Processing Time
                                    </span>
                                    <span className="font-medium text-gray-800">{service.duration}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100" />

                            {/* CTA */}
                            <Link
                                href={`/customer/checkout?service=${service.id}`}
                                className="flex items-center justify-center gap-2 w-full h-9 px-4 text-sm font-medium bg-[#FF9933] text-white hover:bg-[#FF9933]/90 rounded-xl transition-colors"
                            >
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            {/* Trust note */}
                            <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1.5">
                                <ShieldCheck className="h-3 w-3 text-[#FF9933]" />
                                Secured by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
