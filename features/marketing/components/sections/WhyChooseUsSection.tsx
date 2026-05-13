// features/marketing/components/sections/WhyChooseUsSection.tsx

import Image from "next/image";
import { Users, Globe, Tag, BarChart3 } from "lucide-react";
import { ChatBubbles } from "@/features/marketing/components/ChatBubbles";

const CARD_BASE =
    "relative overflow-hidden rounded-xl border border-hairline bg-canvas transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-brand hover:shadow-[0_2px_8px_rgba(26,26,26,0.08)]";

const AMBIENT_ICON =
    "pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-primary-brand opacity-10";

const CONTENT_LAYER = "relative z-10";

export function WhyChooseUsSection() {
    return (
        <section className="bg-cloud py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

                    {/* LHS — brand image panel */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-2xl border border-hairline bg-canvas min-h-[28rem] lg:min-h-152.5 shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-canvas/40 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-canvas/40 blur-3xl" />

                            <div className="absolute inset-0 lg:inset-x-0 lg:top-0 lg:bottom-[42%] z-20 overflow-hidden">
                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-canvas/80 to-transparent z-10" />
                                <ChatBubbles />
                            </div>
                        </div>

                        <div className="hidden lg:block absolute inset-x-0 bottom-0 top-0 pointer-events-none z-10">
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
                            <p className="text-xs uppercase tracking-[0.28px] text-graphite font-medium mb-2">Our edge</p>
                            <h2 className="font-display text-4xl md:text-5xl text-ink font-medium">
                                Why founders choose us
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

                            {/* Tile 1 — Hero (2×2): Expert CA & CS team */}
                            <div className={`${CARD_BASE} sm:col-span-2 sm:row-span-2 p-7 flex flex-col justify-end min-h-70 sm:min-h-80`}>
                                <Users className={`${AMBIENT_ICON} h-36 w-36 sm:h-44 sm:w-44`} />
                                <div className={CONTENT_LAYER}>
                                    <h3 className="mb-3 font-display text-2xl font-medium leading-[1.17] text-ink">
                                        Expert CA &amp; CS team
                                    </h3>
                                    <p className="max-w-lg text-base leading-relaxed text-charcoal">
                                        Every filing is handled by a qualified Chartered Accountant or Company Secretary, not a software bot.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 2 — Small (1×1): 100% online */}
                            <div className={`${CARD_BASE} sm:col-span-1 p-6 flex flex-col justify-end min-h-40`}>
                                <Globe className={`${AMBIENT_ICON} h-28 w-28`} />
                                <div className={CONTENT_LAYER}>
                                    <h3 className="mb-2 font-display text-xl font-medium leading-none text-ink">Email-led document flow</h3>
                                    <p className="text-sm leading-relaxed text-charcoal">
                                        No office visits or courier delays. Share documents on StartupKaro&apos;s official email and our team coordinates the rest.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 3 — Small (1×1): Fixed pricing */}
                            <div className={`${CARD_BASE} sm:col-span-1 p-6 flex flex-col justify-end min-h-40`}>
                                <Tag className={`${AMBIENT_ICON} h-28 w-28`} />
                                <div className={CONTENT_LAYER}>
                                    <h3 className="mb-2 font-display text-xl font-medium leading-[1.1] text-ink">Fixed, transparent pricing</h3>
                                    <p className="text-sm leading-relaxed text-charcoal">
                                        What you see is what you pay. Government fees are included. No surprises at checkout.
                                    </p>
                                </div>
                            </div>

                            {/* Tile 4 — Wide strip (3×1): Expert updates */}
                            <div className={`${CARD_BASE} sm:col-span-3 p-6 min-h-40 flex items-center`}>
                                <BarChart3 className={`${AMBIENT_ICON} h-32 w-32 sm:h-36 sm:w-36`} />
                                <div className={`${CONTENT_LAYER} max-w-2xl`}>
                                    <h3 className="mb-2 font-display text-2xl font-medium leading-[1.17] text-ink">Expert-led status updates</h3>
                                    <p className="text-sm leading-relaxed text-charcoal md:text-base">
                                        Your assigned expert keeps you updated by email and call, so you always know where your filing stands.
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
