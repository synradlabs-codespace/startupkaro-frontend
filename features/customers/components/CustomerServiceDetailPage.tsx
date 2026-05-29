"use client";

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { useCustomerServiceList } from "@/features/customers/hooks/useCustomerServices";
import { formatINR } from "@/lib/currency";
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
    Tax: { icon: FileText, color: "text-primary-brand", bg: "bg-tint-sky", badge: "bg-tint-sky text-primary-brand" },
    Business: { icon: Building2, color: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
    Legal: { icon: Scale, color: "text-charcoal", bg: "bg-fog", badge: "bg-fog text-charcoal" },
    License: { icon: FileCheck, color: "text-license-green", bg: "bg-license-green-light", badge: "bg-license-green-light text-license-green" },
};
const fallbackMeta = { icon: LayoutGrid, color: "text-slate", bg: "bg-surface", badge: "bg-surface text-slate" };

const highlights = [
    "100% legal compliance guaranteed",
    "Expert CA / CS assigned to your case",
    "Documents coordinated through official email",
    "Status updates by email and expert call",
];

export function CustomerServiceDetailPage({ id }: { id: string }) {
    const servicesQuery = useCustomerServiceList({ page: 1, limit: 100 });
    const service = (servicesQuery.data?.data ?? []).find((item) => item.id === id || item.slug === id);

    if (servicesQuery.isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <PageHeader title="Service" description="Loading service details" />
                <div className="p-6 text-sm text-slate">Loading service...</div>
            </div>
        );
    }

    if (servicesQuery.isError || !service) {
        return (
            <div className="flex flex-col min-h-screen">
                <PageHeader title="Service" description="Service details" />
                <div className="p-6 text-sm text-error-brand">Failed to load service</div>
            </div>
        );
    }

    const meta = categoryMeta[service.category] ?? fallbackMeta;
    const Icon = meta.icon;
    const serviceId = service.id || service.slug;

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
                    <div className="md:col-span-2 space-y-5">
                        <div className="rounded-xl bg-primary-brand p-6">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-semibold text-white">{service.name}</h2>
                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
                                            {service.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/80 leading-relaxed">{service.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-hairline bg-canvas p-6">
                            <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary-brand" />
                                What is Included
                            </h3>
                            <ul className="space-y-3">
                                {highlights.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-primary-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <ShieldCheck className="h-3 w-3 text-primary-brand" />
                                        </div>
                                        <span className="text-sm text-slate">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                        <div className="h-1.5 bg-primary-brand" />

                        <div className="p-6 space-y-5">
                            <div>
                                <p className="text-xs text-stone uppercase tracking-wide font-medium mb-1">Service Fee</p>
                                <p className="text-3xl font-display font-medium text-ink">
                                    {formatINR(service.price)}
                                </p>
                                <p className="text-xs text-stone flex items-center gap-1 mt-1.5">
                                    <Clock className="h-3 w-3" /> Delivered in {service.duration}
                                </p>
                            </div>

                            <div className="h-px bg-surface" />

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

                            <Link
                                href={`/customer/checkout?service=${serviceId}`}
                                className="flex items-center justify-center gap-2 w-full h-9 px-4 text-sm font-medium bg-primary-brand text-white hover:bg-primary-brand/90 rounded-lg transition-colors"
                            >
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <p className="text-[11px] text-center text-stone flex items-center justify-center gap-1.5">
                                <ShieldCheck className="h-3 w-3 text-primary-brand" />
                                Secured by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
