"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BookOpenCheck, FileText, Pause, Play, Send, type LucideIcon } from "lucide-react";
import { FlowButton } from "@/components/custom/FlowButton";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;
const SLIDE_COUNT = 3;

const SLIDE_LABELS = ["Tech services", "GST registration", "Franchise services"];

const controlClass =
    "flex h-10 w-10 items-center justify-center rounded-md border border-hairline-strong bg-canvas text-ink transition-colors hover:border-primary-brand hover:text-primary-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-brand focus-visible:ring-offset-2";

type SlideProps = { active: boolean; index: number };

type SlideShellProps = SlideProps & {
    /** Text colour and desktop grid columns. */
    className: string;
    /** Background of the card. It lives on its own layer so the woman can rise above the card's top edge. */
    bgClassName: string;
    /** Decorative shapes, clipped to the card. */
    decor: ReactNode;
    children: ReactNode;
};

/** Every slide sits in one grid cell, so the carousel keeps the height of its tallest slide. */
function SlideShell({ active, index, className, bgClassName, decor, children }: SlideShellProps) {
    return (
        <div
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${SLIDE_COUNT}`}
            inert={!active}
            className={cn(
                "col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none",
                active ? "opacity-100" : "pointer-events-none opacity-0"
            )}
        >
            <div className={cn("relative grid h-full grid-rows-[auto_1fr] md:min-h-70 md:grid-rows-none", className)}>
                {/* On mobile the card starts lower down, so the top of the image stands out above it. */}
                <div
                    aria-hidden="true"
                    className={cn("pointer-events-none absolute inset-x-0 bottom-0 top-24 overflow-hidden rounded-2xl md:inset-0", bgClassName)}
                >
                    {decor}
                </div>
                {children}
            </div>
        </div>
    );
}

/**
 * The woman is the eye-catcher, so she is large on every screen size and rises above the card.
 * Desktop: clipped only along the bottom edge, flush with the card, free to overflow the top.
 * Mobile: sits above the text, and her lower body fades into the card colour instead of being cut off.
 */
function PopImage({ src, alt, active, className }: { src: string; alt: string; active: boolean; className?: string }) {
    return (
        // z-5 keeps her above the card layer even when `order-first` changes the paint order.
        <div className={cn("relative z-5 h-80 md:h-auto", className)}>
            <div
                className="relative h-full w-full [-webkit-mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)] md:absolute md:inset-x-0 md:bottom-0 md:h-[calc(100%+5rem)] md:[-webkit-mask-image:none] md:[mask-image:none]"
                style={{ clipPath: "inset(-6rem -6rem 0 -6rem)" }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width: 768px) 380px, 100vw"
                    className={cn(
                        "object-contain object-bottom drop-shadow-[0_18px_24px_rgba(26,26,26,0.28)] transition-transform duration-500 motion-reduce:transition-none",
                        active ? "translate-y-0" : "translate-y-3"
                    )}
                />
            </div>
        </div>
    );
}

function LightButton({ href, text }: { href: string; text: string }) {
    return (
        <Link
            href={href}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:w-auto sm:min-w-[220px]"
        >
            {text}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
    );
}

/* Slide 1: solid brand blue, pill chips, image on the right. */
function TechSlide({ active, index }: SlideProps) {
    return (
        <SlideShell
            active={active}
            index={index}
            className="text-white md:grid-cols-[1fr_380px]"
            bgClassName="bg-primary-brand"
            decor={
                <>
                    <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10" />
                    <div className="absolute bottom-0 right-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                </>
            }
        >
            <div className="relative z-10 -mt-4 flex flex-col justify-start md:justify-center p-5 md:mt-0 md:p-8 lg:px-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.7px] text-white/80">Tech services</p>
                <h2 className="max-w-xl font-display text-3xl font-medium leading-tight md:text-4xl">
                    Launch your website, app or dashboard without a tech team
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                    {["Websites", "Mobile apps", "Dashboards"].map((chip) => (
                        <span key={chip} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium">
                            {chip}
                        </span>
                    ))}
                </div>
                <p className="mt-3 max-w-md text-sm text-white/85">Clear scope, transparent pricing and support from idea to launch.</p>
                <div className="mt-5">
                    <LightButton href="/tech-services" text="Explore Tech Services" />
                </div>
            </div>

            <PopImage
                src="/assets/promo-tech-services.webp"
                alt="Smiling woman in a navy StartupKaro polo holding a laptop that shows a website dashboard"
                active={active}
                className="order-first md:order-none"
            />
        </SlideShell>
    );
}

const gstPoints: { icon: LucideIcon; text: string }[] = [
    { icon: FileText, text: "Documents prepared and verified for you" },
    { icon: Send, text: "Filed on the GST portal on your behalf" },
    { icon: BookOpenCheck, text: "Guidance on returns and invoicing" },
];

/* Slide 2: soft sky tint, image on the left, three icon cards. */
function GstSlide({ active, index }: SlideProps) {
    return (
        <SlideShell
            active={active}
            index={index}
            className="text-ink md:grid-cols-[380px_1fr]"
            bgClassName="bg-tint-sky"
            decor={
                <>
                    <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-white/60 blur-2xl" />
                    <div className="absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-primary-brand/10" />
                </>
            }
        >
            <PopImage
                src="/assets/promo-gst-registration.webp"
                alt="Smiling woman in a navy StartupKaro polo holding a tablet showing an approved document"
                active={active}
            />

            <div className="relative z-10 -mt-4 flex flex-col justify-start md:justify-center p-5 md:mt-0 md:p-8 lg:pl-4 lg:pr-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">GST registration</p>
                <h2 className="max-w-xl font-display text-3xl font-medium leading-tight md:text-4xl">
                    Get your GST registration handled by an expert CA
                </h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-3 md:gap-2.5">
                    {gstPoints.map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2.5 rounded-xl bg-white p-2 shadow-sm md:items-start md:p-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-tint-sky text-primary-brand md:h-8 md:w-8">
                                <Icon className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <p className="text-[13px] font-semibold leading-snug md:text-sm">{text}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-5">
                    <FlowButton
                        href="/services/gst-registration"
                        text="Register for GST"
                        iconName="arrow-right"
                        wrapperClassName="w-full sm:w-auto sm:min-w-[220px]"
                        className="w-full"
                    />
                </div>
            </div>
        </SlideShell>
    );
}

const franchiseSteps = [
    "Franchise business model and plan",
    "Legal framework and franchise agreements",
    "Operations, brand protection and expansion strategy",
];

/* Slide 3: deep teal, numbered steps, ring behind the image. */
function FranchiseSlide({ active, index }: SlideProps) {
    return (
        <SlideShell
            active={active}
            index={index}
            className="text-white md:grid-cols-[1fr_380px]"
            bgClassName="bg-storm-deep"
            decor={
                <>
                    <div className="absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-white/15" />
                    <div className="absolute -right-8 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full border border-white/20" />
                    <div className="absolute bottom-0 right-16 h-52 w-52 rounded-full bg-bloom-coral/25 blur-3xl" />
                </>
            }
        >
            <div className="relative z-10 -mt-4 flex flex-col justify-start md:justify-center p-5 md:mt-0 md:p-8 lg:px-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.7px] text-white/80">Franchise services</p>
                <h2 className="max-w-xl font-display text-3xl font-medium leading-tight md:text-4xl">
                    Ready to grow your brand through franchising?
                </h2>
                <ol className="mt-4 space-y-2">
                    {franchiseSteps.map((step, i) => (
                        <li key={step} className="flex items-center gap-3 text-sm md:text-base">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold">
                                {i + 1}
                            </span>
                            {step}
                        </li>
                    ))}
                </ol>
                <div className="mt-5">
                    <LightButton href="/franchise" text="Explore Franchise Services" />
                </div>
            </div>

            <PopImage
                src="/assets/promo-franchise-services.webp"
                alt="Smiling woman in a navy StartupKaro polo holding a miniature shop model"
                active={active}
                className="order-first md:order-none"
            />
        </SlideShell>
    );
}

export function ServicePromoCarousel() {
    const [active, setActive] = useState(0);
    const [hoverPaused, setHoverPaused] = useState(false);
    const [userPaused, setUserPaused] = useState(false);
    const paused = hoverPaused || userPaused;

    // Rotation keeps going when the OS asks for reduced motion: the slides only cross-fade, and
    // the fade itself is switched off by motion-reduce. The pause button covers WCAG 2.2.2.
    // The effect restarts on every slide change, so manual navigation gets a full interval.
    useEffect(() => {
        if (paused) return;
        const timer = window.setTimeout(() => setActive((i) => (i + 1) % SLIDE_COUNT), AUTOPLAY_MS);
        return () => window.clearTimeout(timer);
    }, [active, paused]);

    const go = (next: number) => setActive((next + SLIDE_COUNT) % SLIDE_COUNT);

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Featured services"
            className="overflow-x-clip bg-surface pb-14 pt-10 md:pb-16 md:pt-32"
            onMouseEnter={() => setHoverPaused(true)}
            onMouseLeave={() => setHoverPaused(false)}
            onFocus={() => setHoverPaused(true)}
            onBlur={() => setHoverPaused(false)}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Announce slide changes to screen readers only while rotation is paused. */}
                <div className="grid" aria-live={paused ? "polite" : "off"}>
                    <TechSlide active={active === 0} index={0} />
                    <GstSlide active={active === 1} index={1} />
                    <FranchiseSlide active={active === 2} index={2} />
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {SLIDE_LABELS.map((label, index) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => go(index)}
                                aria-label={`Show ${label}`}
                                aria-current={index === active}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-brand focus-visible:ring-offset-2",
                                    index === active ? "w-8 bg-primary-brand" : "w-2 bg-hairline-strong hover:bg-slate"
                                )}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setUserPaused((p) => !p)}
                            aria-label={userPaused ? "Resume automatic rotation" : "Pause automatic rotation"}
                            className={controlClass}
                        >
                            {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </button>
                        <button type="button" onClick={() => go(active - 1)} aria-label="Previous service" className={controlClass}>
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => go(active + 1)} aria-label="Next service" className={controlClass}>
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
