// features/marketing/components/sections/LandingFAQSection.tsx

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UniqueAccordion } from "@/components/ui/unique-accordion";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const faqItems = [
    {
        id: "1",
        number: "01",
        title: "What types of businesses can StartupKaro help me register?",
        content:
            "We support Private Limited Companies, Limited Liability Partnerships (LLPs), One Person Companies, Sole Proprietorships, and more. Our experts help you pick the structure that best fits your goals, liability preference, and growth plans.",
    },
    {
        id: "2",
        number: "02",
        title: "How long does the registration process take?",
        content:
            "Most registrations are completed within 7–15 working days, depending on the business structure and document readiness. Your assigned CA tracks every application actively to prevent delays.",
    },
    {
        id: "3",
        number: "03",
        title: "Do I need to visit any government office in person?",
        content:
            "No. StartupKaro is 100% online. Your CA or CS handles all filings, government interactions, and follow-ups digitally. You only need to upload the required documents from wherever you are.",
    },
    {
        id: "4",
        number: "04",
        title: "What's included in the annual compliance packages?",
        content:
            "Packages cover board meetings, annual returns, financial statements, income tax filings, and GST returns, covering everything required to keep your company in good standing with the MCA and Income Tax Department.",
    },
    {
        id: "5",
        number: "05",
        title: "Are the CAs and CSs on the platform verified professionals?",
        content:
            "Yes. Every professional is verified for their ICAI or ICSI membership, practice certificate, and prior experience before being onboarded. You can view credentials directly from your dashboard.",
    },
    {
        id: "6",
        number: "06",
        title: "What happens if I miss a compliance deadline?",
        content:
            "Late filings attract government penalties. Our system sends proactive reminders well before each deadline, and your assigned expert will alert you if urgent action is needed, minimising your risk.",
    },
    {
        id: "7",
        number: "07",
        title: "Can I start with one service and add more later?",
        content:
            "Absolutely. Many clients begin with company registration and add GST, payroll, or accounting services as their business grows. There's no lock-in, and pricing is fixed for each service you choose.",
    },
];

export function LandingFAQSection() {
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
        <section className="bg-cloud py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
                    <motion.div {...leftProps} className="lg:pt-2">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                            Questions
                        </p>
                        <h2 className="mb-4 font-display text-4xl font-medium leading-tight text-ink md:text-5xl">
                            Common questions, clear answers
                        </h2>
                        <p className="mb-8 text-sm leading-relaxed text-charcoal">
                            Everything you need to know before getting started. Can't find what you're looking for?
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
                        <UniqueAccordion items={faqItems} defaultOpenId="1" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
