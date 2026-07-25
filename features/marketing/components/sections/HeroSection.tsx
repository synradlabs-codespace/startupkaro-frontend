// features/marketing/components/sections/HeroSection.tsx

"use client";

import Image from "next/image";
import { Clock, ShieldCheck, Star } from "lucide-react";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";
import { LetterSwap } from "@/components/fancy/text";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const heroHighlights = [
    {
        title: "Fast & Reliable",
        description: "Quick turn around and accuracy you can trust",
        icon: "/assets/fast and reliable.png",
        className: "left-3 top-[calc(22%-80px)] xl:-left-20",
    },
    {
        title: "Expert Team",
        description: "CA, CS, Lawyers & Compliance experts under one roof",
        icon: "/assets/expert team.png",
        className: "right-3 top-[42%] xl:-right-20",
    },
    {
        title: "Compliant & Secure",
        description: "100% legal compliance and data protection",
        icon: "/assets/compliant and secure.png",
        className: "left-3 bottom-[130px] xl:-left-20",
    },
];

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
        <section className="relative overflow-x-clip px-3 sm:px-4 lg:px-5 xl:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:gap-12">
                    {/* Left — text content */}
                    <motion.div {...leftProps} className="relative flex-1 min-w-0 overflow-hidden rounded-2xl bg-canvas px-7 pb-12 pt-6 md:px-10 md:py-16">
                        <div className="relative">
                            {/* Eyebrow */}
                            <p className="text-xs uppercase tracking-[0.28px] text-graphite font-medium mb-4">
                                Trusted by 5000+ startups across India
                            </p>

                        {/* Headline */}
                        <h1 className="font-display text-4xl md:text-6xl font-medium text-ink leading-none mb-4">
                            Your Trusted Partner for{" "}
                            <span className="text-primary-brand">Business Growth</span>
                        </h1>

                        {/* Sub-headline */}
                        <p className="text-base md:text-lg text-charcoal leading-relaxed mb-6 max-w-xl">
                            We bring together experienced Chartered Accountants, Company Secretaries, Lawyers, and Compliance Experts to help businesses incorporate, remain compliant, protect their brand, and achieve sustainable growth. One team. Complete business solutions.
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
                    <motion.div {...rightProps} className="relative hidden min-h-[520px] w-96 shrink-0 items-end justify-center overflow-hidden rounded-2xl bg-canvas lg:flex xl:overflow-visible xl:w-108">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(201,224,252,0.85),rgba(255,255,255,0)_58%)]" />
                        <div className="absolute left-1/2 top-[49%] h-[350px] w-[380px] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] rounded-full bg-primary-brand/15 shadow-[18px_24px_60px_rgba(41,110,249,0.18)] xl:h-[390px] xl:w-[430px]" />
                        <div className="absolute left-1/2 top-[47%] h-[330px] w-[360px] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] rounded-full bg-tint-sky shadow-[inset_-24px_-18px_46px_rgba(41,110,249,0.18),inset_18px_16px_34px_rgba(255,255,255,0.58)] xl:h-[370px] xl:w-[410px]" />
                        <div className="absolute bottom-[116px] left-1/2 z-0 h-10 w-[62%] -translate-x-1/2 rounded-[999px] bg-tint-sky shadow-[0_18px_35px_rgba(41,110,249,0.16)]" />
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
                        {heroHighlights.map((item) => (
                            <div
                                key={item.title}
                                className={`absolute z-30 grid w-[232px] grid-cols-[68px_1fr] items-center gap-2 rounded-xl border border-hairline bg-canvas/95 px-2 py-1.5 shadow-[0_18px_42px_rgba(26,26,26,0.12)] backdrop-blur ${item.className}`}
                            >
                                <Image
                                    src={item.icon}
                                    alt=""
                                    width={68}
                                    height={68}
                                    className="h-[68px] w-[68px] object-contain"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-bold leading-tight text-ink">{item.title}</p>
                                    <p className="mt-1 text-[11px] font-medium leading-snug text-graphite">{item.description}</p>
                                </div>
                            </div>
                        ))}
                        <div className="absolute bottom-4 right-0 z-30 grid w-[252px] grid-cols-[158px_1fr] items-center gap-1 overflow-hidden rounded-xl border border-hairline bg-canvas px-2 py-1 shadow-[0_18px_45px_rgba(26,26,26,0.12)] xl:-right-3">
                            <Image
                                src="/assets/circle avatars crop.png"
                                alt=""
                                width={158}
                                height={56}
                                className="h-14 w-[158px] object-contain"
                            />
                            <p className="text-sm font-bold leading-tight text-primary-brand">
                                5000+ Happy clients
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
