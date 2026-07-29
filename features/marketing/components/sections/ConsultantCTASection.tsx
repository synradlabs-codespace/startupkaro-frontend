"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeIndianRupee, CalendarClock, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { FlowButton } from "@/components/custom/FlowButton";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const points = [
    { icon: MessageCircle, label: "Private 1:1 call" },
    { icon: ShieldCheck, label: "CA/CS/legal guidance" },
    { icon: CalendarClock, label: "Select Your Preferred Time Slot" },
];

export function ConsultantCTASection() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className="bg-canvas py-4 md:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="relative isolate overflow-hidden rounded-2xl border border-primary-brand/20 bg-ink px-5 py-7 text-white shadow-[0_18px_52px_rgba(26,26,26,0.16)] sm:px-7 md:px-9 md:py-8"
                >
                    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(110deg,rgba(41,110,249,0.28),transparent_34%,rgba(53,99,115,0.34)_72%,transparent)]" />
                    <motion.div
                        aria-hidden="true"
                        className="absolute inset-y-0 -left-24 w-32 skew-x-[-18deg] bg-white/12"
                        animate={prefersReducedMotion ? undefined : { x: ["0%", "920%"] }}
                        transition={{ duration: 4.8, repeat: Infinity, repeatDelay: 1.1, ease: "easeInOut" }}
                    />

                    <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div className="max-w-3xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28px] text-white">
                                <Sparkles className="h-4 w-4 text-primary-soft" />
                                Need clarity before choosing?
                            </div>
                            <h2 className="font-display text-3xl font-medium leading-tight md:text-5xl">
                                Get Personalized Consultation Tailored to Your Business
                            </h2>
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/78 md:text-base">
                                For founders who want peace of mind before filing, registering, or fixing compliance, book a focused 1:1 session and leave with a clear next step.
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                {points.map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-2.5 rounded-xl border border-white/12 bg-white/8 px-3 py-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary-brand">
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span className="text-sm font-semibold leading-snug text-white">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 rounded-xl border border-white/14 bg-white/10 p-4 backdrop-blur md:min-w-[290px]">
                            <div className="flex items-end gap-2">
                                <BadgeIndianRupee className="mb-2 h-7 w-7 text-primary-soft" />
                                <div>
                                    <p className="font-display text-5xl font-medium leading-none">399</p>
                                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.28px] text-white/68">per session</p>
                                </div>
                            </div>
                            <FlowButton
                                href="/customer/checkout?service=professional-consulting-service"
                                text="Book Consulting"
                                iconName="message-circle"
                                colorVariant="primary"
                                wrapperClassName="w-full justify-stretch"
                                className="h-12 w-full"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
