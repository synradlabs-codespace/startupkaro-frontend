// features/marketing/components/sections/ServiceProcess.tsx

import type { Service } from "@/features/marketing/data/types";

export function ServiceProcess({ service }: { service: Service }) {
    return (
        <section className="py-10 border-b border-hairline">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-display font-normal tracking-tight text-ink mb-8">How we process your request</h2>
                <div className="max-w-2xl space-y-0">
                    {service.process.map((item, idx) => (
                        <div key={item.step} className="flex gap-4">
                            {/* Step indicator + connector */}
                            <div className="flex flex-col items-center">
                                <div className="h-8 w-8 rounded-full bg-coral text-white font-mono text-xs flex items-center justify-center shrink-0">
                                    {item.step}
                                </div>
                                {idx < service.process.length - 1 && (
                                    <div className="w-px flex-1 bg-coral/20 my-2" />
                                )}
                            </div>
                            {/* Content */}
                            <div className={`pb-8 ${idx === service.process.length - 1 ? "pb-0" : ""}`}>
                                <p className="font-sans text-base text-ink leading-none mt-1.5 mb-1.5">{item.title}</p>
                                <p className="font-sans text-base text-body-muted leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
