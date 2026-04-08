// features/marketing/components/sections/ServiceProcess.tsx

import type { Service } from "@/features/marketing/data/types";

export function ServiceProcess({ service }: { service: Service }) {
    return (
        <section className="py-10 border-b border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-8">How we process your request</h2>
                <div className="max-w-2xl space-y-0">
                    {service.process.map((item, idx) => (
                        <div key={item.step} className="flex gap-4">
                            {/* Step indicator + connector */}
                            <div className="flex flex-col items-center">
                                <div className="h-8 w-8 rounded-full bg-[#FF9933] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                    {item.step}
                                </div>
                                {idx < service.process.length - 1 && (
                                    <div className="w-px flex-1 bg-[#FF9933]/20 my-2" />
                                )}
                            </div>
                            {/* Content */}
                            <div className={`pb-8 ${idx === service.process.length - 1 ? "pb-0" : ""}`}>
                                <p className="text-sm font-semibold text-gray-900 leading-none mt-1.5 mb-1.5">{item.title}</p>
                                <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
