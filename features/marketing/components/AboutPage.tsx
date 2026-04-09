// features/marketing/components/AboutPage.tsx

import Link from "next/link";
import { ArrowRight, Shield, Clock, Users, Award } from "lucide-react";

const stats = [
    { value: "500+", label: "Businesses served" },
    { value: "6", label: "Core services" },
    { value: "7 days", label: "Avg. GST turnaround" },
    { value: "100%", label: "Expert CA/CS handled" },
];

const values = [
    {
        icon: Shield,
        color: "#FF9933",
        title: "Compliance-first",
        description:
            "Every service we offer is designed around keeping your business fully compliant with Indian law — no shortcuts, no guesswork.",
    },
    {
        icon: Clock,
        color: "#000080",
        title: "Transparent timelines",
        description:
            "We quote real timelines and stick to them. Government delays happen — we keep you informed every step of the way.",
    },
    {
        icon: Users,
        color: "#6BAE3A",
        title: "Human experts, always",
        description:
            "A dedicated CA or CS is assigned to your case. You get a real professional — not a chatbot or a generic form submission.",
    },
    {
        icon: Award,
        color: "#FF9933",
        title: "Fixed pricing, zero surprises",
        description:
            "Government fees, professional charges, and any incidentals are included in our flat pricing upfront. What we quote is what you pay.",
    },
];

const services = [
    { name: "GST Registration", category: "Tax", slug: "gst-registration" },
    { name: "Company Incorporation", category: "Business", slug: "company-incorporation" },
    { name: "Trademark Filing", category: "Legal", slug: "trademark-filing" },
    { name: "Income Tax Filing", category: "Tax", slug: "income-tax-filing" },
    { name: "FSSAI License", category: "License", slug: "fssai-license" },
    { name: "Import Export Code", category: "License", slug: "import-export-code" },
];

export function AboutPage() {
    return (
        <div className="bg-white">

            {/* Hero */}
            <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-24">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50" />
                {/* Tricolor top bar */}
                <div className="absolute top-0 left-0 right-0 flex h-1">
                    <div className="flex-1 bg-[#FF9933]" />
                    <div className="flex-1 bg-white border-t border-gray-200" />
                    <div className="flex-1 bg-[#6BAE3A]" />
                </div>
                <div className="relative mx-auto max-w-4xl text-center">
                    <p className="text-xs tracking-[0.3em] uppercase font-mono font-medium text-[#FF9933] mb-4">
                        About StartupKaro
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-serif font-normal text-gray-900 leading-tight mb-6">
                        India&apos;s compliance partner<br className="hidden sm:block" /> for growing businesses
                    </h1>
                    <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        StartupKaro was built for founders, freelancers, and small business owners who want to spend less time
                        navigating paperwork and more time building. We handle the legal and compliance work — end to end.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="border-y border-gray-100 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="text-3xl font-serif font-semibold text-gray-900">{s.value}</p>
                            <p className="mt-1 text-sm text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className="px-4 sm:px-6 lg:px-8 py-20 mx-auto max-w-3xl">
                <p className="text-xs tracking-[0.3em] uppercase font-mono font-medium text-[#000080] mb-4">
                    Our mission
                </p>
                <h2 className="text-3xl font-serif font-normal text-gray-900 mb-6 leading-snug">
                    Making compliance accessible for every Indian business
                </h2>
                <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
                    <p>
                        Starting a business in India has historically meant months of back-and-forth with consultants,
                        government portals, and mountains of documentation. For most first-time founders, it&apos;s overwhelming.
                    </p>
                    <p>
                        We built StartupKaro to change that. Our platform combines qualified professionals — Chartered Accountants,
                        Company Secretaries, and legal experts — with a simple, transparent process so that any business owner
                        can get legally set up and stay compliant, without needing to become a compliance expert themselves.
                    </p>
                    <p>
                        We serve startups from day one through their growth journey — beginning with company registration and
                        GST, and continuing with ongoing tax filing, payroll, accounting, and regulatory compliance as they scale.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="bg-gray-50 border-y border-gray-100 px-4 sm:px-6 lg:px-8 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <p className="text-xs tracking-[0.3em] uppercase font-mono font-medium text-[#6BAE3A] mb-4">
                            How we work
                        </p>
                        <h2 className="text-3xl font-serif font-normal text-gray-900">What we stand for</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {values.map((v) => (
                            <div key={v.title} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
                                <div
                                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${v.color}18` }}
                                >
                                    <v.icon className="h-5 w-5" style={{ color: v.color }} />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1">{v.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="px-4 sm:px-6 lg:px-8 py-20 mx-auto max-w-5xl">
                <div className="text-center mb-12">
                    <p className="text-xs tracking-[0.3em] uppercase font-mono font-medium text-[#FF9933] mb-4">
                        What we offer
                    </p>
                    <h2 className="text-3xl font-serif font-normal text-gray-900">Our services</h2>
                    <p className="mt-3 text-sm text-gray-500 max-w-xl mx-auto">
                        Fixed services at fixed prices — delivered by qualified professionals.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((svc) => (
                        <Link
                            key={svc.slug}
                            href={`/services/${svc.slug}`}
                            className="group border border-gray-100 rounded-2xl p-5 bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200 flex items-center justify-between"
                        >
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">{svc.category}</p>
                                <p className="text-[14px] font-medium text-gray-900">{svc.name}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#FF9933] hover:text-[#FF9933]/80 transition-colors"
                    >
                        View all services
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-gray-100 bg-gray-50 px-4 sm:px-6 lg:px-8 py-20">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-serif font-normal text-gray-900 mb-4">
                        Ready to get started?
                    </h2>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        Tell us what you need and we&apos;ll match you with the right service and a dedicated expert.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/services"
                            className="h-10 px-6 rounded-xl bg-[#FF9933] text-white text-sm font-medium hover:bg-[#FF9933]/90 transition-colors inline-flex items-center gap-2"
                        >
                            Browse services
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/contact"
                            className="h-10 px-6 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center"
                        >
                            Talk to us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
