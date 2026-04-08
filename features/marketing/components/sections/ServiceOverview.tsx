// features/marketing/components/sections/ServiceOverview.tsx

import type { Service } from "@/features/marketing/data/types";

export function ServiceOverview({ service }: { service: Service }) {
    return (
        <section className="py-10 border-b border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.overview}</p>
                </div>
            </div>
        </section>
    );
}
