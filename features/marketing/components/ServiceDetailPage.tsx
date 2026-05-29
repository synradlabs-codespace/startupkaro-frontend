// features/marketing/components/ServiceDetailPage.tsx

import { ServiceHero } from "./sections/ServiceHero";
import { ServicePricingCTA } from "./sections/ServicePricingCTA";
import { ServiceEditorial } from "@/features/services/components/ServiceEditorial";
import type { EnrichedService } from "@/features/services/lib/merge";

export function ServiceDetailPage({ service }: { service: EnrichedService }) {
    return (
        <main className="bg-canvas">
            <ServiceHero service={service} />
            {service.content && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                    <ServiceEditorial content={service.content} />
                </div>
            )}
            <ServicePricingCTA service={service} />
        </main>
    );
}
