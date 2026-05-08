// features/marketing/components/sections/WhyChooseUsSection.tsx

import Image from "next/image";
import { Users, Globe, Tag, BarChart3 } from "lucide-react";
import { ChatBubbles } from "@/features/marketing/components/ChatBubbles";

const CARD_BASE =
    "rounded-2xl border border-gray-200/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200";

export function WhyChooseUsSection() {
    return (
        <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

                    {/* LHS — brand image panel */}
                    <div className="relative">
                        {/* Card: background, blur decorators, chat bubbles — overflow-hidden stays for rounded corners */}
                        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-linear-to-br from-blue-50/60 via-white to-indigo-50/30 min-h-72 lg:min-h-152.5">
                            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#000080]/6 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#FF9933]/8 blur-3xl" />

                            {/* Chat bubbles — upper portion of card, above the image */}
                            <div className="absolute inset-x-0 top-0 bottom-[42%] z-20 overflow-hidden">
                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-white/70 to-transparent z-10" />
                                <ChatBubbles />
                            </div>
                        </div>

                        {/* Image lives outside the overflow-hidden card so it can pop above the top edge */}
                        <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-10">
                            <Image
                                src="/macbook_guy.png"
                                alt="StartupKaro founder at work"
                                fill
                                className="object-contain object-bottom scale-[1.4] origin-bottom"
                            />
                        </div>
                    </div>

                    {/* RHS — heading + bento grid */}
                    <div className="lg:col-span-3">
                        <div className="mb-8">
                            <p className="text-xs font-semibold text-[#FF9933] uppercase tracking-wider mb-2">Our edge</p>
                            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal">
                                Why founders choose us
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

                            {/* Tile 1 — Hero (2×2): Expert CA & CS team */}
                            <div className={`${CARD_BASE} bg-[#000080]/5 sm:col-span-2 sm:row-span-2 relative overflow-hidden p-7 flex flex-col justify-between min-h-70 sm:min-h-80`}>
                                <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#000080]/5 blur-2xl" />
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#000080]/8 text-[#000080]">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-[#000080] mb-2">Expert CA &amp; CS team</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Every filing is handled by a qualified Chartered Accountant or Company Secretary, not a software bot.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 2 — Small (1×1): 100% online */}
                            <div className={`${CARD_BASE} bg-[#6BAE3A]/5 sm:col-span-1 p-6 flex flex-col gap-4 min-h-40`}>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#6BAE3A]/10 text-[#6BAE3A]">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-[#6BAE3A] mb-1.5">100% online</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        No office visits, no courier delays. Upload documents, sign digitally, and track progress, all online.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 3 — Small (1×1): Fixed pricing */}
                            <div className={`${CARD_BASE} bg-[#FF9933]/5 sm:col-span-1 p-6 flex flex-col gap-4 min-h-40`}>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#FF9933]/10 text-[#FF9933]">
                                    <Tag className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-[#FF9933] mb-1.5">Fixed, transparent pricing</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        What you see is what you pay. Government fees are included. No surprises at checkout.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 4 — Wide strip (3×1): Real-time updates */}
                            <div className={`${CARD_BASE} bg-[#000080]/5 sm:col-span-3 p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6`}>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-[#000080]/8 text-[#000080]">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-[#000080] mb-1">Real-time status updates</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Track every step of your application in your dashboard. Know exactly where your filing stands.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
