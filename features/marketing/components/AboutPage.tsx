// features/marketing/components/AboutPage.tsx

import Link from "next/link";
import { ArrowRight, Shield, Clock, Users, Award } from "lucide-react";
import { MarketingCTASection } from "./sections/MarketingCTASection";

const stats = [
    { value: "500+", label: "Businesses served" },
    { value: "6", label: "Core services" },
    { value: "7 days", label: "Avg. GST turnaround" },
    { value: "100%", label: "Expert CA/CS handled" },
];

const values = [
    {
        icon: Shield,
        tint: "bg-primary-soft",
        title: "Compliance-first",
        description:
            "Every service we offer is designed around keeping your business fully compliant with Indian law, no shortcuts, no guesswork.",
    },
    {
        icon: Clock,
        tint: "bg-primary-soft",
        title: "Transparent timelines",
        description:
            "We quote real timelines and stick to them. Government delays happen, we keep you informed every step of the way.",
    },
    {
        icon: Users,
        tint: "bg-primary-soft",
        title: "Human experts, always",
        description:
            "A dedicated CA or CS is assigned to your case. You get a real professional, not a chatbot or a generic form submission.",
    },
    {
        icon: Award,
        tint: "bg-primary-soft",
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
        <div className="bg-canvas py-6">

            {/* Hero */}
            <section className="relative mx-4 max-w-7xl overflow-hidden rounded-2xl border border-hairline bg-canvas px-8 pb-24 pt-20 text-center sm:mx-6 lg:mx-auto">
                <div className="relative mx-auto max-w-4xl">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                        About StartupKaro
                    </p>
                    <h1 className="mb-6 font-display text-4xl font-medium leading-none text-ink md:text-6xl">
                        India&apos;s compliance partner<br className="hidden sm:block" /> for growing businesses
                    </h1>
                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-charcoal">
                        StartupKaro was built for founders, freelancers, and small business owners who want to spend less time
                        navigating paperwork and more time building. We handle the legal and compliance work, end to end.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="mt-6 mx-4 max-w-7xl rounded-2xl border border-hairline bg-cloud px-8 py-12 sm:mx-6 lg:mx-auto">
                <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="font-display text-3xl font-medium text-ink">{s.value}</p>
                            <p className="mt-1 text-sm leading-relaxed text-charcoal">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="max-w-3xl border-y border-hairline py-10">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                        Our mission
                    </p>
                    <h2 className="mb-6 font-display text-2xl font-medium leading-snug text-ink md:text-3xl">
                        Making compliance accessible for every Indian business
                    </h2>
                    <div className="space-y-4 text-base leading-relaxed text-charcoal">
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
            <section className="bg-cloud px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.28px] text-graphite">How we work</p>
                        <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">What we stand for</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {values.map((v) => (
                            <div key={v.title} className="flex gap-4 rounded-xl border border-hairline bg-canvas p-6 transition-colors duration-200 hover:border-primary-brand">
                                <div className={`h-10 w-10 rounded-xl ${v.tint} flex items-center justify-center shrink-0`}>
                                    <v.icon className="h-5 w-5 text-primary-brand" />
                                </div>
                                <div>
                                    <h3 className="mb-1 text-base font-medium text-ink">{v.title}</h3>
                                    <p className="text-sm leading-relaxed text-charcoal">{v.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.28px] text-graphite">What we offer</p>
                        <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">Our services</h2>
                        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-charcoal">
                            Fixed services at fixed prices, delivered by qualified professionals.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((svc) => (
                            <Link
                                key={svc.slug}
                                href={`/services/${svc.slug}`}
                                className="group flex items-center justify-between rounded-xl border border-hairline bg-canvas p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-brand"
                            >
                                <div>
                                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.28px] text-graphite">{svc.category}</p>
                                    <p className="text-sm font-medium text-ink">{svc.name}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-graphite transition-all group-hover:translate-x-0.5 group-hover:text-primary-brand" />
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary-brand transition-colors hover:text-primary-deep"
                        >
                            View all services
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <MarketingCTASection
                title="Ready to get started?"
                description="Tell us what you need and we'll match you with the right service and a dedicated expert."
                primaryText="Explore Services"
                trustText="Fixed pricing - Human expert support - 100% online"
            />
        </div>
    );
}
