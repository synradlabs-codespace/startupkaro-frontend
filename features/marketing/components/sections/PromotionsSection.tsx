"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeIndianRupee, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { FlowButton } from "@/components/custom/FlowButton";

const trustPoints = [
    "100% accuracy",
    "Maximum tax refund guaranteed",
    "Trusted by 5000+ users",
];

function LiveSeasonText() {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <span>ITR filing season is live</span>;
    }

    return (
        <span className="relative isolate -mx-1 inline-flex overflow-hidden rounded-sm px-1">
            <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 -z-10 w-1/2 bg-gradient-to-r from-transparent via-primary-brand/20 to-transparent"
                initial={{ x: "-130%" }}
                animate={{ x: "260%" }}
                transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    repeatDelay: 0.65,
                    ease: "easeInOut",
                }}
            />
            <motion.span
                className="absolute bottom-0 left-1 -z-10 h-1.5 rounded-full bg-primary-brand/20"
                initial={{ width: "18%", opacity: 0.45 }}
                animate={{ width: ["18%", "96%", "18%"], opacity: [0.45, 0.9, 0.45] }}
                transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    repeatDelay: 0.65,
                    ease: "easeInOut",
                }}
            />
            <span className="relative">ITR filing season is live</span>
        </span>
    );
}

function LiveSeasonBadge() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary-brand/20 bg-primary-brand/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28px] text-primary-brand">
            <motion.span
                aria-hidden="true"
                animate={prefersReducedMotion ? undefined : { rotate: [0, 12, -8, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.65, ease: "easeInOut" }}
                className="flex h-4 w-4 items-center justify-center"
            >
                <Sparkles className="h-4 w-4" />
            </motion.span>
            <LiveSeasonText />
        </div>
    );
}

export function PromotionsSection() {
    return (
        <section className="overflow-x-clip bg-surface py-14 md:py-18">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-8 overflow-hidden rounded-2xl border border-hairline bg-canvas p-5 md:grid-cols-[1.02fr_0.98fr] md:p-8 lg:p-10">
                    <div className="max-w-2xl">
                        <LiveSeasonBadge />

                        <h2 className="font-display text-4xl font-medium leading-tight text-ink md:text-5xl">
                            File your ITR today with 100% accuracy
                        </h2>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {trustPoints.map((point, index) => (
                                <div key={point} className="rounded-xl border border-hairline bg-paper p-4">
                                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-tint-sky text-primary-brand">
                                        {index === 0 ? (
                                            <ShieldCheck className="h-5 w-5" />
                                        ) : index === 1 ? (
                                            <BadgeIndianRupee className="h-5 w-5" />
                                        ) : (
                                            <CheckCircle2 className="h-5 w-5" />
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold leading-snug text-ink">{point}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-7">
                            <FlowButton
                                href="/services/income-tax-returns"
                                text="File Your ITR Now"
                                iconName="arrow-right"
                                wrapperClassName="w-full sm:w-auto sm:min-w-[220px]"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="relative min-h-[390px] overflow-hidden md:min-h-[470px]">
                        <div className="absolute left-1/2 top-[54%] h-[72%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-[999px] bg-tint-sky/70 blur-3xl" />
                        <div className="absolute bottom-3 left-1/2 h-10 w-[58%] -translate-x-1/2 rounded-[999px] bg-ink/15 blur-xl" />
                        <div className="absolute -bottom-6 left-1/2 top-0 w-full max-w-[620px] -translate-x-1/2 md:-bottom-10 md:-top-8 md:w-[120%] lg:-right-10 lg:left-auto lg:translate-x-0">
                            <Image
                                src="/assets/itr-refund-promo-cutout.png"
                                alt="Professional woman holding a phone showing an ITR refund"
                                fill
                                sizes="(min-width: 1024px) 620px, 100vw"
                                className="object-contain object-bottom drop-shadow-[0_34px_42px_rgba(26,26,26,0.22)]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
