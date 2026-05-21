// features/marketing/components/sections/HeroSection.tsx

"use client";

import Image from "next/image";
import { ShieldCheck, Clock, Star } from "lucide-react";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";
import { LetterSwap } from "@/components/fancy/text";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function HeroSection() {
    const prefersReducedMotion = useReducedMotion();

    const leftProps = prefersReducedMotion
        ? {}
        : {
              initial: { opacity: 0, x: -40 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.7, ease: EASE },
          };

    const rightProps = prefersReducedMotion
        ? {}
        : {
              initial: { opacity: 0, x: 40 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.7, ease: EASE, delay: 0.08 },
          };

    return (
        <section className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:gap-12">
                    {/* Left — text content */}
                    <motion.div {...leftProps} className="relative flex-1 min-w-0 overflow-hidden rounded-2xl border border-hairline bg-canvas px-7 py-12 md:px-10 md:py-16">
                        <div className="absolute inset-y-8 left-0 w-1.5 rounded-r-full bg-primary-brand" />

                        <div className="relative">
                            {/* Eyebrow */}
                            <p className="text-xs uppercase tracking-[0.28px] text-graphite font-medium mb-4">
                                Trusted by 5,000+ startups across India
                            </p>

                        {/* Headline */}
                        <h1 className="font-display text-4xl md:text-6xl font-medium text-ink leading-none mb-4">
                            Start your business{" "}
                            <span className="text-primary-brand">without</span>{" "}
                            the paperwork
                        </h1>

                        {/* Sub-headline */}
                        <p className="text-base md:text-lg text-charcoal leading-relaxed mb-6 max-w-xl">
                            <span className="text-charcoal font-medium">Expert CAs and CSs</span> handle your GST, company registration, trademarks, and compliance, end to end. Fixed pricing, document coordination by email, and clear updates by email and call.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col items-stretch gap-4 mb-6 sm:flex-row sm:items-center">
                            <FlowButton
                                href="/services"
                                text="Explore Services"
                                iconName="briefcase"
                                colorVariant="primary"
                                wrapperClassName="w-full sm:w-auto sm:min-w-[220px]"
                                className="w-full"
                            />
                            <FlowSecondaryButton
                                href="/contact"
                                text="Talk to an Expert"
                                showIcon={false}
                                wrapperClassName="w-full sm:w-auto sm:min-w-[220px]"
                                className="w-full"
                            />
                        </div>

                        {/* Trust row */}
                            <div className="flex flex-wrap gap-5 border-t border-hairline pt-5 text-xs text-graphite">
                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-4 w-4 text-primary-brand" />
                                    100% legal compliance
                                </span>
                                <span className="group flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-charcoal" />
                                    <LetterSwap text="Fast turnaround" stagger={8} />
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Star className="h-4 w-4 text-charcoal fill-charcoal" />
                                    4.9/5 customer rating
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — hero image */}
                    <motion.div {...rightProps} className="hidden w-96 shrink-0 items-end justify-center overflow-hidden rounded-2xl border border-hairline bg-cloud lg:flex xl:w-108">
                        <Image
                            src="/cross_arms_guy.png"
                            alt="Business professional"
                            width={432}
                            height={504}
                            priority
                            className="object-contain drop-shadow-xl"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
