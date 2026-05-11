// features/marketing/components/sections/LandingCTASection.tsx

import Link from "next/link";

import { ShieldCheck } from "lucide-react";

import { FlowButton } from "@/components/custom/FlowButton";

export function LandingCTASection() {
    return (
        <section className="relative overflow-hidden bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-[22px] bg-soft-stone border border-hairline px-8 py-14 text-center">
                    <div className="relative">
                        <h2 className="font-display text-4xl md:text-5xl text-ink font-normal tracking-tight mb-4">
                            Ready to start your business?
                        </h2>
                        <p className="text-body-muted text-base mb-8 max-w-xl mx-auto">
                            Join thousands of founders who trust StartupKaro for their compliance and legal needs. Get started in minutes.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <FlowButton
                                href="/services"
                                text="Browse Services"
                                colorVariant="navy"
                            />
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 h-11 px-6 text-sm font-medium text-ink border border-hairline rounded-full hover:bg-black/5 transition-colors"
                            >
                                Talk to an Expert
                            </Link>
                        </div>
                        <p className="mt-6 text-body-muted text-xs flex items-center justify-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            No hidden fees · Expert CAs assigned · 100% online
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
