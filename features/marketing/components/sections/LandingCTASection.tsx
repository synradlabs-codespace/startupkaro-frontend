// features/marketing/components/sections/LandingCTASection.tsx

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function LandingCTASection() {
    return (
        <section className="bg-gray-50/60 py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF9933] to-orange-400 px-8 py-14 text-center shadow-xl shadow-[#FF9933]/20">
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative">
                        <h2 className="font-serif text-3xl md:text-4xl text-white font-normal mb-4">
                            Ready to start your business?
                        </h2>
                        <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
                            Join thousands of founders who trust StartupKaro for their compliance and legal needs. Get started in minutes.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 h-11 px-6 text-sm font-medium text-[#FF9933] bg-white rounded-xl hover:bg-orange-50 transition-colors shadow-sm"
                            >
                                Browse Services
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 h-11 px-6 text-sm font-medium text-white border border-white/40 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                Talk to an Expert
                            </Link>
                        </div>
                        <p className="mt-6 text-white/60 text-xs flex items-center justify-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            No hidden fees · Expert CAs assigned · 100% online
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
