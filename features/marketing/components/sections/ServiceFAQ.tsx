// features/marketing/components/sections/ServiceFAQ.tsx

import { UniqueAccordion } from "@/components/ui/unique-accordion";
import type { Service } from "@/features/marketing/data/types";

export function ServiceFAQ({ service }: { service: Service }) {
    const items = service.faqs.map((faq, idx) => ({
        id: String(idx),
        number: String(idx + 1).padStart(2, "0"),
        title: faq.question,
        content: faq.answer,
    }));

    return (
        <section className="bg-canvas py-14 md:py-18">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
                    <div className="lg:pt-2">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Questions</p>
                        <h2 className="font-display text-3xl font-medium text-ink md:text-4xl">Frequently asked questions</h2>
                    </div>
                    <UniqueAccordion items={items} defaultOpenId="0" />
                </div>
            </div>
        </section>
    );
}
