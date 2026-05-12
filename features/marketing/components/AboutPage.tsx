// features/marketing/components/AboutPage.tsx

import Link from "next/link";
import { ArrowRight, Shield, Clock, Users, Award } from "lucide-react";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";

const stats = [
    { value: "500+", label: "Businesses served" },
    { value: "6", label: "Core services" },
    { value: "7 days", label: "Avg. GST turnaround" },
    { value: "100%", label: "Expert CA/CS handled" },
];

const values = [
    {
        icon: Shield,
        tint: "bg-tint-peach",
        title: "Compliance-first",
        description:
            "Every service we offer is designed around keeping your business fully compliant with Indian law, no shortcuts, no guesswork.",
    },
    {
        icon: Clock,
        tint: "bg-tint-sky",
        title: "Transparent timelines",
        description:
            "We quote real timelines and stick to them. Government delays happen, we keep you informed every step of the way.",
    },
    {
        icon: Users,
        tint: "bg-tint-mint",
        title: "Human experts, always",
        description:
            "A dedicated CA or CS is assigned to your case. You get a real professional, not a chatbot or a generic form submission.",
    },
    {
        icon: Award,
        tint: "bg-tint-lavender",
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">

            {/* Hero */}
            <section className="bg-tint-cream rounded-2xl px-8 pt-20 pb-24 text-center relative overflow-hidden">
                <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-tint-mint/50 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-tint-sky/50 blur-3xl" />
                <div className="relative mx-auto max-w-4xl">
                    <p className="text-xs uppercase tracking-[0.28px] text-steel font-medium mb-4">
                        About StartupKaro
                    </p>
                    <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-ink leading-tight mb-6">
                        India&apos;s compliance partner<br className="hidden sm:block" /> for growing businesses
                    </h1>
                    <p className="text-base text-slate max-w-2xl mx-auto leading-relaxed">
                        StartupKaro was built for founders, freelancers, and small business owners who want to spend less time
                        navigating paperwork and more time building. We handle the legal and compliance work, end to end.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-surface rounded-2xl py-12 px-8">
                <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="text-3xl font-display font-semibold tracking-tight text-ink">{s.value}</p>
                            <p className="mt-1 text-sm text-slate leading-relaxed">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className="bg-canvas rounded-2xl px-8 py-16 mx-auto">
                <div className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.28px] text-steel font-medium mb-4">
                        Our mission
                    </p>
                    <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-ink mb-6 leading-snug">
                        Making compliance accessible for every Indian business
                    </h2>
                    <div className="space-y-4 text-base text-slate leading-relaxed">
                        <p>
                            Starting a business in India has historically meant months of back-and-forth with consultants,
                            government portals, and mountains of documentation. For most first-time founders, it&apos;s overwhelming.
                        </p>
                        <p>
                            We built StartupKaro to change that. Our platform combines qualified professionals, Chartered Accountants,
                            Company Secretaries, and legal experts, with a simple, transparent process so that any business owner
                            can get legally set up and stay compliant, without needing to become a compliance expert themselves.
                        </p>
                        <p>
                            We serve startups from day one through their growth journey, beginning with company registration and
                            GST, and continuing with ongoing tax filing, payroll, accounting, and regulatory compliance as they scale.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-tint-sky rounded-2xl px-8 py-16">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <p className="text-xs uppercase tracking-[0.28px] text-steel font-medium mb-4">How we work</p>
                        <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-ink">What we stand for</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {values.map((v) => (
                            <div key={v.title} className="bg-canvas rounded-xl border border-hairline p-6 flex gap-4">
                                <div className={`h-10 w-10 rounded-xl ${v.tint} flex items-center justify-center shrink-0`}>
                                    <v.icon className="h-5 w-5 text-charcoal" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-ink mb-1">{v.title}</h3>
                                    <p className="text-sm text-slate leading-relaxed">{v.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="bg-canvas rounded-2xl px-8 py-16">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <p className="text-xs uppercase tracking-[0.28px] text-steel font-medium mb-4">What we offer</p>
                        <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-ink">Our services</h2>
                        <p className="mt-3 text-base text-slate leading-relaxed max-w-xl mx-auto">
                            Fixed services at fixed prices, delivered by qualified professionals.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((svc) => (
                            <Link
                                key={svc.slug}
                                href={`/services/${svc.slug}`}
                                className="group border border-hairline rounded-xl p-5 bg-canvas hover:bg-surface transition-all duration-200 flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.28px] text-stone mb-1">{svc.category}</p>
                                    <p className="text-sm text-ink">{svc.name}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-stone group-hover:text-charcoal group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-charcoal transition-colors"
                        >
                            View all services
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-tint-peach rounded-2xl px-8 py-16 text-center">
                <div className="mx-auto max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-ink mb-4">
                        Ready to get started?
                    </h2>
                    <p className="text-base text-slate mb-8 leading-relaxed">
                        Tell us what you need and we&apos;ll match you with the right service and a dedicated expert.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <FlowButton
                            href="/services"
                            text="Explore Services"
                            iconName="briefcase"
                            colorVariant="navy"
                        />
                        <FlowSecondaryButton
                            href="/contact"
                            text="Talk to an Expert"
                            iconName="message-circle"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
