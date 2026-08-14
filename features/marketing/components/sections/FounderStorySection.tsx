"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const team = [
    {
        name: "Neelansh Singh",
        role: "Founder & CEO",
        description: "Leads the company's vision to empower founders and entrepreneurs with the expertise, innovation, and support needed to build successful startups.",
        image: "/assets/team-neelansh-singh.png",
    },
    {
        name: "Hardik Singh",
        role: "Chartered Accountant",
        description: "Specializes in taxation, financial advisory, and regulatory compliance, helping businesses build strong financial foundations.",
        image: "/assets/team-hardik-singh.jpeg",
    },
    {
        name: "Gurvinder Singh",
        role: "Corporate Strategy Advisor",
        description: "Brings extensive leadership experience from leading multinational corporations (MNCs), providing strategic guidance, industry insights, and business expertise to help startups build strong foundations and achieve sustainable growth.",
        image: "/assets/team-gurvinder-singh.jpeg",
    },
    {
        name: "Bismanjeet Singh",
        role: "Company Secretary",
        description: "Oversees Company Law advisory, ROC compliance, statutory filings, and corporate governance, ensuring businesses meet every regulatory requirement.",
        image: "/assets/team-bismanjeet-singh.webp",
    },
    {
        name: "Daksh Nauni",
        role: "Chief Technology Officer",
        description: "Drives technology and innovation across the Startupkaro platform while supervising web and app development projects that help startups and businesses embrace digital transformation.",
        image: "/assets/team-daksh-nauni.jpeg",
    },
    {
        name: "Adv. Jasmeet Singh",
        role: "Trademarks and IPR Attorney",
        description: "Provides expert legal counsel on trademarks, copyrights, patents, and intellectual property rights across India and international jurisdictions, enabling startups to protect their innovations and scale with confidence.",
        image: "/assets/team-jasmeet-singh.jpeg",
    },
];

export function FounderStorySection() {
    const prefersReducedMotion = useReducedMotion();

    const sectionProps = prefersReducedMotion
        ? {}
        : {
              initial: { opacity: 0, y: 32 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.18 },
              transition: { duration: 0.7, ease: EASE },
          };

    return (
        <section className="bg-cloud py-20 md:py-24">
            <motion.div {...sectionProps} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
                    <div className="max-w-3xl">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                            Leadership team
                        </p>
                        <h2 className="font-display text-4xl font-medium leading-none text-ink md:text-5xl">
                            The people behind StartupKaro
                        </h2>
                    </div>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-charcoal">
                        Finance, legal, compliance, operations, and technology leadership working as one execution team.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {team.map((member) => (
                        <article
                            key={member.name}
                            className="group relative overflow-hidden rounded-xl border border-hairline bg-canvas p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-brand hover:shadow-[0_2px_8px_rgba(26,26,26,0.08)]"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-primary-brand opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                            <div
                                className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border border-hairline bg-primary-soft"
                            >
                                <Image
                                    src={member.image}
                                    alt={`${member.name} portrait`}
                                    fill
                                    sizes="96px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                            </div>
                            <h3 className="font-display text-xl font-medium leading-tight text-ink">
                                {member.name}
                            </h3>
                            <p className="mt-1 min-h-10 text-sm font-semibold leading-snug text-primary-brand">{member.role}</p>
                            <p className="mt-3 min-h-12 border-t border-hairline pt-3 text-justify text-sm leading-relaxed text-graphite">{member.description}</p>
                        </article>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
