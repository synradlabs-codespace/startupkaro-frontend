export const SERVICE_CATEGORIES = ["All", "Tax", "Business", "Legal", "License"] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const categoryPillStyles: Record<ServiceCategory, { idle: string; active: string }> = {
    All: {
        idle: "border-hairline bg-canvas text-charcoal hover:border-ink hover:text-ink",
        active: "border-ink bg-ink text-white",
    },
    Tax: {
        idle: "border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400",
        active: "border-violet-600 bg-violet-600 text-white",
    },
    Business: {
        idle: "border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-400",
        active: "border-orange-600 bg-orange-600 text-white",
    },
    Legal: {
        idle: "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-400",
        active: "border-rose-600 bg-rose-600 text-white",
    },
    License: {
        idle: "border-teal-200 bg-teal-50 text-teal-700 hover:border-teal-400",
        active: "border-teal-600 bg-teal-600 text-white",
    },
};

export const categoryCardStyles: Record<Exclude<ServiceCategory, "All">, {
    iconBg: string;
    iconText: string;
    badge: string;
    strip: string;
}> = {
    Tax: {
        iconBg: "bg-violet-50",
        iconText: "text-violet-600",
        badge: "border-violet-200 bg-violet-100 text-violet-700",
        strip: "bg-violet-600",
    },
    Business: {
        iconBg: "bg-orange-50",
        iconText: "text-orange-600",
        badge: "border-orange-200 bg-orange-100 text-orange-700",
        strip: "bg-orange-600",
    },
    Legal: {
        iconBg: "bg-rose-50",
        iconText: "text-rose-600",
        badge: "border-rose-200 bg-rose-100 text-rose-700",
        strip: "bg-rose-600",
    },
    License: {
        iconBg: "bg-teal-50",
        iconText: "text-teal-600",
        badge: "border-teal-200 bg-teal-100 text-teal-700",
        strip: "bg-teal-600",
    },
};

export const fallbackCardStyles = {
    iconBg: "bg-surface",
    iconText: "text-slate",
    badge: "border-hairline bg-surface text-slate",
    strip: "bg-hairline",
};
