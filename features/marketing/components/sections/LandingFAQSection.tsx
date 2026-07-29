// features/marketing/components/sections/LandingFAQSection.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UniqueAccordion } from "@/components/ui/unique-accordion";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const faqItems = [
    {
        id: "1",
        number: "01",
        title: "What services do you offer?",
        content:
            "We provide end-to-end business solutions including but not limited to company registration, GST, trademarks, taxation, accounting, ROC compliance, legal advisory, websites, branding, funding support, and business consulting-all under one roof.",
    },
    {
        id: "2",
        number: "02",
        title: "Who can benefit from your services?",
        content:
            "We work with startups, MSMEs, private limited companies, LLPs, partnerships, proprietorships, established businesses, professionals, and entrepreneurs across India.",
    },
    {
        id: "3",
        number: "03",
        title: "Why choose StartupKaro over others?",
        content:
            "Unlike traditional consultants, we don't just complete registrations-we become your long-term business partner by supporting legal, financial, compliance, technology, branding, and growth needs.",
    },
    {
        id: "4",
        number: "04",
        title: "Do I need to visit your office?",
        content:
            "No. Most of our services are completely online. You can share documents digitally, and our team will handle the complete process remotely.",
    },
    {
        id: "5",
        number: "05",
        title: "How does the process work?",
        content:
            "Book a consultation, share your requirements and documents, receive expert guidance, and let our team manage the entire process while keeping you updated.",
    },
    {
        id: "6",
        number: "06",
        title: "How long will my service take?",
        content:
            "Timelines vary depending on the service and government approvals. Before we begin, we'll provide an estimated completion timeline.",
    },
    {
        id: "7",
        number: "07",
        title: "Will I get a dedicated consultant?",
        content:
            "Yes. Every client is assigned a dedicated expert who remains your single point of contact throughout the project.",
    },
    {
        id: "8",
        number: "08",
        title: "Do you provide support after completion?",
        content:
            "Absolutely. We continue assisting clients with compliance, taxation, legal matters, business growth, and future requirements even after project completion.",
    },
    {
        id: "9",
        number: "09",
        title: "Are my documents secure?",
        content:
            "Yes. We maintain strict confidentiality and use secure processes to protect your business information and documents.",
    },
    {
        id: "10",
        number: "10",
        title: "Can you help if my business is already running?",
        content:
            "Yes. Whether you're launching a new venture or managing an existing business, we help with compliance, taxation, restructuring, expansion, branding, and strategic growth.",
    },
    {
        id: "11",
        number: "11",
        title: "Can you help with funding and investor readiness?",
        content:
            "Yes. We assist businesses with financial planning, investor documentation, due diligence support, business structuring, and fundraising readiness.",
    },
    {
        id: "12",
        number: "12",
        title: "Which industries do you serve?",
        content:
            "We work with businesses across hospitality, healthcare, manufacturing, retail, education, e-commerce, IT, professional services, real estate, finance, and many other sectors.",
    },
    {
        id: "13",
        number: "13",
        title: "How can I get started?",
        content:
            "Simply book a consultation, and our experts will understand your requirements and recommend the best solution for your business.",
    },
    {
        id: "14",
        number: "14",
        title: "Are all your consultations free?",
        content:
            "Yes! Most general business queries and initial guidance are completely free of charge. For businesses that require in-depth strategic advice, 1:1 consultations with our Chartered Accountants (CAs), Company Secretaries (CSs), legal experts, or business consultants are offered as paid sessions. These consultations are tailored to your specific needs and focus on strategy, planning, compliance, and problem-solving to help you make informed business decisions. This way, you receive free guidance for general questions while paying only for personalized expert advice when you need it.",
    },
];

export function LandingFAQSection() {
    const prefersReducedMotion = useReducedMotion();
    const [showAllFaqs, setShowAllFaqs] = useState(false);
    const visibleFaqItems = showAllFaqs ? faqItems : faqItems.slice(0, 7);

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
                        {faqItems.length > 7 && (
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
