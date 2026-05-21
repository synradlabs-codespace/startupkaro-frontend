"use client";

import { BriefcaseBusiness, FileCheck2, Scale } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const founders = [
    {
        name: "Hardik Singh",
        role: "Chartered Accountant",
        icon: FileCheck2,
        summary:
            "After working with EY and then building his independent CA practice, Hardik saw the same problem repeat for founders: compliance was necessary, but the process felt opaque, fragmented, and difficult to trust.",
    },
    {
        name: "Neelansh Singh",
        role: "Lawyer & business consultant",
        icon: Scale,
        summary:
            "Neelansh has worked closely with small businesses at the ground level, where paperwork delays, unclear pricing, and scattered advice often slow down otherwise promising ventures.",
    },
];

const principles = [
    "Fixed pricing before you start",
    "Clear deliverables for every service",
    "Online-first workflow with expert support",
];

export function FounderStorySection() {
    const prefersReducedMotion = useReducedMotion();

    const leftProps = prefersReducedMotion
        ? {}
        : {
              initial: { opacity: 0, x: -40 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true, amount: 0.2 },
              transition: { duration: 0.7, ease: EASE },
          };

    const rightProps = prefersReducedMotion
        ? {}
        : {
              initial: { opacity: 0, x: 40 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true, amount: 0.2 },
              transition: { duration: 0.7, ease: EASE, delay: 0.08 },
          };

    return (
        <section className="bg-canvas py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
                    <motion.div {...leftProps}>
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                            Founder story
                        </p>
                        <h2 className="font-display text-4xl font-medium leading-none text-ink md:text-5xl">
                            Built by people who have seen the paperwork problem up close
                        </h2>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal">
                            StartupKaro began with a simple belief: India&apos;s new-age founders should not lose momentum to unclear compliance, hidden fees, or endless offline follow-ups.
                        </p>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal">
                            With startup culture accelerating across India, founders need a system that makes legal, tax, and compliance work predictable. StartupKaro brings fixed pricing, fixed deliverables, and expert-led execution into one online flow, so businesses can stay compliant without uncertainty.
                        </p>

                        <div className="mt-7 grid gap-3 sm:grid-cols-3">
                            {principles.map((principle) => (
                                <div key={principle} className="rounded-xl border border-hairline bg-cloud p-4">
                                    <BriefcaseBusiness className="mb-3 h-4 w-4 text-primary-brand" />
                                    <p className="text-sm font-medium leading-snug text-ink">{principle}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div {...rightProps} className="grid gap-4">
                        {founders.map(({ name, role, icon: Icon, summary }) => (
                            <article
                                key={name}
                                className="group rounded-xl border border-hairline bg-canvas p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-brand hover:shadow-[0_2px_8px_rgba(26,26,26,0.08)]"
                            >
                                <div className="mb-5 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft">
                                        <Icon className="h-5 w-5 text-primary-brand" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl font-medium text-ink">{name}</h3>
                                        <p className="text-sm text-graphite">{role}</p>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-charcoal">{summary}</p>
                            </article>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
