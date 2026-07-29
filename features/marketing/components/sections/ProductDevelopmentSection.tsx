"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LayoutDashboard, MonitorSmartphone, Rocket, Smartphone, Sparkles } from "lucide-react";
import { MagnetLines } from "@/components/fancy/MagnetLines";
import { FlowButton } from "@/components/custom/FlowButton";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const MODES = [
    {
        id: "website",
        label: "Website",
        Icon: MonitorSmartphone,
        title: "Founder-ready website",
        metric: "7 days",
        action: "Launch page",
        color: "bg-primary-brand",
    },
    {
        id: "app",
        label: "App",
        Icon: Smartphone,
        title: "Mobile-first product",
        metric: "MVP",
        action: "User flow",
        color: "bg-bloom-coral",
    },
    {
        id: "dashboard",
        label: "Dashboard",
        Icon: LayoutDashboard,
        title: "Operations cockpit",
        metric: "Live",
        action: "Track work",
        color: "bg-storm-deep",
    },
] as const;

export function ProductDevelopmentSection() {
    const prefersReducedMotion = useReducedMotion();
    const [activeMode, setActiveMode] = useState<(typeof MODES)[number]["id"]>("website");
    const active = MODES.find((mode) => mode.id === activeMode) ?? MODES[0];

    useEffect(() => {
        const interval = window.setInterval(() => {
            setActiveMode((currentMode) => {
                const currentIndex = MODES.findIndex((mode) => mode.id === currentMode);
                const nextIndex = (currentIndex + 1) % MODES.length;
                return MODES[nextIndex].id;
            });
        }, 5000);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <section className="bg-canvas py-4 md:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.38 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="relative isolate rounded-2xl border border-hairline bg-canvas px-5 py-7 text-ink shadow-[0_24px_70px_rgba(26,26,26,0.08)] sm:px-7 md:px-9 md:py-9"
                >
                    <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(247,247,247,0.72),transparent_44%,rgba(201,224,252,0.28)_82%,transparent)]" />
                        <MagnetLines
                            rows={8}
                            columns={11}
                            containerSize="540px"
                            lineColor="rgba(53,99,115,0.16)"
                            lineWidth="3px"
                            lineHeight="32px"
                            baseAngle={-18}
                            className="pointer-events-none absolute right-0 top-0 translate-x-14 -translate-y-16 rotate-6 opacity-60"
                        />
                        <MagnetLines
                            rows={5}
                            columns={8}
                            containerSize="320px"
                            lineColor="rgba(41,110,249,0.12)"
                            lineWidth="2px"
                            lineHeight="24px"
                            baseAngle={20}
                            className="pointer-events-none absolute bottom-0 left-1/3 hidden translate-y-14 -rotate-12 opacity-70 md:grid"
                        />
                    </div>

                    <div className="relative grid gap-7 lg:grid-cols-[1fr_0.82fr] lg:items-center">
                        <div className="max-w-3xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-primary-brand/20 bg-canvas/75 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28px] text-primary-brand">
                                <Sparkles className="h-4 w-4" />
                                Launch the product customers can trust
                            </div>
                            <h2 className="font-display text-3xl font-medium leading-tight text-ink md:text-5xl">
                                Websites and apps that make your startup feel real from day one
                            </h2>
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal md:text-base">
                                Turn your startup into a complete digital business. From professional websites and mobile apps to customer portals and admin dashboards, we build everything you need to launch, manage, and grow.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.28px] text-charcoal">
                                <span className="rounded-md border border-primary-brand/20 bg-canvas/70 px-3 py-2">MVP to market</span>
                                <span className="rounded-md border border-primary-brand/20 bg-canvas/70 px-3 py-2">Customer portals</span>
                                <span className="rounded-md border border-primary-brand/20 bg-canvas/70 px-3 py-2">Founder dashboards</span>
                            </div>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <FlowButton
                                    href="/contact"
                                    text="Plan My Build"
                                    iconName="rocket"
                                    colorVariant="primary"
                                    wrapperClassName="w-full sm:w-auto sm:min-w-[190px]"
                                    className="h-11 w-full"
                                />
                            </div>
                        </div>

                        <div className="relative overflow-visible pt-2 sm:min-h-[390px] sm:overflow-hidden sm:pt-0 lg:min-h-[370px]">
                            <MagnetLines
                                rows={7}
                                columns={8}
                                containerSize="320px"
                                lineColor="rgba(41,110,249,0.18)"
                                lineWidth="3px"
                                lineHeight="28px"
                                baseAngle={-10}
                                className="pointer-events-none absolute right-3 top-4 max-w-full overflow-hidden opacity-45"
                            />
                            <motion.div
                                className="relative z-10 mx-auto w-full max-w-[430px] rounded-xl border border-hairline bg-canvas shadow-[0_28px_56px_rgba(26,26,26,0.12)] sm:absolute sm:inset-x-0 sm:bottom-0"
                            >
                                <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
                                    <div className="hidden items-center gap-1.5 sm:flex">
                                        <span className="h-2.5 w-2.5 rounded-full bg-bloom-coral" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-tint-sky" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-storm-deep" />
                                    </div>
                                    <div className="grid w-full grid-cols-3 rounded-md border border-hairline bg-surface p-1 sm:w-auto">
                                        {MODES.map(({ id, label, Icon }) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setActiveMode(id)}
                                                className={`flex h-8 items-center justify-center gap-1.5 rounded px-2 text-[11px] font-semibold uppercase tracking-[0.24px] transition-colors ${activeMode === id
                                                    ? "bg-canvas text-primary-brand shadow-sm"
                                                    : "text-slate hover:text-ink"
                                                    }`}
                                                aria-pressed={activeMode === id}
                                            >
                                                <Icon className="hidden h-3.5 w-3.5 sm:block" />
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative min-h-[258px] overflow-hidden px-4 py-4">
                                    <motion.div
                                        key={active.id}
                                        initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.36, ease: EASE }}
                                        className="relative z-10"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.28px] text-primary-brand">{active.action}</p>
                                                <h3 className="mt-2 font-display text-2xl font-medium leading-tight text-ink">{active.title}</h3>
                                            </div>
                                            <div className={`${active.color} rounded-md px-3 py-2 text-sm font-bold text-white shadow-lg`}>
                                                {active.metric}
                                            </div>
                                        </div>

                                        <div className="mt-5 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                                            <WireframePreview mode={active.id} prefersReducedMotion={prefersReducedMotion} />
                                            <div className="space-y-3">
                                                {["UX", "API", "Ship"].map((step, index) => (
                                                    <motion.div
                                                        key={`${active.id}-${step}`}
                                                        className="flex items-center gap-2 rounded-lg border border-hairline bg-canvas p-3 shadow-sm"
                                                        initial={prefersReducedMotion ? false : { opacity: 0, x: 14 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.08, ease: EASE }}
                                                    >
                                                        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${index === 2 ? active.color : "bg-tint-sky"} text-white`}>
                                                            {index === 2 ? <Rocket className="h-3.5 w-3.5" /> : index + 1}
                                                        </span>
                                                        <span className="text-sm font-semibold text-charcoal">{step}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function WireframePreview({
    mode,
    prefersReducedMotion,
}: {
    mode: (typeof MODES)[number]["id"];
    prefersReducedMotion: boolean | null;
}) {
    if (mode === "app") {
        return (
            <div className="flex min-h-[154px] items-center justify-center rounded-lg border border-hairline bg-surface p-3">
                <div className="relative h-[142px] w-[78px] rounded-[18px] border-4 border-ink bg-canvas p-2 shadow-sm">
                    <div className="mx-auto h-1.5 w-7 rounded-full bg-ink" />
                    <motion.div
                        className="mt-3 h-8 rounded-lg bg-tint-sky"
                        animate={prefersReducedMotion ? undefined : { opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                        <span className="h-8 rounded-md bg-surface" />
                        <span className="h-8 rounded-md bg-bloom-rose/80" />
                    </div>
                    <div className="mt-2 space-y-1.5">
                        {[44, 34, 50].map((width) => (
                            <span key={width} className="block h-1.5 rounded-full bg-hairline-strong/70" style={{ width }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (mode === "dashboard") {
        return (
            <div className="min-h-[154px] rounded-lg border border-hairline bg-surface p-3">
                <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((item) => (
                        <motion.span
                            key={item}
                            className="h-10 rounded-md bg-canvas shadow-sm"
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: item * 0.07, ease: EASE }}
                        />
                    ))}
                </div>
                <div className="mt-3 flex h-20 items-end gap-1.5 rounded-md bg-canvas px-2 pb-2 shadow-sm">
                    {[42, 62, 50, 78, 58, 88].map((height, index) => (
                        <motion.span
                            key={height}
                            className="flex-1 rounded-t bg-primary-brand/75"
                            initial={prefersReducedMotion ? false : { height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[154px] rounded-lg border border-hairline bg-surface p-3">
            <div className="rounded-md border border-hairline bg-canvas shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-hairline px-2 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-bloom-coral" />
                    <span className="h-1.5 w-1.5 rounded-full bg-tint-sky" />
                    <span className="h-1.5 w-1.5 rounded-full bg-storm-deep" />
                </div>
                <div className="p-2.5">
                    <div className="grid grid-cols-[1.1fr_0.9fr] gap-2">
                        <div>
                            <motion.span
                                className="block h-3 rounded-full bg-primary-brand/75"
                                initial={prefersReducedMotion ? false : { width: 0 }}
                                animate={{ width: "86%" }}
                                transition={{ duration: 0.5, ease: EASE }}
                            />
                            <span className="mt-2 block h-2 w-3/4 rounded-full bg-hairline-strong/60" />
                            <span className="mt-1.5 block h-2 w-1/2 rounded-full bg-hairline-strong/50" />
                        </div>
                        <span className="h-14 rounded-md bg-tint-sky" />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        {[0, 1, 2].map((item) => (
                            <motion.span
                                key={item}
                                className="h-10 rounded-md bg-surface"
                                animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }}
                                transition={{ duration: 2.4, delay: item * 0.16, repeat: Infinity, ease: "easeInOut" }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
