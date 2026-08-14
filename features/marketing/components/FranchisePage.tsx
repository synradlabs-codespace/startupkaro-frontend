"use client";

import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";
import {
    ArrowRight,
    BadgeCheck,
    BookOpenCheck,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    FileSignature,
    Globe2,
    Handshake,
    Landmark,
    MapPinned,
    Network,
    Rocket,
    Scale,
    ShieldCheck,
    Sparkles,
    Store,
    Target,
    TrendingUp,
    Users,
} from "lucide-react";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";
import { BasicNumberTicker, LetterSwap } from "@/components/fancy/text";
import { MarketingCTASection } from "./sections/MarketingCTASection";

const EASE = [0.16, 1, 0.3, 1] as const;

const expertise = [
    {
        title: "Franchise Modelling",
        description: "Transform a successful business into a scalable franchise with the right model, fee structure, royalty system, SOPs, unit economics, and operating framework.",
        icon: Building2,
        tone: "bg-tint-sky text-primary-brand border-primary-brand/20",
    },
    {
        title: "National & International Expansion",
        description: "Expand across India and global markets with structured market entry, localization, partner strategy, and expansion planning tailored to your brand.",
        icon: Globe2,
        tone: "bg-[#e9fbfb] text-[#14a8a8] border-[#14a8a8]/20",
    },
    {
        title: "Franchise Strategy & Growth Consulting",
        description: "Develop a long-term franchise roadmap covering pricing, partner selection, operational scalability, market prioritization, and sustainable business growth.",
        icon: TrendingUp,
        tone: "bg-[#eef8ea] text-[#4f9c3f] border-[#4f9c3f]/20",
    },
    {
        title: "Franchise Agreements & Legal Structuring",
        description: "Professionally drafted franchise, master franchise, area development, licensing, NDA, MOU, and commercial contracts designed to protect your business.",
        icon: FileSignature,
        tone: "bg-[#f1ecff] text-[#6f46d8] border-[#6f46d8]/20",
    },
    {
        title: "Trademark & Intellectual Property Protection",
        description: "Protect your brand identity with trademark registration, copyright protection, licensing structures, IP portfolio management, and international trademark advisory.",
        icon: ShieldCheck,
        tone: "bg-[#fff6df] text-[#f0a51a] border-[#f0a51a]/25",
    },
    {
        title: "Business Registrations & Regulatory Compliance",
        description: "Complete support for company incorporation, GST, FSSAI, MSME, ROC, FEMA, RBI, and statutory compliances required for seamless expansion.",
        icon: Landmark,
        tone: "bg-[#fff1e7] text-[#f97316] border-[#f97316]/20",
    },
    {
        title: "Franchise Partner Acquisition",
        description: "Identify, evaluate, negotiate, and onboard the right franchise partners through a structured, transparent selection and qualification process.",
        icon: Handshake,
        tone: "bg-tint-sky text-primary-brand border-primary-brand/20",
    },
    {
        title: "Launch, Scale & Ongoing Support",
        description: "From the first franchise outlet to a national or international network, get continuous legal, operational, compliance, and strategic support.",
        icon: Rocket,
        tone: "bg-[#eef8ea] text-[#4f9c3f] border-[#4f9c3f]/20",
    },
];

const process = [
    { number: "01", title: "Discovery & Business Assessment", description: "We understand your business, evaluate franchise readiness, and define your expansion goals.", icon: Target },
    { number: "02", title: "Franchise Modelling", description: "We create your complete franchise ecosystem, including model, fees, royalties, SOPs, unit economics, and operations.", icon: BookOpenCheck },
    { number: "03", title: "Legal & Brand Protection", description: "Our experts prepare agreements, register trademarks, establish licensing structures, and complete required compliances.", icon: ShieldCheck },
    { number: "04", title: "Expansion Strategy", description: "We identify high-potential markets, expansion opportunities, and the most suitable franchise growth strategy.", icon: MapPinned },
    { number: "05", title: "Partner Acquisition", description: "We assist in identifying, evaluating, negotiating, and onboarding partners aligned with your brand vision.", icon: Handshake },
    { number: "06", title: "Launch & Scale", description: "From your first franchise to an international network, we provide continuous support for sustainable expansion.", icon: Network },
];

const outcomes = [
    "Scalable Franchise Models",
    "Investor-Ready Business Structures",
    "Legally Protected Brands",
    "Expansion-Ready Businesses",
    "National Franchise Networks",
    "International Master Franchises",
    "Standard Operating Procedures",
    "Sustainable Growth Systems",
];

const reasons = [
    "End-to-end franchise consulting",
    "National and international expansion expertise",
    "Franchise modelling and business structuring",
    "Legal, tax, and compliance under one roof",
    "Experienced CAs, CSs, lawyers, and business consultants",
    "Ongoing growth and operational support",
];

const industries = [
    { title: "Restaurants & Cafes", accent: "bg-[#4A1F12]" },
    { title: "Retail & Fashion", accent: "bg-primary-brand" },
    { title: "Education & EdTech", accent: "bg-[#E8A23A]" },
    { title: "Healthcare & Clinics", accent: "bg-[#5F7D3A]" },
    { title: "Beauty & Wellness", accent: "bg-[#ff5050]" },
    { title: "Fitness & Gyms", accent: "bg-[#356373]" },
    { title: "Hospitality & Hotels", accent: "bg-[#6f46d8]" },
    { title: "Cloud Kitchens", accent: "bg-[#f97316]" },
    { title: "Professional Services", accent: "bg-ink" },
    { title: "Home Services", accent: "bg-[#14a8a8]" },
    { title: "Automotive", accent: "bg-[#636363]" },
    { title: "Technology & SaaS", accent: "bg-[#296ef9]" },
];

const markets = ["India", "UAE", "UK", "USA", "Canada", "Australia", "Singapore", "Europe"];

const storyRoles = [
    "Franchise Modelling & Business Structuring",
    "Franchise Agreements & Master Franchise Documentation",
    "Trademark & Intellectual Property Protection",
    "National & International Franchise Strategy",
    "Brand Licensing Framework",
    "Company Structuring & Regulatory Compliance",
    "International Business Expansion Support",
    "Continuous Legal & Strategic Advisory",
];

const impact = [
    "Expanding across India and international markets",
    "Growing multi-location franchise network",
    "Complete trademark and IP protection",
    "Structured for scalable growth",
    "Long-term strategic partnership",
];

const timeline = [
    "Brand Founded",
    "Franchise Model Developed",
    "Legal Framework",
    "IP Protected",
    "National Expansion",
    "International Expansion",
    "Growing Network",
];

const caseStudyStages = [
    {
        label: "Foundation",
        title: "Franchise model developed",
        description: "We converted the operating model into a repeatable franchise structure with partner economics, documentation, and brand controls.",
        icon: Building2,
    },
    {
        label: "Protection",
        title: "Legal and IP secured",
        description: "The franchise framework was backed by agreements, licensing logic, trademark protection, and compliance-ready business structuring.",
        icon: ShieldCheck,
    },
    {
        label: "Expansion",
        title: "Built for India and global markets",
        description: "The brand was prepared for multi-location growth with national and international expansion planning.",
        icon: Globe2,
    },
];

const heroStats = [
    { value: 30, suffix: "+", label: "Countries", icon: Globe2 },
    { value: 1000, suffix: "+", label: "Franchises Launched", icon: Store },
    { value: 500, suffix: "+", label: "Happy Brands", icon: Users },
    { value: 15, suffix: "+", label: "Years of Expertise", icon: TrendingUp },
];

const storyStats = [
    { value: 200, suffix: "+", label: "Target store network" },
    { value: 8, suffix: "", label: "Expansion workstreams" },
    { value: 6, suffix: "", label: "Scale phases" },
];

const helpPreview = [
    { number: "01", title: "Market Research", description: "We analyze markets to find the right opportunities for your brand.", icon: Globe2 },
    { number: "02", title: "Strategy & Planning", description: "Custom expansion strategy including model, pricing, and legal structure.", icon: Target },
    { number: "03", title: "Partner Onboarding", description: "We help you find, evaluate, and onboard the right franchise partners.", icon: Handshake },
    { number: "04", title: "Launch & Scale", description: "End-to-end support in launch, marketing, and operations to scale globally.", icon: TrendingUp },
];

const reveal: Variants = {
    hidden: { opacity: 0, y: 34 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

function useRevealProps() {
    const reduceMotion = useReducedMotion();

    return {
        reduceMotion,
        revealProps: reduceMotion
            ? {}
            : {
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true, amount: 0.2 },
            },
    };
}

export function FranchisePage() {
    const { revealProps } = useRevealProps();

    return (
        <main className="overflow-hidden bg-canvas">
            <HeroSection />
            <HeroStatsSection />
            <HelpPreviewSection />
            <AboutServiceSection />
            <ExpertiseSection />
            <ProcessSection />
            <OutcomesSection />
            <WhyStartupKaroSection />
            <IndustriesSection />
            <GlobalExpansionSection />
            <SuccessStorySection />
            <motion.div {...revealProps} variants={reveal} className="py-10 md:py-14">
                <MarketingCTASection
                    eyebrow="Ready to scale?"
                    title={
                        <>
                            BUILD THE NEXT FRANCHISE <span className="text-primary-brand">SUCCESS STORY</span>
                        </>
                    }
                    description={
                        <>
                            Whether you are planning your first franchise outlet or expanding into international markets, our experts can guide every stage of your journey.
                            <br />
                            Start with a focused franchise consultation.
                        </>
                    }
                    primaryText="Book Consultation"
                    primaryHref="/contact?service=franchise-consulting"
                    secondaryText="Explore Services"
                    secondaryHref="/services"
                    trustText="Strategy - Legal - Compliance - Expansion"
                />
            </motion.div>
        </main>
    );
}

function HeroSection() {
    const { reduceMotion, revealProps } = useRevealProps();

    return (
        <section className="relative bg-canvas px-4 pb-10 pt-7 sm:px-6 md:pb-12 md:pt-11 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.82fr_1.18fr]">
                <motion.div {...revealProps} variants={reveal} className="max-w-3xl">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-graphite">
                        Expand Beyond Borders
                    </p>
                    <h1 className="font-display text-4xl font-medium leading-none text-ink md:text-6xl">
                        Franchises Expand <span className="block text-primary-brand">All Over the World</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-charcoal md:text-lg">
                        From local success to global presence, we help brands scale smarter with the right strategy, partners, legal structure, and expert guidance.
                    </p>
                    <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                        <FlowButton href="/contact?service=franchise-consulting" text="Book Consultation" iconName="rocket" className="h-11 w-full sm:w-auto" wrapperClassName="w-full sm:w-auto" />
                        <div className="flex items-center gap-3">
                            <Image
                                src="/assets/circle-avatars-crop.webp"
                                alt=""
                                width={118}
                                height={42}
                                className="h-10 w-[118px] object-contain"
                            />
                            <p className="text-sm font-semibold leading-tight text-ink">
                                5000+ Happy<br />
                                <span className="font-medium text-charcoal">clients</span>
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div {...revealProps} variants={reveal} className="relative min-h-[430px] overflow-hidden rounded-2xl bg-canvas">
                    <WorldExpansionMap reduceMotion={reduceMotion} />
                </motion.div>
            </div>
        </section>
    );
}

function WorldExpansionMap({ reduceMotion }: { reduceMotion: boolean | null }) {
    const { countryPaths, projection } = useMemo(() => {
        const projection = geoNaturalEarth1().fitSize([760, 390], { type: "Sphere" });
        const path = geoPath(projection);
        const topology = countries110m as unknown as { objects: { countries: never } };
        const collection = feature(countries110m as never, topology.objects.countries) as unknown as { features: GeoJSON.Feature[] };
        return {
            projection,
            countryPaths: collection.features.map((country, index) => ({ id: index, d: path(country) ?? "" })),
        };
    }, []);

    const india = projection([78.9629, 22.5937]) ?? [390, 210];
    const pins = [
        { label: "India", coords: [78.9629, 22.5937], active: true },
        { label: "UAE", coords: [53.8478, 23.4241] },
        { label: "UK", coords: [-3.436, 55.3781] },
        { label: "USA", coords: [-95.7129, 37.0902] },
        { label: "Canada", coords: [-106.3468, 56.1304] },
        { label: "Russia", coords: [90.0, 61.524] },
        { label: "Australia", coords: [133.7751, -25.2744] },
        { label: "Singapore", coords: [103.8198, 1.3521] },
        { label: "China", coords: [104.1954, 35.8617] },
        { label: "Japan", coords: [138.2529, 36.2048] },
        { label: "Europe", coords: [14.5501, 47.5162] },
        { label: "Africa", coords: [20.0, 2.0] },
    ];

    const projectedPins = pins.map((pin) => ({ ...pin, point: projection(pin.coords as [number, number]) ?? [0, 0] }));
    const routes = projectedPins.filter((pin) => !pin.active).map((pin, index) => {
        const [x1, y1] = india;
        const [x2, y2] = pin.point;
        const lift = Math.max(34, Math.abs(x2 - x1) * 0.18);
        return {
            d: `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - lift} ${x2} ${y2}`,
            delay: index * 0.16,
        };
    });

    return (
        <div className="relative flex h-full min-h-[430px] items-center justify-center overflow-hidden bg-canvas">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_47%,rgba(41,110,249,0.18),transparent_20%),linear-gradient(90deg,rgba(41,110,249,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(41,110,249,0.04)_1px,transparent_1px)] bg-[size:auto,44px_44px,44px_44px]" />
            <svg viewBox="0 0 760 460" className="relative z-10 h-full w-full" role="img" aria-label="Animated franchise expansion map from India to global markets">
                <g fill="#edf2f8" stroke="#d7dee8" strokeWidth="0.55">
                    {countryPaths.map((country) => (
                        <path key={country.id} d={country.d} />
                    ))}
                </g>
                <g fill="none" stroke="#296ef9" strokeLinecap="round" strokeWidth="1.8">
                    {routes.map((route) => (
                        <motion.path
                            key={route.d}
                            d={route.d}
                            initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
                            animate={reduceMotion ? undefined : { pathLength: [0, 1, 1], opacity: [0, 0.85, 0.55] }}
                            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.6, delay: route.delay, ease: "easeInOut" }}
                        />
                    ))}
                </g>
                {projectedPins.map((pin, index) => (
                    <g key={pin.label}>
                        <motion.circle
                            cx={pin.point[0]}
                            cy={pin.point[1]}
                            r={pin.active ? 10 : 7}
                            fill={pin.active ? "#296ef9" : "#ffffff"}
                            stroke="#296ef9"
                            strokeWidth="3"
                            animate={reduceMotion ? undefined : { scale: [1, 1.22, 1] }}
                            transition={{ duration: 2.1, repeat: Infinity, delay: index * 0.18 }}
                        />
                        {pin.active ? (
                            <motion.circle
                                cx={pin.point[0]}
                                cy={pin.point[1]}
                                r="18"
                                fill="#296ef9"
                                opacity="0.18"
                                animate={reduceMotion ? undefined : { r: [15, 42, 15], opacity: [0.2, 0, 0.2] }}
                                transition={{ duration: 2.4, repeat: Infinity }}
                            />
                        ) : null}
                    </g>
                ))}
            </svg>
            <div className="absolute bottom-10 right-7 z-20 max-w-[220px] rounded-xl border border-hairline bg-white/92 p-4 shadow-[0_18px_52px_rgba(26,26,26,0.16)] backdrop-blur">
                <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tint-sky text-primary-brand">
                        <Globe2 className="h-5 w-5" />
                    </span>
                    <div>
                        <p className="text-sm font-bold text-ink">Global Reach</p>
                        <p className="mt-1 text-xs leading-relaxed text-charcoal">Expanding brands in 30+ countries</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HeroStatsSection() {
    const { revealProps } = useRevealProps();

    return (
        <section className="bg-canvas px-4 sm:px-6 lg:px-8">
            <motion.div {...revealProps} variants={stagger} className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_2px_8px_rgba(26,26,26,0.08)] sm:grid-cols-2 lg:grid-cols-4">
                {heroStats.map((stat) => (
                    <motion.div key={stat.label} variants={reveal} className="flex items-center gap-4 border-b border-hairline px-6 py-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-canvas text-ink shadow-sm">
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-display text-4xl font-semibold leading-none text-ink"><BasicNumberTicker value={stat.value} />{stat.suffix}</p>
                            <p className="mt-1 text-sm font-medium text-charcoal">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

function HelpPreviewSection() {
    const { reduceMotion, revealProps } = useRevealProps();

    return (
        <section className="relative bg-canvas px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div {...revealProps} variants={reveal} className="mx-auto max-w-3xl text-center">
                    <h2 className="font-display text-3xl font-semibold leading-none text-ink md:text-5xl">How We Help Your Franchise Grow</h2>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal md:text-base">A proven approach to take your brand places.</p>
                </motion.div>
                <motion.div {...revealProps} variants={stagger} className="mt-8 grid gap-5 lg:grid-cols-4">
                    {helpPreview.map((item, index) => (
                        <motion.div key={item.title} variants={reveal} whileHover={reduceMotion ? undefined : { y: -8 }} className="relative rounded-xl border border-hairline bg-surface p-5 shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                            {index < helpPreview.length - 1 ? (
                                <span className="absolute -right-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-canvas text-graphite shadow-sm lg:flex">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            ) : null}
                            <div className="flex items-start gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-canvas text-ink shadow-sm">
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-primary-brand">{item.number}</p>
                                    <h3 className="mt-1 text-base font-bold text-ink">{item.title}</h3>
                                    <p className="mt-2 text-xs leading-relaxed text-charcoal">{item.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function AboutServiceSection() {
    const { revealProps } = useRevealProps();

    return (
        <section className="bg-surface px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <motion.div {...revealProps} variants={reveal} className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">About the service</p>
                    <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">End-to-End Franchise Consulting Under One Roof</h2>
                </div>
                <div className="space-y-5 text-base leading-loose text-charcoal md:text-lg">
                    <p>Building a successful franchise requires more than opening new outlets. It demands the right business model, legal framework, operational systems, brand protection, and expansion strategy.</p>
                    <p>At StartupKaro, we partner with businesses to transform successful brands into scalable franchise networks across India and international markets.</p>
                </div>
            </motion.div>
        </section>
    );
}

function ExpertiseSection() {
    const { reduceMotion, revealProps } = useRevealProps();

    return (
        <section id="expertise" className="bg-canvas px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div {...revealProps} variants={reveal} className="mx-auto max-w-3xl text-center">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Our expertise</p>
                    <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">Everything You Need to Scale Your Brand</h2>
                </motion.div>
                <motion.div {...revealProps} variants={stagger} className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {expertise.map((item) => (
                        <motion.div key={item.title} variants={reveal} whileHover={reduceMotion ? undefined : { y: -8 }} className="group rounded-xl border border-hairline bg-canvas p-5 shadow-[0_2px_8px_rgba(26,26,26,0.08)] transition-colors hover:border-primary-brand">
                            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg border ${item.tone}`}>
                                <item.icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-display text-xl font-medium leading-tight text-ink">{item.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-charcoal">{item.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function ProcessSection() {
    const { revealProps } = useRevealProps();

    return (
        <section className="bg-cloud px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div {...revealProps} variants={reveal} className="max-w-3xl">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Our process</p>
                    <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">How We Build Successful Franchise Networks</h2>
                </motion.div>
                <motion.div {...revealProps} variants={stagger} className="relative mt-12 grid gap-5 lg:grid-cols-3">
                    {process.map((step) => (
                        <motion.div key={step.number} variants={reveal} className="relative overflow-hidden rounded-xl border border-hairline bg-canvas p-5 shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                            <span className="pointer-events-none absolute bottom-4 right-5 font-display text-[6.75rem] font-medium leading-none text-primary-brand/[0.09]">{step.number}</span>
                            <div className="relative z-10">
                                <div className="mb-5 flex items-center justify-end">
                                    <step.icon className="h-6 w-6 text-primary-brand" />
                                </div>
                                <h3 className="font-display text-2xl font-medium leading-tight text-ink">{step.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-charcoal">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function OutcomesSection() {
    const { revealProps } = useRevealProps();

    return (
        <section className="bg-canvas px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr]">
                <motion.div {...revealProps} variants={reveal}>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">What we build</p>
                    <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">Outcomes, not isolated services</h2>
                    <p className="mt-6 text-base leading-relaxed text-charcoal">The goal is not paperwork. The goal is a franchise-ready business that can scale without losing control, quality, or legal protection.</p>
                </motion.div>
                <motion.div {...revealProps} variants={stagger} className="grid gap-3 sm:grid-cols-2">
                    {outcomes.map((item) => (
                        <motion.div key={item} variants={reveal} className="flex items-center gap-3 rounded-lg border border-hairline bg-surface p-4">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-brand" />
                            <p className="text-sm font-semibold text-ink">{item}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function WhyStartupKaroSection() {
    const { revealProps } = useRevealProps();

    return (
        <section className="border-y border-hairline bg-surface px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[1fr_1fr]">
                <motion.div {...revealProps} variants={reveal}>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Why StartupKaro?</p>
                    <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">More Than Consultants. Your Franchise Growth Partner.</h2>
                    <p className="mt-6 text-base leading-loose text-charcoal">
                        Unlike traditional consultants who focus on just legal or compliance, StartupKaro delivers a complete franchise ecosystem from strategy to execution.
                    </p>
                </motion.div>
                <motion.div {...revealProps} variants={stagger} className="grid gap-3">
                    {reasons.map((reason) => (
                        <motion.div key={reason} variants={reveal} className="flex items-center gap-3 border-b border-hairline bg-canvas px-4 py-3 last:border-b-0">
                            <BadgeCheck className="h-5 w-5 shrink-0 text-primary-brand" />
                            <p className="text-sm font-semibold text-ink">{reason}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function IndustriesSection() {
    const { reduceMotion, revealProps } = useRevealProps();

    return (
        <section className="bg-canvas px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div {...revealProps} variants={reveal} className="mx-auto max-w-3xl text-center">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Industries we serve</p>
                    <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">Franchise systems for high-growth categories</h2>
                </motion.div>
                <motion.div {...revealProps} variants={stagger} className="mt-10 flex flex-wrap justify-center gap-2.5">
                    {industries.map((industry, index) => (
                        <motion.div
                            key={industry.title}
                            variants={reveal}
                            whileHover={reduceMotion ? undefined : { y: -4 }}
                            transition={{ duration: 0.22, ease: EASE, delay: index * 0.01 }}
                            className="group relative overflow-hidden rounded-md border border-hairline bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-primary-brand hover:bg-canvas"
                        >
                            <span className={`absolute inset-y-0 left-0 w-1 ${industry.accent}`} />
                            <LetterSwap text={industry.title} stagger={6} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function GlobalExpansionSection() {
    const { revealProps } = useRevealProps();

    return (
        <section className="relative w-full overflow-hidden bg-cloud px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
                <motion.div {...revealProps} variants={reveal}>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Global expansion</p>
                    <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">Take Your Brand Beyond Borders</h2>
                    <p className="mt-6 text-base leading-loose text-charcoal">
                        Whether you are entering a new city or a new country, StartupKaro helps businesses expand through structured market entry, legal frameworks, franchise partnerships, and regulatory compliance.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2">
                        {markets.map((market) => (
                            <span key={market} className="rounded-md border border-hairline bg-canvas px-3 py-2 text-xs font-semibold uppercase tracking-[0.7px] text-ink">{market}</span>
                        ))}
                    </div>
                </motion.div>
                <motion.div {...revealProps} variants={reveal} className="rounded-2xl border border-hairline bg-canvas p-4 shadow-[0_18px_52px_rgba(26,26,26,0.08)]">
                    <div className="relative min-h-[320px] overflow-hidden rounded-xl bg-surface">
                        <WorldExpansionMap reduceMotion={false} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function SuccessStorySection() {
    const { revealProps } = useRevealProps();

    return (
        <section className="relative overflow-hidden bg-[#FAE3BF] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div {...revealProps} variants={reveal} className="relative">
                    <div className="overflow-hidden rounded-2xl border border-[#4A1F12]/15 bg-white shadow-[0_24px_70px_rgba(74,31,18,0.14)]">
                        <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
                            <div className="relative bg-[#4A1F12] p-6 text-white sm:p-8 lg:p-10">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(232,162,58,0.28),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(95,125,58,0.25),transparent_30%)]" />
                                <div className="relative z-10">
                                    <p className="mb-4 inline-flex rounded-md bg-[#FAE3BF] px-3 py-2 text-xs font-semibold uppercase tracking-[0.7px] text-[#4A1F12]">Success story</p>
                                    <h2 className="font-display text-4xl font-medium leading-none sm:text-5xl">From One Brand to a Growing Global Franchise Network</h2>
                                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.7px] text-[#E8A23A]">CHAICHURI - A StartupKaro Franchise Success Story</p>
                                    <div className="mt-8 w-fit rounded-xl border border-white/15 bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                                        <Image
                                            src="/brands/chai-churi.webp"
                                            alt="CHAICHURI logo"
                                            width={248}
                                            height={170}
                                            className="h-auto w-[248px] object-contain"
                                        />
                                    </div>
                                    <p className="mt-8 max-w-lg text-base leading-loose text-white/82">
                                        StartupKaro partnered with CHAICHURI to build a structured franchise ecosystem, from franchise modelling and legal documentation to trademark protection, business structuring, and international expansion strategy.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#FAE3BF]/35 p-6 sm:p-8 lg:p-10">
                                <p className="text-xs font-semibold uppercase tracking-[0.7px] text-[#4A1F12]">Featured client</p>
                                <h3 className="mt-3 font-display text-4xl font-medium text-[#4A1F12]">CHAICHURI</h3>
                                <p className="mt-4 text-sm leading-relaxed text-charcoal">
                                    Transforming a cafe brand into a scalable national and international franchise network, with an ambitious franchise network targeting 200+ stores.
                                </p>

                                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                                    {storyStats.map((stat) => (
                                        <motion.div key={stat.label} whileHover={{ y: -6 }} className="rounded-xl border border-[#4A1F12]/15 bg-white p-4 shadow-sm">
                                            <p className="font-display text-3xl font-medium text-[#4A1F12]"><BasicNumberTicker value={stat.value} />{stat.suffix}</p>
                                            <p className="mt-1 text-xs font-medium text-charcoal">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-8 grid gap-3">
                                    {caseStudyStages.map((stage) => (
                                        <motion.div key={stage.title} whileHover={{ x: 6 }} className="group grid gap-4 rounded-xl border border-[#4A1F12]/12 bg-white p-4 shadow-sm sm:grid-cols-[44px_1fr]">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#4A1F12] text-[#FAE3BF] transition-colors group-hover:bg-[#E8A23A] group-hover:text-[#4A1F12]">
                                                <stage.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.7px] text-[#5F7D3A]">{stage.label}</p>
                                                <h4 className="mt-1 text-base font-bold text-[#4A1F12]">{stage.title}</h4>
                                                <p className="mt-1 text-sm leading-relaxed text-charcoal">{stage.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div {...revealProps} variants={stagger} className="mt-10 grid gap-6 lg:grid-cols-2">
                    <motion.div variants={reveal} whileHover={{ y: -6 }} className="relative overflow-hidden rounded-2xl border border-[#4A1F12]/15 bg-white p-6 shadow-[0_18px_44px_rgba(74,31,18,0.12)]">
                        <span className="absolute inset-x-0 top-0 h-1.5 bg-[#4A1F12]" />
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="font-display text-2xl font-medium text-[#4A1F12]">Our Role</h3>
                            <Scale className="h-6 w-6 text-[#E8A23A]" />
                        </div>
                        <div className="mt-5 grid gap-2 sm:grid-cols-2">
                            {storyRoles.map((role) => (
                                <p key={role} className="rounded-lg border border-[#4A1F12]/10 bg-[#FAE3BF]/25 p-3 flex items-start gap-2 text-sm leading-relaxed text-charcoal">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5F7D3A]" />
                                    {role}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div variants={reveal} whileHover={{ y: -6 }} className="relative overflow-hidden rounded-2xl border border-[#4A1F12]/15 bg-white p-6 shadow-[0_18px_44px_rgba(74,31,18,0.12)]">
                        <span className="absolute inset-x-0 top-0 h-1.5 bg-[#5F7D3A]" />
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="font-display text-2xl font-medium text-[#4A1F12]">Impact</h3>
                            <TrendingUp className="h-6 w-6 text-[#5F7D3A]" />
                        </div>
                        <div className="mt-5 grid gap-2">
                            {impact.map((item) => (
                                <p key={item} className="group flex items-start gap-2 rounded-lg border border-[#5F7D3A]/12 bg-[#5F7D3A]/10 p-3 text-sm leading-relaxed text-charcoal transition-colors hover:bg-[#5F7D3A]/15">
                                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#E8A23A]" />
                                    {item}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div {...revealProps} variants={stagger} className="mt-8 overflow-hidden rounded-xl border border-[#4A1F12]/15 bg-white">
                    <div className="grid md:grid-cols-7">
                        {timeline.map((item, index) => (
                            <motion.div key={item} variants={reveal} className="relative border-b border-[#4A1F12]/15 p-4 md:border-b-0 md:border-r md:last:border-r-0">
                                <p className="mb-3 text-xs font-semibold text-[#E8A23A]">{String(index + 1).padStart(2, "0")}</p>
                                <p className="text-sm font-semibold leading-snug text-[#4A1F12]">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div {...revealProps} variants={reveal} className="mt-8 rounded-2xl border border-[#4A1F12]/15 bg-[#4A1F12] p-6 shadow-[0_18px_52px_rgba(74,31,18,0.14)] md:p-8">
                    <div className="grid gap-6 lg:grid-cols-[0.4fr_1fr] lg:items-center">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.7px] text-[#E8A23A]">Long-term partnership</p>
                            <h3 className="mt-3 font-display text-3xl font-medium leading-none text-white">Trusted by growing franchise brands</h3>
                        </div>
                        <p className="rounded-xl bg-white px-5 py-4 text-base font-medium leading-loose text-[#1a1a1a] md:text-lg">
                            StartupKaro is proud to partner with ambitious brands like CHAICHURI, helping them build scalable franchise systems through expert strategy, legal structuring, trademark protection, compliance, and global expansion support.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
