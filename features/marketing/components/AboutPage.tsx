"use client";

// features/marketing/components/AboutPage.tsx

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
    ArrowRight,
    BadgeCheck,
    BarChart3,
    Building2,
    ChartNoAxesCombined,
    CheckSquare,
    Code2,
    Crown,
    FileCheck2,
    Gavel,
    Headphones,
    HeartHandshake,
    Lightbulb,
    Monitor,
    Rocket,
    Scale,
    ShieldCheck,
    TrendingUp,
    Users,
} from "lucide-react";
import { NAV_LINKS } from "@/components/directional-hover-header/header/nav-data";
import { categoryCardStyles, fallbackCardStyles, serviceCategoryIcons, type ServiceVisualCategory } from "@/lib/category-pills";
import { LandingCTASection } from "./sections/LandingCTASection";

const EASE = [0.22, 1, 0.36, 1] as const;

const ecosystem = [
    {
        title: "FINANCE",
        description: "Smart financial planning for stronger growth.",
        icon: BarChart3,
        tone: "text-primary-brand bg-tint-sky border-primary-brand/20",
    },
    {
        title: "TAXATION",
        description: "Tax compliance made simple and efficient.",
        icon: FileCheck2,
        tone: "text-[#4f9c3f] bg-[#eef8ea] border-[#4f9c3f]/20",
    },
    {
        title: "COMPANY",
        description: "Incorporation & compliance to build your foundation.",
        icon: Building2,
        tone: "text-[#f0a51a] bg-[#fff6df] border-[#f0a51a]/25",
    },
    {
        title: "LEGAL",
        description: "Expert legal support to keep your business protected.",
        icon: Scale,
        tone: "text-[#6f46d8] bg-[#f1ecff] border-[#6f46d8]/20",
    },
    {
        title: "TECH & DIGITAL SOLUTIONS",
        description: "Technology that powers efficiency and innovation.",
        icon: Monitor,
        tone: "text-[#14a8a8] bg-[#e9fbfb] border-[#14a8a8]/20",
    },
];

const experts = [
    {
        number: "01",
        title: "CHARTERED ACCOUNTANTS",
        description: "Financial planning, accounting, taxation, audits & compliance to keep your business financially strong.",
        icon: BadgeCheck,
        tone: "text-[#f0a51a] bg-[#fff6df] border-[#f0a51a]/25",
    },
    {
        number: "02",
        title: "COMPANY SECRETARIES",
        description: "Corporate compliance, ROC filings, governance & secretarial support to keep your business legally compliant.",
        icon: ShieldCheck,
        tone: "text-[#70ad47] bg-[#eef8ea] border-[#70ad47]/25",
    },
    {
        number: "03",
        title: "LEGAL EXPERTS",
        description: "Contracts, agreements, IPR, litigation support & legal advisory to protect your business interests.",
        icon: Gavel,
        tone: "text-primary-brand bg-tint-sky border-primary-brand/20",
    },
    {
        number: "04",
        title: "FINANCIAL ADVISORS",
        description: "Funding guidance, investor connects, budgeting & growth strategies to fuel your business growth.",
        icon: ChartNoAxesCombined,
        tone: "text-[#7b55e7] bg-[#f1ecff] border-[#7b55e7]/20",
    },
    {
        number: "05",
        title: "DEVELOPERS & TECH EXPERTS",
        description: "Web, app, product development & tech solutions that power your digital presence and operations.",
        icon: Code2,
        tone: "text-[#14a8a8] bg-[#e9fbfb] border-[#14a8a8]/20",
    },
    {
        number: "06",
        title: "AND MANY MORE",
        description: "One trusted ecosystem built to take your startup from idea to impact.",
        icon: Users,
        tone: "text-[#f97316] bg-[#fff1e7] border-[#f97316]/20",
    },
];

const journey = [
    { number: "01", title: "DREAM", description: "You have an idea. We listen.", icon: Lightbulb },
    { number: "02", title: "PLAN", description: "We analyze, guide and create the perfect roadmap.", icon: CheckSquare },
    { number: "03", title: "BUILD", description: "We handle all registrations, legal, finance & compliance.", icon: Building2 },
    { number: "04", title: "LAUNCH", description: "We make your startup market-ready and launch with you.", icon: Rocket },
    { number: "05", title: "SCALE", description: "We support your growth with strategy, funding & systems.", icon: TrendingUp },
    { number: "06", title: "LEAD", description: "We stand by you as you lead the market and inspire the world.", icon: Crown },
];

const supportPillars = [
    { title: "Expert Professionals", description: "Always With You", icon: Users },
    { title: "One Platform", description: "All Solutions", icon: Headphones },
    { title: "Trusted & Reliable", description: "Partner", icon: ShieldCheck },
    { title: "Community Driven", description: "Founder Focused", icon: HeartHandshake },
];

const visionStats = [
    { value: "5000+", label: "Businesses Served", icon: Users },
    { value: "100+", label: "Verified Professionals", icon: BadgeCheck },
    { value: "1", label: "Platform End-to-End Startup Solutions", icon: Rocket },
    { value: "24x7", label: "Founder Support", icon: Headphones },
];

const serviceMenuColumns = NAV_LINKS.find((link) => link.label === "Services")?.menu?.columns ?? [];

function isServiceVisualCategory(heading: string): heading is ServiceVisualCategory {
    return heading === "Bundles" || heading === "Start" || heading === "Manage" || heading === "Protect" || heading === "Tech";
}

const reveal: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
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
                viewport: { once: true, amount: 0.22 },
            },
    };
}

export function AboutPage() {
    const { reduceMotion, revealProps } = useRevealProps();

    return (
        <div className="overflow-hidden bg-canvas">
            <section className="relative border-b border-hairline bg-canvas px-4 pb-16 pt-7 sm:px-6 md:pb-24 md:pt-11 lg:px-8">
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                    <motion.div {...revealProps} variants={reveal} className="max-w-3xl">
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">About StartupKaro</p>
                        <h1 className="font-display text-4xl font-medium leading-none text-ink sm:text-5xl lg:text-6xl">
                            Built for founders
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-relaxed text-charcoal md:text-lg">
                            StartupKaro helps you spend less time on paperwork and more time building. We are more than a service platform, we are the ecosystem startups can rely on to confidently <span className="font-semibold text-ink">BEGIN, BUILD, AND GROW</span>.
                            <br /><br />
                            Every founder&apos;s journey starts with the same overwhelming checklist: incorporation, licenses, tax registrations, compliance calendars, and paperwork that never seems to end. We built StartupKaro because that checklist shouldn&apos;t stand between an idea and a real business.
                            <br /><br />
                            Our team of CAs, CS professionals, and legal experts handles the regulatory heavy lifting, so you can stay focused on customers, product, and growth. From your first registration to your ongoing compliance and financial filings, we stay with you at every stage, offering fixed-cost services with transparent pricing and no surprises.
                            <br /><br />
                            Whether you are registering your first company or scaling a growing team, StartupKaro is the partner that keeps your business compliant, credible, and ready for what&apos;s next.
                        </p>
                    </motion.div>

                    <motion.div
                        {...revealProps}
                        variants={reveal}
                        className="relative min-h-[360px] rounded-2xl border border-hairline bg-cloud p-5 shadow-[0_18px_52px_rgba(26,26,26,0.08)]"
                    >
                        <div className="absolute left-4 top-4 h-28 w-10 -skew-x-12 bg-primary-brand" />
                        <div className="absolute bottom-4 right-4 h-28 w-10 -skew-x-12 bg-primary-brand" />
                        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl bg-canvas">
                            <motion.div
                                animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="relative min-h-[320px] w-full"
                            >
                                <Image
                                    src="/about-founder-ecosystem-hero.png"
                                    alt="Indian founders and professionals collaborating"
                                    fill
                                    priority
                                    sizes="(min-width: 1024px) 46vw, 92vw"
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <EcosystemFlow />

            <section className="bg-canvas px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
                    <motion.div {...revealProps} variants={reveal} className="lg:sticky lg:top-24 lg:self-start">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">StartupKaro India</p>
                        <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">HAVE AN IDEA, SIR G?</h2>
                        <div className="mt-8 space-y-6 text-justify text-base leading-loose text-charcoal">
                            <p>Every unicorn, every brand, and every successful business started with just one thing: an idea.</p>
                            <p>What separates dreamers from founders is execution. That&apos;s where we come in.</p>
                            <p>You bring the vision. We bring the experts, the strategy, and the execution. From registering your company and managing compliances to taxation, legal, technology, branding, and fundraising support, we handle everything required to turn your idea into a thriving business.</p>
                            <p>No confusion. No running around. No missed compliances. Just one trusted ecosystem built to take your startup from idea to impact.</p>
                        </div>
                    </motion.div>

                    <ExpertNetwork />
                </div>
            </section>

            <VisionSection />

            <JourneySection />

            <ServicesSection />

            <LandingCTASection />
        </div>
    );
}

function EcosystemFlow() {
    const { reduceMotion, revealProps } = useRevealProps();

    return (
        <section className="bg-cloud px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div {...revealProps} variants={reveal} className="mx-auto max-w-4xl text-center">
                    <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">OUR MISSION - ONE STOP SOLUTION</h2>
                </motion.div>

                <motion.div {...revealProps} variants={stagger} className="relative mt-12">
                    <div className="absolute left-0 right-0 top-16 hidden h-px bg-hairline-strong lg:block" />
                    <motion.div
                        initial={reduceMotion ? undefined : { scaleX: 0 }}
                        whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 1.25, ease: EASE }}
                        className="absolute left-0 right-0 top-16 hidden h-1 origin-left rounded-full bg-primary-brand lg:block"
                    />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                        {ecosystem.map((item, index) => (
                            <motion.div
                                key={item.title}
                                variants={reveal}
                                whileHover={reduceMotion ? undefined : { y: -8 }}
                                className="relative rounded-xl border border-hairline bg-canvas p-5 text-center shadow-[0_2px_8px_rgba(26,26,26,0.08)]"
                            >
                                <span className="absolute -top-3 left-1/2 hidden h-6 w-6 -translate-x-1/2 rounded-full border-4 border-canvas bg-primary-brand lg:block" />
                                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border ${item.tone}`}>
                                    <item.icon className="h-9 w-9" />
                                </div>
                                <h3 className="mt-5 min-h-10 text-sm font-bold uppercase leading-tight text-ink">{item.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-charcoal">{item.description}</p>
                                {index < ecosystem.length - 1 ? (
                                    <ArrowRight className="absolute -right-3 top-14 hidden h-6 w-6 rounded-full bg-primary-brand p-1 text-white lg:block" />
                                ) : null}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.p {...revealProps} variants={reveal} className="mx-auto mt-12 max-w-5xl text-justify text-base leading-relaxed text-charcoal md:text-lg">
                    What makes our ecosystem different is the people behind it and our growing network. By expanding this professional network across India, we aim to build a strong and collaborative startup community where entrepreneurs feel supported, informed, and confident enough to turn their ideas into successful businesses.
                </motion.p>
            </div>
        </section>
    );
}

function ExpertNetwork() {
    const { reduceMotion, revealProps } = useRevealProps();

    return (
        <motion.div {...revealProps} variants={stagger} className="grid gap-5 sm:grid-cols-2">
            {experts.map((expert, index) => (
                <motion.div
                    key={expert.title}
                    variants={reveal}
                    whileHover={reduceMotion ? undefined : { y: -8, rotate: index % 2 === 0 ? -0.35 : 0.35 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className={`group relative overflow-hidden rounded-xl border border-hairline bg-canvas p-4 shadow-[0_2px_8px_rgba(26,26,26,0.08)] transition-colors hover:border-primary-brand ${index % 2 === 1 ? "sm:translate-y-8" : ""}`}
                >
                    <span className="pointer-events-none absolute -bottom-3 -left-2 font-display text-[7.5rem] font-medium leading-none text-ink/[0.075] transition-colors group-hover:text-primary-brand/[0.14]">
                        {expert.number}
                    </span>
                    <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-primary-brand transition-transform duration-300 group-hover:scale-x-100" />
                    <div className="relative z-10 flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${expert.tone}`}>
                            <expert.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold uppercase leading-snug text-ink">{expert.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-charcoal">{expert.description}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

function VisionSection() {
    const { reduceMotion, revealProps } = useRevealProps();

    return (
        <section className="border-y border-hairline bg-canvas px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
                <motion.div {...revealProps} variants={reveal}>
                    <h2 className="font-display text-4xl font-medium leading-none text-ink md:text-6xl">OUR VISION</h2>
                    <p className="mt-8 max-w-3xl text-justify text-base leading-loose text-charcoal md:text-lg">
                        To build India&apos;s largest startup ecosystem, connecting entrepreneurs with trusted professionals and creating a community that empowers innovation, drives growth, and makes India the <span className="font-semibold text-ink">Startup Capital of the World.</span>
                    </p>
                    <div className="relative mt-12 inline-flex rotate-[-3deg] px-6 py-4 text-2xl font-bold uppercase text-ink sm:text-3xl">
                        <span className="absolute inset-x-0 top-0 h-9 -skew-x-12 bg-[#ff8f1f] opacity-95 [clip-path:polygon(2%_35%,12%_8%,29%_24%,47%_0,66%_18%,92%_6%,99%_28%,88%_68%,70%_58%,51%_86%,30%_62%,10%_92%,0_70%)]" />
                        <span className="absolute inset-x-8 top-8 h-9 -skew-x-12 bg-canvas [clip-path:polygon(0_42%,16%_18%,34%_34%,50%_6%,69%_25%,100%_16%,93%_74%,76%_56%,56%_90%,37%_66%,17%_86%,3%_70%)]" />
                        <span className="absolute inset-x-3 top-14 h-10 -skew-x-12 bg-[#138808] opacity-95 [clip-path:polygon(1%_36%,18%_5%,36%_27%,55%_0,74%_22%,99%_10%,93%_66%,76%_56%,58%_86%,39%_63%,17%_91%,0_72%)]" />
                        <span className="pointer-events-none absolute inset-0 opacity-45">
                            <span className="absolute left-2 top-2 h-1 w-24 -rotate-12 rounded-full bg-[#ffc36c]" />
                            <span className="absolute right-3 top-5 h-1 w-20 -rotate-12 rounded-full bg-[#d96f11]" />
                            <span className="absolute bottom-4 left-8 h-1 w-24 -rotate-12 rounded-full bg-[#37a936]" />
                            <span className="absolute bottom-7 right-7 h-1 w-20 -rotate-12 rounded-full bg-[#075f16]" />
                        </span>
                        <span className="relative z-20 drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                            HAR GHAR <span className="text-[#000080]">STARTUP</span>
                        </span>
                    </div>
                </motion.div>

                <motion.div {...revealProps} variants={reveal} className="relative min-h-[420px]">
                    <motion.div
                        animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
                        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative mx-auto aspect-square w-full max-w-[560px]"
                    >
                        <Image
                            src="/about-india-network.png"
                            alt="India startup network"
                            fill
                            sizes="(min-width: 1024px) 46vw, 92vw"
                            className="object-contain"
                        />
                    </motion.div>
                </motion.div>
            </div>

            <motion.div {...revealProps} variants={stagger} className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {visionStats.map((stat) => (
                    <motion.div key={stat.label} variants={reveal} className="rounded-xl border border-hairline bg-canvas p-5 text-center shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-tint-sky text-primary-brand">
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="font-display text-4xl font-medium leading-none text-primary-brand">{stat.value}</p>
                        <p className="mt-2 text-sm font-semibold leading-tight text-ink">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

function JourneySection() {
    const { reduceMotion, revealProps } = useRevealProps();

    return (
        <section className="bg-cloud px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div {...revealProps} variants={reveal} className="text-center">
                    <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">
                        From Idea to Impact, <span className="text-primary-brand">We&apos;re With You</span>
                    </h2>
                </motion.div>

                <motion.div {...revealProps} variants={stagger} className="relative mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-6">
                    <div className="absolute left-8 right-8 top-20 hidden h-px bg-primary-brand/35 xl:block" />
                    {journey.map((step, index) => (
                        <motion.div
                            key={step.title}
                            variants={reveal}
                            whileHover={reduceMotion ? undefined : { y: -8 }}
                            className="relative rounded-xl border border-hairline bg-canvas p-5 text-center shadow-[0_2px_8px_rgba(26,26,26,0.08)]"
                        >
                            <span className="absolute left-4 top-4 rounded-full bg-primary-brand px-2 py-1 text-xs font-semibold text-white">{step.number}</span>
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary-brand/20 bg-tint-sky text-primary-brand">
                                <step.icon className="h-9 w-9" />
                            </div>
                            <h3 className="mt-5 text-xl font-bold uppercase text-primary-brand">{step.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-charcoal">{step.description}</p>
                            {index < journey.length - 1 ? (
                                <ArrowRight className="absolute -right-3 top-16 hidden h-6 w-6 rounded-full bg-canvas p-1 text-primary-brand xl:block" />
                            ) : null}
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div {...revealProps} variants={stagger} className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
                    {supportPillars.map((pillar) => (
                        <motion.div key={pillar.title} variants={reveal} className="flex items-center gap-4 rounded-xl border border-hairline bg-canvas p-4 shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-tint-sky text-primary-brand">
                                <pillar.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-ink">{pillar.title}</p>
                                <p className="text-sm text-charcoal">{pillar.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div {...revealProps} variants={reveal} className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-4 rounded-xl border border-hairline bg-canvas px-5 py-4 text-center shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                    <Rocket className="h-6 w-6 shrink-0 text-primary-brand" />
                    <p className="font-display text-2xl font-medium text-ink">
                        One Ecosystem. <span className="text-primary-brand">Endless Possibilities.</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function ServicesSection() {
    const { revealProps } = useRevealProps();

    return (
        <section className="bg-canvas px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div {...revealProps} variants={reveal} className="mx-auto max-w-3xl text-center">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">Services</p>
                    <h2 className="font-display text-3xl font-medium leading-none text-ink md:text-5xl">One platform for the work founders keep coming back to</h2>
                </motion.div>

                <motion.div {...revealProps} variants={stagger} className="mt-12 grid gap-0 overflow-hidden rounded-xl border border-hairline bg-canvas shadow-[0_2px_8px_rgba(26,26,26,0.08)] md:grid-cols-2 xl:grid-cols-5">
                    {serviceMenuColumns.map((column) => {
                        const visualCategory = isServiceVisualCategory(column.heading) ? column.heading : null;
                        const styles = visualCategory ? categoryCardStyles[visualCategory] : fallbackCardStyles;
                        const Icon = visualCategory ? serviceCategoryIcons[visualCategory] : Rocket;

                        return (
                            <motion.div key={column.heading} variants={reveal} className="border-b border-hairline p-5 md:border-r xl:border-b-0">
                                <Link href={column.href ?? "/services"} className="group mb-7 flex items-center gap-3">
                                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:-translate-y-0.5 ${styles.iconBg}`}>
                                        <Icon className={`h-4.5 w-4.5 ${styles.iconText}`} strokeWidth={2} />
                                    </span>
                                    <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors group-hover:border-primary-brand ${styles.badge}`}>
                                        {column.heading}
                                    </span>
                                </Link>
                                <div className="space-y-2">
                                    {column.items.map((service) => (
                                        <Link
                                            key={`${column.heading}-${service.label}`}
                                            href={service.href ?? column.href ?? "/services"}
                                            className="block rounded-lg border border-transparent p-3 transition-colors hover:border-hairline hover:bg-cloud"
                                        >
                                            <span className="block text-sm font-semibold leading-snug text-ink">{service.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <motion.div {...revealProps} variants={reveal} className="mt-6 text-center">
                    <Link
                        href="/services"
                        className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep"
                    >
                        View All Services
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
