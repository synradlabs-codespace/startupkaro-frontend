// features/marketing/components/sections/LandingFAQSection.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UniqueAccordion } from "@/components/ui/unique-accordion";
import { motion, useReducedMotion } from "framer-motion";
import { landingFaqData } from "@/features/marketing/data/landing-faq.data";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function LandingFAQSection() {
    const prefersReducedMotion = useReducedMotion();
    const [showAllFaqs, setShowAllFaqs] = useState(false);
    const visibleFaqItems = showAllFaqs ? landingFaqData : landingFaqData.slice(0, 7);

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
        <section className="overflow-x-clip bg-cloud py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
                    <motion.div {...leftProps} className="lg:pt-2">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                            Questions
                        </p>
                        <h2 className="mb-4 font-display text-4xl font-medium leading-tight text-ink md:text-5xl">
                            Common Questions, Clear Answers
                        </h2>
                        <p className="mb-8 text-sm leading-relaxed text-charcoal">
                            Everything you need to know before getting started.<br />
                            Can&apos;t find what you&apos;re looking for?
                        </p>
                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-2 text-sm font-medium text-primary-brand transition-colors hover:text-primary-deep"
                        >
                            Talk to an expert
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                    <motion.div {...rightProps}>
                        <UniqueAccordion items={visibleFaqItems} defaultOpenId="1" />
                        {landingFaqData.length > 7 && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setShowAllFaqs((current) => !current)}
                                    className="inline-flex h-10 items-center justify-center rounded-md border border-hairline-strong bg-canvas px-5 text-xs font-semibold uppercase tracking-[0.7px] text-ink transition-colors hover:border-primary-brand hover:text-primary-brand"
                                >
                                    {showAllFaqs ? "Show Less" : "Show More"}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
