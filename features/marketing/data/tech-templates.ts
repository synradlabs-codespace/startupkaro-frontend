export type TechTemplate = {
    name: string;
    slug: string;
    type: string;
    audience: string;
    description: string;
    rationale: string;
    snapshot: string[];
    sections: string[];
    accentClass: string;
    image: string;
    imageAlt: string;
};

export const techTemplates: TechTemplate[] = [
    {
        name: "Launch",
        slug: "launch",
        type: "SaaS / service launch",
        audience: "Founders launching a SaaS, service platform, productivity tool, B2B product, or any offer that needs to explain value and capture signups fast.",
        description: "A conversion-led launch page with a bold hero, dashboard-style product preview, feature cards, pricing, testimonials, and FAQ blocks.",
        rationale: "The preview is designed around a clear SaaS-style promise: communicate the outcome first, show the product through an analytics/dashboard mockup, then reduce buyer hesitation with benefits, pricing, founder trust, testimonials, and quick answers. It works well when the visitor needs to understand the product before booking a demo, joining a waitlist, or starting a trial.",
        snapshot: ["Large outcome-led hero", "Dashboard product preview", "Feature grid and trust strip", "Pricing cards", "Testimonials and FAQ"],
        sections: ["Hero", "Product preview", "Trust strip", "Features", "Pricing", "Testimonials", "FAQs"],
        accentClass: "bg-primary-brand",
        image: "/assets/tech-templates/launch-template.png",
        imageAlt: "Launch SaaS landing page template preview",
    },
    {
        name: "Storefront",
        slug: "storefront",
        type: "E-commerce starter",
        audience: "Consumer brands, D2C sellers, boutique stores, home and lifestyle shops, gift sellers, and early e-commerce founders who want to showcase products before scaling into a larger store.",
        description: "A product-first storefront page with shopping navigation, category blocks, featured product cards, offer banner, trust badges, reviews, and an inquiry section.",
        rationale: "The preview is built like a real starter commerce page: the top makes the product category instantly visible, the middle helps users browse by category and featured products, and the lower sections add offer urgency, delivery/payment trust, reviews, and a simple enquiry path. It is best for founders who need product discovery and lead generation before a fully custom checkout stack.",
        snapshot: ["Product-focused hero", "Shop-by-category grid", "Featured product cards", "Promotional offer band", "Reviews and inquiry CTA"],
        sections: ["Hero", "Categories", "Featured products", "Offer banner", "Trust badges", "Reviews", "Inquiry form"],
        accentClass: "bg-storm-deep",
        image: "/assets/tech-templates/storefront-template.png",
        imageAlt: "Storefront e-commerce landing page template preview",
    },
    {
        name: "Local Pro",
        slug: "local-pro",
        type: "Service business",
        audience: "Clinics, salons, consultants, repair services, agencies, restaurants, studios, home-service teams, and any local business where trust and booking speed matter.",
        description: "A service-business page with verified-trust messaging, appointment CTAs, service categories, process steps, gallery, reviews, FAQs, and a booking band.",
        rationale: "The preview is built for businesses where customers need confidence before they call or book. It opens with credibility cues, shows the service environment, explains guarantees, lays out service categories, and then moves through process, proof, FAQ, and booking. The structure is meant to make a local business feel reliable, organized, and easy to contact.",
        snapshot: ["Trust-led hero with booking CTA", "Guarantee and credibility strip", "Service category grid", "Process timeline", "Gallery, reviews, FAQ, and booking band"],
        sections: ["Hero", "Trust badges", "Services", "Process", "Gallery", "Reviews", "FAQs", "Booking CTA"],
        accentClass: "bg-bloom-coral",
        image: "/assets/tech-templates/local-pro-template.png",
        imageAlt: "Local Pro service business landing page template preview",
    },
];

export function getTechTemplateBySlug(slug: string) {
    return techTemplates.find((template) => template.slug === slug);
}
