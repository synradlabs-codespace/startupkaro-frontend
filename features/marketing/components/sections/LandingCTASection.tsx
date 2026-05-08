// features/marketing/components/sections/LandingCTASection.tsx

import Link from "next/link";

import { ShieldCheck } from "lucide-react";

import { FlowButton } from "@/components/custom/FlowButton";

export function LandingCTASection() {
    return (
        <section className="relative overflow-hidden bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 px-8 py-14 text-center shadow-sm">
                    {/* Blue blush background — mirrors Hero's orange blush pattern */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-50/60 via-white to-indigo-50/30 rounded-3xl" />
                    <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#000080]/6 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-100/40 blur-3xl" />

                    <div className="relative">
                        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal mb-4">
                            Ready to start your business?
                        </h2>
                        <p className="text-gray-500 text-base mb-8 max-w-xl mx-auto">
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
                                className="inline-flex items-center gap-2 h-11 px-6 text-sm font-medium text-[#000080] border border-[#000080]/20 rounded-xl hover:bg-[#000080]/5 transition-colors"
                            >
                                Talk to an Expert
                            </Link>
                        </div>
                        <p className="mt-6 text-gray-400 text-xs flex items-center justify-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            No hidden fees · Expert CAs assigned · 100% online
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
