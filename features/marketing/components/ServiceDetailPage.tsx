// features/marketing/components/ServiceDetailPage.tsx
// Generic data-driven template — accepts a Service object and renders all sections.

import { ServiceHero } from "./sections/ServiceHero";
import { ServiceOverview } from "./sections/ServiceOverview";
import { ServiceFeatures } from "./sections/ServiceFeatures";
import { ServiceProcess } from "./sections/ServiceProcess";
import { ServicePricingCTA } from "./sections/ServicePricingCTA";
import { ServiceFAQ } from "./sections/ServiceFAQ";
import type { Service } from "@/features/marketing/data/types";

export function ServiceDetailPage({ service }: { service: Service }) {
    return (
        <>
            <ServiceHero service={service} />
            <ServiceOverview service={service} />
            <ServiceFeatures service={service} />
            <ServiceProcess service={service} />
            <ServicePricingCTA service={service} />
            <ServiceFAQ service={service} />
        </>
    );
}
