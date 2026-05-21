// features/marketing/components/sections/ServiceProcess.tsx

import type { Service } from "@/features/marketing/data/types";

export function ServiceProcess({ service }: { service: Service }) {
    return (
        <section className="bg-cloud py-14 md:py-18">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:items-start">
                <div className="lg:pt-2">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Process</p>
                    <h2 className="font-display text-3xl font-medium text-ink md:text-4xl">How we process your request</h2>
                </div>
                <div className="rounded-2xl border border-hairline bg-canvas p-6 md:p-8">
                    {service.process.map((item, idx) => (
                        <div key={item.step} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-brand text-xs font-medium text-white">
                                    {item.step}
                                </div>
                                {idx < service.process.length - 1 && (
                                    <div className="w-px flex-1 bg-hairline my-2" />
                                )}
                            </div>
                            <div className={`pb-8 ${idx === service.process.length - 1 ? "pb-0" : ""}`}>
                                <p className="mb-1.5 mt-1.5 text-base font-medium leading-none text-ink">{item.title}</p>
                                <p className="text-sm leading-relaxed text-charcoal">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </section>
    );
}
