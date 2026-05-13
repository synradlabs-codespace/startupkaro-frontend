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
const fallbackMeta = { icon: LayoutGrid, color: "text-slate", bg: "bg-surface", badge: "bg-surface text-slate" };

const highlights = [
    "100% legal compliance guaranteed",
    "Expert CA / CS assigned to your case",
    "Documents coordinated through official email",
    "Status updates by email and expert call",
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
                    <Link href="/customer/services" className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-steel hover:text-charcoal hover:bg-surface rounded-lg transition-colors">
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
                        <div className="relative overflow-hidden rounded-lg border border-hairline bg-accent-customer p-6">
                            <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary-brand/8 blur-3xl" />
                            <div className="flex items-start gap-4">
                                <div className={`h-12 w-12 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                                    <Icon className={`h-6 w-6 ${meta.color}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-semibold text-ink">{service.name}</h2>
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                                            {service.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-steel leading-relaxed">{service.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* What's included */}
                        <div className="rounded-lg border border-hairline bg-canvas p-6">
                            <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-charcoal" />
                                What is Included
                            </h3>
                            <ul className="space-y-3">
                                {highlights.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-primary-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <ShieldCheck className="h-3 w-3 text-charcoal" />
                                        </div>
                                        <span className="text-sm text-slate">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ── Right: Pricing card ─────────────── */}
                    <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                        {/* Card header accent */}
                        <div className="h-1.5 bg-gradient-to-r from-primary-brand to-accent-customer" />

                        <div className="p-6 space-y-5">
                            {/* Price */}
                            <div>
                                <p className="text-xs text-stone uppercase tracking-wide font-medium mb-1">Service Fee</p>
                                <p className="text-3xl font-bold text-ink">
                                    ₹{service.price.toLocaleString("en-IN")}
                                </p>
                                <p className="text-xs text-stone flex items-center gap-1 mt-1.5">
                                    <Clock className="h-3 w-3" /> Delivered in {service.duration}
                                </p>
                            </div>

                            <div className="h-px bg-surface" />

                            {/* Details */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-steel flex items-center gap-1.5">
                                        <Tag className="h-3 w-3" /> Category
                                    </span>
                                    <span className={`font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                                        {service.category}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-steel flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" /> Processing Time
                                    </span>
                                    <span className="font-medium text-charcoal">{service.duration}</span>
                                </div>
                            </div>

                            <div className="h-px bg-surface" />

                            {/* CTA */}
                            <Link
                                href={`/customer/checkout?service=${service.id}`}
                                className="flex items-center justify-center gap-2 w-full h-9 px-4 text-sm font-medium bg-primary-brand text-white hover:bg-primary-brand/90 rounded-lg transition-colors"
                            >
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            {/* Trust note */}
                            <p className="text-[11px] text-center text-stone flex items-center justify-center gap-1.5">
                                <ShieldCheck className="h-3 w-3 text-charcoal" />
                                Secured by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
