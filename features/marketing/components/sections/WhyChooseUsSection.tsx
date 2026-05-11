// features/marketing/components/sections/WhyChooseUsSection.tsx

import Image from "next/image";
import { Users, Globe, Tag, BarChart3 } from "lucide-react";
import { ChatBubbles } from "@/features/marketing/components/ChatBubbles";

const CARD_BASE =
    "rounded-[18px] border border-hairline transition-all duration-200";

export function WhyChooseUsSection() {
    return (
        <section className="bg-white py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

                    {/* LHS — brand image panel */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-[22px] border border-deep-green/20 bg-deep-green min-h-72 lg:min-h-152.5">
                            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

                            {/* Chat bubbles — upper portion of card, above the image */}
                            <div className="absolute inset-x-0 top-0 bottom-[42%] z-20 overflow-hidden">
                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-deep-green/80 to-transparent z-10" />
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
                            <p className="font-mono text-xs uppercase tracking-[0.28px] text-coral mb-2">Our edge</p>
                            <h2 className="font-display text-4xl md:text-5xl text-ink font-normal tracking-tight">
                                Why founders choose us
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

                            {/* Tile 1 — Hero (2×2): Expert CA & CS team */}
                            <div className={`${CARD_BASE} bg-soft-stone sm:col-span-2 sm:row-span-2 relative overflow-hidden p-7 flex flex-col justify-between min-h-70 sm:min-h-80`}>
                                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-deep-green/10 text-deep-green">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-normal text-ink mb-2">Expert CA &amp; CS team</h3>
                                    <p className="text-base text-body-muted leading-relaxed">
                                        Every filing is handled by a qualified Chartered Accountant or Company Secretary, not a software bot.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 2 — Small (1×1): 100% online */}
                            <div className={`${CARD_BASE} bg-soft-stone sm:col-span-1 p-6 flex flex-col gap-4 min-h-40`}>
                                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-deep-green/10 text-deep-green">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-display text-base font-normal text-ink mb-1.5">100% online</h3>
                                    <p className="text-sm text-body-muted leading-relaxed">
                                        No office visits, no courier delays. Upload documents, sign digitally, and track progress, all online.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 3 — Small (1×1): Fixed pricing */}
                            <div className={`${CARD_BASE} bg-soft-stone sm:col-span-1 p-6 flex flex-col gap-4 min-h-40`}>
                                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-coral/15 text-coral">
                                    <Tag className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-display text-base font-normal text-ink mb-1.5">Fixed, transparent pricing</h3>
                                    <p className="text-sm text-body-muted leading-relaxed">
                                        What you see is what you pay. Government fees are included. No surprises at checkout.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 4 — Wide strip (3×1): Real-time updates */}
                            <div className={`${CARD_BASE} bg-soft-stone sm:col-span-3 p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6`}>
                                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 bg-deep-green/10 text-deep-green">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-display text-base font-normal text-ink mb-1">Real-time status updates</h3>
                                    <p className="text-sm text-body-muted leading-relaxed">
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
