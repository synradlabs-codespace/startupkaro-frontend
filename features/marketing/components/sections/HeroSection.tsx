// features/marketing/components/sections/HeroSection.tsx

import Image from "next/image";
import { ShieldCheck, Clock, Star } from "lucide-react";
import { FlowButton } from "@/components/custom/FlowButton";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-tint-sky rounded-2xl">
            {/* Subtle decorative blobs */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-tint-mint/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-tint-lavender/60 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-8 py-20 md:py-28">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Left — text content */}
                    <div className="flex-1 min-w-0">
                        {/* Eyebrow */}
                        <p className="text-xs uppercase tracking-[0.28px] text-steel font-medium mb-4">
                            Trusted by 5,000+ startups across India
                        </p>

                        {/* Headline */}
                        <h1 className="font-display text-5xl md:text-7xl font-semibold text-ink leading-none tracking-tight mb-6">
                            Start your business{" "}
                            <span className="italic font-normal text-charcoal">without</span>{" "}
                            the paperwork
                        </h1>

                        {/* Sub-headline */}
                        <p className="text-lg text-slate leading-relaxed mb-8 max-w-xl">
                            <span className="text-charcoal font-medium">Expert CAs and CSs</span> handle your GST, company registration, trademarks, and compliance, end to end. Fixed pricing, real-time updates, zero back-and-forth.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-3 mb-10">
                            <FlowButton href="/services" text="Explore Services" colorVariant="navy" />
                            <FlowButton href="/contact" text="Talk to an Expert" colorVariant="navy" />
                        </div>

                        {/* Trust row */}
                        <div className="flex flex-wrap gap-5 text-xs text-steel">
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-charcoal" />
                                100% legal compliance
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-charcoal" />
                                Fast turnaround
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 text-charcoal fill-charcoal" />
                                4.9/5 customer rating
                            </span>
                        </div>
                    </div>

                    {/* Right — hero image */}
                    <div className="hidden lg:flex shrink-0 items-end justify-center w-105 xl:w-120">
                        <Image
                            src="/cross_arms_guy.png"
                            alt="Business professional"
                            width={480}
                            height={560}
                            priority
                            className="object-contain drop-shadow-xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
