// features/marketing/components/sections/HeroSection.tsx

"use client";

import Image from "next/image";
import { BarChart3, Clock, Rocket, ShieldCheck, Star, TrendingUp } from "lucide-react";
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
                    <motion.div {...leftProps} className="relative flex-1 min-w-0 overflow-hidden rounded-2xl bg-canvas px-7 py-12 md:px-10 md:py-16">
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
                    <motion.div {...rightProps} className="relative hidden min-h-[520px] w-96 shrink-0 items-end justify-center rounded-2xl bg-canvas lg:flex xl:w-108">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(201,224,252,0.85),rgba(255,255,255,0)_58%)]" />
                        <div className="absolute left-1/2 top-[49%] h-[350px] w-[380px] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] rounded-full bg-primary-brand/15 shadow-[18px_24px_60px_rgba(41,110,249,0.18)] xl:h-[390px] xl:w-[430px]" />
                        <div className="absolute left-1/2 top-[47%] h-[330px] w-[360px] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] rounded-full bg-tint-sky shadow-[inset_-24px_-18px_46px_rgba(41,110,249,0.18),inset_18px_16px_34px_rgba(255,255,255,0.58)] xl:h-[370px] xl:w-[410px]" />
                        <div className="absolute bottom-[116px] left-1/2 z-0 h-10 w-[62%] -translate-x-1/2 rounded-[999px] bg-tint-sky shadow-[0_18px_35px_rgba(41,110,249,0.16)]" />
                        <div className="absolute left-[18%] top-[18%] flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-brand text-white shadow-[0_18px_40px_rgba(41,110,249,0.22)]">
                            <Rocket className="h-7 w-7" />
                        </div>
                        <div className="absolute right-3 top-[25%] z-20 w-36 rounded-2xl border border-hairline bg-canvas p-4 shadow-[0_18px_45px_rgba(26,26,26,0.10)]">
                            <BarChart3 className="mb-2 h-7 w-7 text-primary-brand" />
                            <p className="font-display text-3xl font-medium leading-none text-ink">500+</p>
                            <p className="mt-1 text-xs font-medium text-graphite">Startups served</p>
                        </div>
                        <div className="absolute left-0 top-[49%] z-20 rounded-xl border border-hairline bg-canvas px-4 py-3 shadow-[0_16px_36px_rgba(26,26,26,0.10)]">
                            <div className="flex gap-1 text-[#f5bd00]">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star key={index} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            <p className="mt-1 text-xs font-medium text-graphite">4.9 rating</p>
                        </div>
                        <div className="absolute bottom-7 left-[11%] z-30 flex w-[calc(70%-30px)] items-center gap-3 rounded-2xl border border-hairline bg-canvas px-5 py-4 shadow-[0_18px_45px_rgba(26,26,26,0.12)]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-brand/10 text-primary-brand">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-ink">Fast growth</p>
                                <p className="text-xs font-medium text-graphite">Compliance-ready setup</p>
                            </div>
                        </div>
                        <div className="relative z-10 max-h-[500px] overflow-hidden [clip-path:ellipse(50%_45%_at_50%_48%)]">
                            <Image
                                src="/cross_arms_guy.png"
                                alt="Business professional"
                                width={432}
                                height={504}
                                priority
                                className="object-contain drop-shadow-xl"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
