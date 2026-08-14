"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Code2,
    ExternalLink,
    GripHorizontal,
    LayoutDashboard,
    Mail,
    Minus,
    MonitorSmartphone,
    Phone,
    Plus,
    Send,
    ShoppingBag,
    Smartphone,
    Store,
    WandSparkles,
    Workflow,
} from "lucide-react";
import type { ArticleCard } from "@/features/articles/types";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";
import { UniqueAccordion } from "@/components/ui/unique-accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneField } from "@/components/custom/PhoneField";
import { publicInquiryService } from "@/services/customer.service";
import { getApiErrorMessage, isRateLimited } from "@/features/customers/lib/format";
import { getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";
import { validators, formatNameInput, validatePhoneDigits, buildPhone } from "@/lib/validations/common.schema";
import { techTemplates } from "@/features/marketing/data/tech-templates";
import { MarketingCTASection } from "./sections/MarketingCTASection";

interface TechServicesPageProps {
    articles: ArticleCard[];
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const MESSAGE_MIN_HEIGHT = 140;
const MESSAGE_MAX_HEIGHT = 300;
const MESSAGE_RESIZE_STEP = 32;

const buildExamples = [
    { title: "Delivery apps", Icon: Smartphone, description: "Ordering, delivery tracking, vendor panels, and admin controls." },
    { title: "E-commerce sites", Icon: ShoppingBag, description: "Catalog, checkout-ready journeys, product pages, and sales funnels." },
    { title: "Landing pages", Icon: MonitorSmartphone, description: "Fast responsive launch pages for offers, waitlists, and lead capture." },
    { title: "Admin dashboards", Icon: LayoutDashboard, description: "Internal tools to track orders, customers, payments, and operations." },
    { title: "Customer portals", Icon: Store, description: "Logged-in spaces for service status, documents, requests, and updates." },
    { title: "Automation flows", Icon: Workflow, description: "Practical workflows that reduce repeat manual work for small teams." },
];

const caseStudies = [
    {
        title: "Delivery Operations Build",
        description: "A practical app concept for managing orders, delivery status, store-side updates, and founder visibility from one dashboard.",
        tags: ["Mobile app", "Admin dashboard", "Order tracking"],
    },
    {
        title: "Online Storefront Launch",
        description: "A conversion-focused e-commerce website structure for early brands that need product storytelling and clean enquiry paths.",
        tags: ["E-commerce", "Responsive web", "Lead capture"],
    },
    {
        title: "Founder Control Dashboard",
        description: "A dashboard-first build for teams that need to track customers, payments, service requests, and daily work without spreadsheets.",
        tags: ["Dashboard", "Customer portal", "Operations"],
    },
];

const faqItems = [
    { id: "1", number: "01", title: "How much does custom development cost?", content: "Custom websites, apps, dashboards, and portals are quoted after understanding scope, screens, integrations, and launch timeline." },
    { id: "2", number: "02", title: "What is included in the Rs. 15,000 template page?", content: "One responsive landing page template design, basic content placement, and up to 3 content revisions." },
    { id: "3", number: "03", title: "How many revisions are included?", content: "Template landing pages include 3 content revisions. Custom builds have a revision plan agreed in the quote." },
    { id: "4", number: "04", title: "Do I own the website or app?", content: "Yes. Ownership and handover details are confirmed in the quote, including files, access, and any third-party accounts required." },
    { id: "5", number: "05", title: "Do you handle hosting and domains?", content: "We can guide setup or manage it as part of the quote. Hosting, domain, paid tools, and third-party subscriptions are billed separately when needed." },
    { id: "6", number: "06", title: "Can you maintain the product after launch?", content: "Yes. Maintenance, edits, bug fixes, and feature updates can be handled through a monthly support arrangement." },
    { id: "7", number: "07", title: "Can you build dashboards for internal teams?", content: "Yes. Dashboards can cover customers, orders, payments, tasks, service status, analytics, and admin workflows." },
    { id: "8", number: "08", title: "How long does a build take?", content: "Template landing pages are usually much faster. Custom builds depend on scope, but the first quote will include an expected timeline." },
];

const initialForm = {
    name: "",
    email: "",
    serviceType: "Custom Development",
    template: techTemplates[0].name,
    notes: "",
};

const sectionVariant = {
    hidden: { opacity: 0, y: 34 },
    visible: { opacity: 1, y: 0 },
};

const gridVariant = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
    hidden: { opacity: 0, y: 22, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getTodayDate() {
    return new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function TechServicesPage({ articles }: TechServicesPageProps) {
    const toast = useToast();
    const prefersReducedMotion = useReducedMotion();
    const [form, setForm] = useState(initialForm);
    const [phoneDigits, setPhoneDigits] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [messageHeight, setMessageHeight] = useState(MESSAGE_MIN_HEIGHT);

    const isTemplate = form.serviceType === "Landing Page Template";
    const inquirySubject = `Tech quote request: ${form.serviceType}`;
    const articleCards = useMemo(() => articles.slice(0, 3), [articles]);

    const revealProps = prefersReducedMotion
        ? {}
        : {
              variants: sectionVariant,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, amount: 0.2 },
              transition: { duration: 0.65, ease: EASE },
          };

    const setField = (field: keyof typeof form, value: string) => {
        setForm((current) => ({ ...current, [field]: field === "name" ? formatNameInput(value) : value }));
        if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
    };

    const adjustMessageHeight = (delta: number) => {
        setMessageHeight((height) => Math.min(MESSAGE_MAX_HEIGHT, Math.max(MESSAGE_MIN_HEIGHT, height + delta)));
    };

    const handleResizeStart = (event: React.PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        const startY = event.clientY;
        const startHeight = messageHeight;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const nextHeight = Math.min(MESSAGE_MAX_HEIGHT, Math.max(MESSAGE_MIN_HEIGHT, startHeight + moveEvent.clientY - startY));
            setMessageHeight(nextHeight);
        };

        const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);
    };

    const submitInquiry = async (event: FormEvent) => {
        event.preventDefault();
        const nextErrors: Record<string, string> = {
            name: validators.name(form.name) ?? "",
            email: validators.email(form.email) ?? "",
            phone: validatePhoneDigits(phoneDigits, true) || "",
            notes: form.notes.trim().length < 10
                ? "Message must be at least 10 characters"
                : form.notes.trim().length > 1000
                    ? "Message must be under 1000 characters"
                    : "",
        };

        if (Object.values(nextErrors).some(Boolean)) {
            setErrors(nextErrors);
            return;
        }

        setLoading(true);
        try {
            const details = [
                `Service type: ${form.serviceType}`,
                isTemplate ? `Selected template: ${form.template}` : null,
                `Project notes: ${form.notes.trim()}`,
            ].filter(Boolean).join("\n");

            const response = await publicInquiryService.submit({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: buildPhone(phoneDigits)!,
                subject: inquirySubject,
                message: details,
            });
            toast.success(getApiSuccessMessage(response, "Tech inquiry submitted"));
            setSubmitted(true);
            setForm(initialForm);
            setPhoneDigits("");
        } catch (error: unknown) {
            const message = isRateLimited(error)
                ? "Too many messages were sent recently. Please wait a little and try again."
                : getApiErrorMessage(error, "Could not submit tech inquiry. Please try again.");
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="overflow-x-clip bg-canvas">
            <section className="relative overflow-hidden border-b border-hairline bg-canvas pt-7 md:pt-11">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:pb-18">
                    <motion.div
                        initial={prefersReducedMotion ? undefined : { opacity: 0, x: -34 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.75, ease: EASE }}
                        className="max-w-3xl"
                    >
                        <motion.p
                            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
                            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
                            className="mb-4 inline-flex items-center gap-2 rounded-md border border-primary-brand/20 bg-primary-soft px-3 py-2 text-xs font-semibold uppercase tracking-[0.28px] text-primary-brand"
                        >
                            <Code2 className="h-4 w-4" />
                            Tech for practical startup launches
                        </motion.p>
                        <h1 className="font-display text-4xl font-medium leading-tight text-ink md:text-6xl">
                            Websites, apps, and dashboards for Indian startups
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal md:text-lg">
                            Build the digital side of your business with the same team helping founders register, manage, and grow. From a simple landing page to a custom operating dashboard, we keep it practical and launch-focused.
                        </p>
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <FlowButton href="#quote" text="Request Quote" iconName="rocket" className="h-11 w-full sm:w-auto" wrapperClassName="w-full sm:w-auto" />
                            <FlowSecondaryButton href="/tech-services/templates" text="View Templates" iconName="arrow-right" className="h-11 w-full sm:w-auto" wrapperClassName="w-full sm:w-auto" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={prefersReducedMotion ? undefined : { opacity: 0, x: 38, rotate: 1.5 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0, rotate: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
                        className="grid gap-4 rounded-2xl border border-hairline bg-cloud p-4 md:p-5"
                    >
                        <ProductWireframe prefersReducedMotion={prefersReducedMotion} />
                    </motion.div>
                </div>
            </section>

            <AnimatedSection className="bg-surface py-14 md:py-18" revealProps={revealProps}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div variants={gridVariant} initial={prefersReducedMotion ? undefined : "hidden"} whileInView={prefersReducedMotion ? undefined : "visible"} viewport={{ once: true, amount: 0.24 }} className="grid gap-5 md:grid-cols-2">
                        <OfferCard title="Custom Development" price="On quote" description="Apps, websites, dashboards, portals, and MVP builds scoped around your business flow." points={["Discovery-led scope", "UI, frontend, backend, and integrations", "Launch and handover planning"]} href="#quote" />
                        <OfferCard title="Standard Landing Page Templates" price="Rs. 15,000" description="A responsive landing page template design with founder-ready sections." points={["Web and mobile responsive", "Template structure selection", "3 content revisions included"]} href="/tech-services/templates" />
                    </motion.div>
                </div>
            </AnimatedSection>

            <AnimatedSection className="bg-canvas py-14 md:py-18" revealProps={revealProps}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader eyebrow="Startup builds" title="The useful stuff most early businesses actually need" />
                    <motion.div variants={gridVariant} initial={prefersReducedMotion ? undefined : "hidden"} whileInView={prefersReducedMotion ? undefined : "visible"} viewport={{ once: true, amount: 0.22 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {buildExamples.map(({ title, description, Icon }) => (
                            <motion.div key={title} variants={cardVariant} whileHover={prefersReducedMotion ? undefined : { y: -8, rotate: -0.5 }} transition={{ duration: 0.38, ease: EASE }} className="group rounded-xl border border-hairline bg-canvas p-5 transition-colors hover:border-primary-brand">
                                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-primary-brand transition-transform group-hover:scale-110">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="font-display text-xl font-medium text-ink">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-charcoal">{description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </AnimatedSection>

            <AnimatedSection id="templates" className="bg-cloud py-14 md:py-18" revealProps={revealProps}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                        <SectionHeader eyebrow="Templates" title="Pick a launch page starting point" />
                        <Link href="/tech-services/templates" className="group inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-primary-brand">
                            View all templates
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <motion.div variants={gridVariant} initial={prefersReducedMotion ? undefined : "hidden"} whileInView={prefersReducedMotion ? undefined : "visible"} viewport={{ once: true, amount: 0.22 }} className="mt-8 grid gap-5 lg:grid-cols-3">
                        {techTemplates.map((template) => (
                            <TemplateCard key={template.slug} template={template} />
                        ))}
                    </motion.div>
                </div>
            </AnimatedSection>

            <AnimatedSection className="bg-canvas py-14 md:py-18" revealProps={revealProps}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader eyebrow="Case studies" title="Example builds for practical startup operations" />
                    <motion.div variants={gridVariant} initial={prefersReducedMotion ? undefined : "hidden"} whileInView={prefersReducedMotion ? undefined : "visible"} viewport={{ once: true, amount: 0.22 }} className="mt-8 grid gap-5 lg:grid-cols-3">
                        {caseStudies.map((study) => (
                            <motion.div key={study.title} variants={cardVariant} whileHover={prefersReducedMotion ? undefined : { y: -10 }} className="rounded-xl border border-hairline bg-canvas p-5 shadow-sm">
                                <h3 className="font-display text-2xl font-medium text-ink">{study.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-charcoal">{study.description}</p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {study.tags.map((tag) => (
                                        <span key={tag} className="rounded-md border border-hairline bg-surface px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.24px] text-graphite">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </AnimatedSection>

            {articleCards.length > 0 && (
                <AnimatedSection className="bg-surface py-20 md:py-24" revealProps={revealProps}>
                    <div className="mx-auto max-w-7xl px-8">
                        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Tech Blogs</p>
                                <h2 className="font-display text-4xl font-medium leading-tight text-ink md:text-5xl">Build notes for founders</h2>
                            </div>
                            <Link href="/article" className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-charcoal">
                                View all articles
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                        <div className="rounded-2xl border border-hairline bg-cloud p-5 md:p-6">
                            <motion.div variants={gridVariant} initial={prefersReducedMotion ? undefined : "hidden"} whileInView={prefersReducedMotion ? undefined : "visible"} viewport={{ once: true, amount: 0.24 }} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {articleCards.map((article) => (
                                    <ArticleCardLink key={article._id} article={article} />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </AnimatedSection>
            )}

            <AnimatedSection className="overflow-x-clip bg-cloud py-20 md:py-24" revealProps={revealProps}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
                        <motion.div {...revealProps} className="lg:pt-2">
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Questions</p>
                            <h2 className="mb-4 font-display text-4xl font-medium leading-tight text-ink md:text-5xl">Tech service questions</h2>
                            <p className="mb-8 text-sm leading-relaxed text-charcoal">
                                Everything founders usually ask before starting a website, app, dashboard, or template page.
                            </p>
                            <Link href="#quote" className="group inline-flex items-center gap-2 text-sm font-medium text-primary-brand transition-colors hover:text-primary-deep">
                                Ask about your build
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                        <motion.div {...revealProps}>
                            <UniqueAccordion items={faqItems} defaultOpenId="1" />
                        </motion.div>
                    </div>
                </div>
            </AnimatedSection>

            <AnimatedSection className="bg-canvas py-10 md:py-14" revealProps={revealProps}>
                <MarketingCTASection
                    eyebrow="Build with StartupKaro Tech"
                    title={
                        <>
                            LAUNCH YOUR DIGITAL <span className="text-primary-brand">FOUNDATION</span>
                        </>
                    }
                    description={
                        <>
                            Start with a landing page, scope a custom app, or turn your operations into a dashboard your team can actually use.
                            <br />
                            Built by a team that understands startup setup, compliance, and growth.
                        </>
                    }
                    primaryText="Request Quote"
                    primaryHref="#quote"
                    secondaryText="View Templates"
                    secondaryHref="/tech-services/templates"
                    trustText="Founder focused - Launch ready - Practical tech support"
                />
            </AnimatedSection>

            <section id="quote" className="bg-canvas px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <motion.div {...revealProps} className="mx-auto w-full max-w-6xl">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-start">
                        <div className="space-y-5 lg:col-span-2">
                            <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Request quote</p>
                                <h2 className="font-display text-4xl font-medium leading-none text-ink lg:text-5xl">Tell us what you want to launch</h2>
                                <p className="mt-3 text-sm leading-relaxed text-charcoal lg:text-base">
                                    Share the build type, template preference, and project notes. The team will respond with next steps.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <ContactInfo icon={<Mail className="h-4 w-4 text-primary-brand" />} label="Email" value="contact@startupkaro.in" />
                                <ContactInfo icon={<Phone className="h-4 w-4 text-primary-brand" />} label="Phone" value="+91 789 00000 88" />
                                <ContactInfo icon={<WandSparkles className="h-4 w-4 text-primary-brand" />} label="Scope" value="Websites, apps, dashboards, UI/UX and automation" />
                            </div>
                        </div>
                        <div className="lg:col-span-3">
                            <div className="rounded-2xl border border-hairline bg-cloud p-5 md:p-6">
                                <form onSubmit={submitInquiry} className="space-y-4" noValidate>
                                    {submitted && (
                                        <p className="rounded-md border border-status-positive-border bg-status-positive-bg px-3 py-2 text-sm font-medium text-status-positive-fg">
                                            Inquiry submitted. Our team will contact you shortly.
                                        </p>
                                    )}
                                    <TextField label="Full Name" value={form.name} error={errors.name} onChange={(value) => setField("name", value)} autoComplete="name" />
                                    <TextField label="Email Address" value={form.email} error={errors.email} onChange={(value) => setField("email", value)} autoComplete="email" type="email" />
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="mb-2 block text-xs font-medium uppercase tracking-[0.28px] text-graphite">Mobile Number</Label>
                                            <PhoneField
                                                value={phoneDigits}
                                                onChange={(digits) => {
                                                    setPhoneDigits(digits);
                                                    if (errors.phone) setErrors((current) => ({ ...current, phone: "" }));
                                                }}
                                                error={!!errors.phone}
                                            />
                                            {errors.phone ? <p className="mt-1.5 text-xs text-error-brand">{errors.phone}</p> : <p className="mt-1.5 text-xs text-graphite">10-digit number, no spaces</p>}
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-xs font-medium uppercase tracking-[0.28px] text-graphite">Date of Submission</Label>
                                            <Input type="text" value={getTodayDate()} readOnly disabled className="h-10 w-full cursor-default select-none border-hairline-strong bg-surface text-graphite" />
                                        </div>
                                    </div>
                                    <SelectField label="Service Type" value={form.serviceType} values={["Custom Development", "Landing Page Template"]} onChange={(value) => setField("serviceType", value)} />
                                    {isTemplate && (
                                        <SelectField label="Template" value={form.template} values={techTemplates.map((template) => template.name)} onChange={(value) => setField("template", value)} />
                                    )}
                                    <MessageField value={form.notes} error={errors.notes} height={messageHeight} onChange={(value) => setField("notes", value)} onResizeStart={handleResizeStart} onResize={adjustMessageHeight} />
                                    <button type="submit" disabled={loading} className="mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-primary-brand py-3 text-xs font-medium uppercase tracking-[0.28px] text-white transition-all duration-200 hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-50">
                                        {loading ? "Sending..." : "Send Message"}
                                        <Send className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}

function AnimatedSection({ id, className, children, revealProps }: { id?: string; className: string; children: React.ReactNode; revealProps: Record<string, unknown> }) {
    return (
        <section id={id} className={className}>
            <motion.div {...revealProps}>{children}</motion.div>
        </section>
    );
}

function ProductWireframe({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
    return (
        <motion.div animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="rounded-xl border border-hairline bg-canvas p-4 shadow-[0_18px_52px_rgba(26,26,26,0.08)]">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
                <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-bloom-coral" />
                    <span className="h-2.5 w-2.5 rounded-full bg-tint-sky" />
                    <span className="h-2.5 w-2.5 rounded-full bg-storm-deep" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.28px] text-graphite">Founder OS</span>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-3">
                    <motion.div animate={prefersReducedMotion ? undefined : { width: ["74%", "96%", "74%"] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }} className="h-8 rounded-md bg-primary-brand/85" />
                    <div className="h-3 w-4/5 rounded-full bg-hairline-strong/70" />
                    <div className="h-3 w-3/5 rounded-full bg-hairline-strong/60" />
                    <div className="grid grid-cols-3 gap-2 pt-2">
                        {["bg-tint-sky", "bg-bloom-rose", "bg-surface"].map((className, index) => (
                            <motion.span key={className} animate={prefersReducedMotion ? undefined : { y: [0, index % 2 ? 5 : -5, 0] }} transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.12, ease: "easeInOut" }} className={`h-16 rounded-md ${className}`} />
                        ))}
                    </div>
                </div>
                <div className="rounded-lg border border-hairline bg-surface p-3">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.28px] text-graphite">Live</span>
                        <span className="rounded-md bg-status-positive-bg px-2 py-1 text-xs font-semibold text-status-positive-fg">MVP</span>
                    </div>
                    {[72, 46, 88, 58].map((width) => (
                        <span key={width} className="mb-2 block h-3 rounded-full bg-canvas" style={{ width: `${width}%` }} />
                    ))}
                    <div className="mt-4 flex h-20 items-end gap-1.5">
                        {[44, 70, 56, 88, 64].map((height, index) => (
                            <motion.span key={height} initial={prefersReducedMotion ? undefined : { height: 0 }} whileInView={prefersReducedMotion ? undefined : { height: `${height}%` }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }} className="flex-1 rounded-t bg-primary-brand/75" />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
    return (
        <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28px] text-graphite">{eyebrow}</p>
            <h2 className="font-display text-3xl font-medium leading-tight text-ink md:text-5xl">{title}</h2>
        </div>
    );
}

function OfferCard({ title, price, description, points, href }: { title: string; price: string; description: string; points: string[]; href: string }) {
    return (
        <motion.div variants={cardVariant} whileHover={{ y: -8, rotate: 0.4 }} className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="font-display text-3xl font-medium text-ink">{title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal">{description}</p>
                </div>
                <span className="w-fit rounded-md border border-primary-brand/20 bg-primary-soft px-3 py-2 text-sm font-bold text-primary-brand">{price}</span>
            </div>
            <div className="mt-5 space-y-2">
                {points.map((point) => (
                    <p key={point} className="flex items-center gap-2 text-sm font-medium text-charcoal">
                        <CheckCircle2 className="h-4 w-4 text-primary-brand" />
                        {point}
                    </p>
                ))}
            </div>
            <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-brand hover:text-primary-deep">
                Start inquiry
                <ExternalLink className="h-4 w-4" />
            </Link>
        </motion.div>
    );
}

function TemplateCard({ template }: { template: (typeof techTemplates)[number] }) {
    return (
        <motion.div variants={cardVariant} whileHover={{ y: -10, rotate: -0.4 }} className="rounded-xl border border-hairline bg-canvas p-5 shadow-sm">
            <Link href={`/tech-services/templates/${template.slug}`} className="group block">
                <div className="mb-5 overflow-hidden rounded-lg border border-hairline bg-surface">
                    <div className="relative aspect-[4/5] w-full">
                        <Image
                            src={template.image}
                            alt={template.imageAlt}
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.035]"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                    </div>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.28px] text-primary-brand">{template.type}</p>
                <h3 className="mt-2 font-display text-2xl font-medium text-ink group-hover:text-primary-brand">{template.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{template.description}</p>
            </Link>
        </motion.div>
    );
}

function ArticleCardLink({ article }: { article: ArticleCard }) {
    return (
        <motion.div variants={cardVariant}>
            <Link href={`/article/${article.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-canvas transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-brand hover:shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                <div className="relative h-44 shrink-0 overflow-hidden bg-surface">
                    {article.coverImage?.url ? (
                        <Image src={article.coverImage.url} alt={article.coverImage.alt || article.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                        <div className="absolute inset-0 bg-surface" />
                    )}
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <div className="flex items-center gap-2 text-xs text-graphite">
                        <span className="font-medium text-slate">{article.author?.name}</span>
                        <span>|</span>
                        <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-ink group-hover:underline decoration-hairline underline-offset-2">{article.title}</h3>
                    <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-slate">{article.summary}</p>
                </div>
            </Link>
        </motion.div>
    );
}

function ContactInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-hairline bg-canvas p-3.5 transition-colors duration-200 hover:border-primary-brand">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft">{icon}</div>
            <div>
                <p className="mb-0.5 text-xs font-medium uppercase tracking-[0.28px] text-graphite">{label}</p>
                <p className="text-sm text-ink">{value}</p>
            </div>
        </div>
    );
}

function TextField({ label, value, error, onChange, type = "text", autoComplete }: { label: string; value: string; error?: string; onChange: (value: string) => void; type?: string; autoComplete?: string }) {
    return (
        <div>
            <Label className="mb-2 block text-xs font-medium uppercase tracking-[0.28px] text-graphite">{label}</Label>
            <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={label} autoComplete={autoComplete} className={`h-10 w-full bg-canvas ${error ? "border-error-brand" : "border-hairline-strong"}`} />
            {error && <p className="mt-1.5 text-xs text-error-brand">{error}</p>}
        </div>
    );
}

function SelectField({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
    return (
        <div>
            <Label className="mb-2 block text-xs font-medium uppercase tracking-[0.28px] text-graphite">{label}</Label>
            <Select value={value} onValueChange={(next) => onChange(next ?? value)}>
                <SelectTrigger className="h-10 w-full border-hairline-strong">
                    <SelectValue>{value}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {values.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function MessageField({ value, error, height, onChange, onResizeStart, onResize }: { value: string; error?: string; height: number; onChange: (value: string) => void; onResizeStart: (event: React.PointerEvent<HTMLButtonElement>) => void; onResize: (delta: number) => void }) {
    return (
        <div>
            <Label className="mb-2 block text-xs font-medium uppercase tracking-[0.28px] text-graphite">Message</Label>
            <div className="relative">
                <Textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder="Example: I need a delivery app for a local food business, with customer ordering and admin order tracking." rows={4} style={{ height }} className={`resize-none pb-14 sm:pb-4 bg-canvas ${error ? "border-error-brand" : "border-hairline-strong"}`} />
                <div className="absolute bottom-2 left-1/2 flex h-11 -translate-x-1/2 items-center rounded-md border border-hairline-strong bg-canvas text-graphite shadow-[0_2px_8px_rgba(26,26,26,0.08)] sm:hidden">
                    <button type="button" aria-label="Reduce message box height" onClick={() => onResize(-MESSAGE_RESIZE_STEP)} className="flex h-11 w-11 items-center justify-center rounded-l-md transition-colors hover:bg-surface hover:text-primary-brand focus:outline-none focus:ring-2 focus:ring-primary-brand/20"><Minus className="h-4 w-4" /></button>
                    <button type="button" aria-label="Increase message box height" onClick={() => onResize(MESSAGE_RESIZE_STEP)} className="flex h-11 w-11 items-center justify-center rounded-r-md border-l border-hairline-strong transition-colors hover:bg-surface hover:text-primary-brand focus:outline-none focus:ring-2 focus:ring-primary-brand/20"><Plus className="h-4 w-4" /></button>
                </div>
                <button type="button" aria-label="Drag to resize message box" title="Drag to resize" onPointerDown={onResizeStart} className="absolute bottom-2 left-1/2 hidden h-8 w-14 -translate-x-1/2 touch-none items-center justify-center rounded-md border border-hairline-strong bg-canvas text-graphite shadow-[0_2px_8px_rgba(26,26,26,0.08)] transition-colors hover:bg-surface hover:text-primary-brand focus:outline-none focus:ring-2 focus:ring-primary-brand/20 sm:flex">
                    <GripHorizontal className="h-4 w-4" />
                </button>
            </div>
            <div className="mt-1.5 flex items-start justify-between">
                {error ? <p className="text-xs text-error-brand">{error}</p> : <span />}
                <p className="ml-2 shrink-0 text-xs text-graphite">{value.length}/1000</p>
            </div>
        </div>
    );
}
