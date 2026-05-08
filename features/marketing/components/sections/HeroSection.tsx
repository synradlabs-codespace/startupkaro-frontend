// features/marketing/components/sections/HeroSection.tsx

import Image from "next/image";
import { ShieldCheck, Clock, Star } from "lucide-react";

import { FlowButton } from "@/components/custom/FlowButton";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/30 pointer-events-none" />
            <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#FF9933]/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Left — text content */}
                    <div className="flex-1 min-w-0">
                        {/* Trust badge */}
                        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-[#FF9933]/8 border border-[#FF9933]/15 text-xs font-medium text-[#d4720a]">
                            <Star className="h-3 w-3 fill-[#FF9933] text-[#FF9933]" />
                            Trusted by 5,000+ startups across India
                        </div>

                        {/* Headline */}
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-gray-900 leading-tight tracking-tight mb-6">
                            Start your business{" "}
                            <span className="text-[#FF9933]">without</span>{" "}
                            the paperwork
                        </h1>

                        {/* Sub-headline */}
                        <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
                            Expert CAs and CSs handle your GST, company registration, trademarks, and compliance, end to end. Fixed pricing, real-time updates, zero back-and-forth.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-3 mb-10">
                            <FlowButton href="/services" text="Explore Services" colorVariant="saffron" />
                        </div>

                        {/* Trust row */}
                        <div className="flex flex-wrap gap-5 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-[#6BAE3A]" />
                                100% legal compliance
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-[#FF9933]" />
                                Fast turnaround
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 text-[#FF9933] fill-[#FF9933]" />
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
