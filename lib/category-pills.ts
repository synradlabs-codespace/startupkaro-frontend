import type { ElementType } from "react";
import { Code2, LineChart, PackageCheck, Rocket, ShieldCheck } from "lucide-react";

export const SERVICE_CATEGORIES = ["All", "Start", "Manage", "Protect"] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
export type ServiceStage = Exclude<ServiceCategory, "All">;
export type ServiceVisualCategory = ServiceStage | "Bundles" | "Tech";

export const categoryPillStyles: Record<ServiceCategory, { idle: string; active: string }> = {
    All: {
        idle: "border-hairline bg-canvas text-charcoal hover:border-ink hover:text-ink",
        active: "border-ink bg-ink text-white",
    },
    Start: {
        idle: "border-license-green-border bg-license-green-light text-license-green hover:border-license-green",
        active: "border-license-green bg-license-green text-white",
    },
    Manage: {
        idle: "border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400",
        active: "border-violet-600 bg-violet-600 text-white",
    },
    Protect: {
        idle: "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-400",
        active: "border-rose-600 bg-rose-600 text-white",
    },
};

export const categoryCardStyles: Record<ServiceVisualCategory, {
    iconBg: string;
    iconText: string;
    badge: string;
    strip: string;
}> = {
    Bundles: {
        iconBg: "bg-orange-50",
        iconText: "text-orange-600",
        badge: "border-orange-200 bg-orange-100 text-orange-700",
        strip: "bg-orange-600",
    },
    Start: {
        iconBg: "bg-license-green-light",
        iconText: "text-license-green",
        badge: "border-license-green-border bg-license-green-light text-license-green",
        strip: "bg-license-green",
    },
    Manage: {
        iconBg: "bg-violet-50",
        iconText: "text-violet-600",
        badge: "border-violet-200 bg-violet-100 text-violet-700",
        strip: "bg-violet-600",
    },
    Protect: {
        iconBg: "bg-rose-50",
        iconText: "text-rose-600",
        badge: "border-rose-200 bg-rose-100 text-rose-700",
        strip: "bg-rose-600",
    },
    Tech: {
        iconBg: "bg-fuchsia-50",
        iconText: "text-fuchsia-700",
        badge: "border-fuchsia-200 bg-fuchsia-100 text-fuchsia-800",
        strip: "bg-fuchsia-600",
    },
};

export const serviceCategoryIcons: Record<ServiceVisualCategory, ElementType> = {
    Bundles: PackageCheck,
    Start: Rocket,
    Manage: LineChart,
    Protect: ShieldCheck,
    Tech: Code2,
};

export const fallbackCardStyles = {
    iconBg: "bg-surface",
    iconText: "text-slate",
    badge: "border-hairline bg-surface text-slate",
    strip: "bg-hairline",
};

const START_MATCHERS = [
    "bundle",
    "incorporation",
    "registration",
    "company",
    "llp",
    "partnership",
    "proprietorship",
    "gst registration",
    "udyam",
    "msme",
    "startup india",
    "dpiit",
    "fssai",
    "import export",
    "iec",
    "tan",
    "digital signature",
    "name availability",
    "license",
    "licence",
    "section 8",
    "ngo",
    "one person",
    "public limited",
    "private limited",
];

const PROTECT_MATCHERS = [
    "trademark",
    "renew your trademark",
    "contracts",
    "agreements",
    "investor agreements",
    "reply",
    "notice",
    "ip protection",
    "legal",
    "name change",
];

const MANAGE_MATCHERS = [
    "roc",
    "compliance",
    "bookkeeping",
    "accounting",
    "accounts",
    "dashboard",
    "cash flow",
    "working capital",
    "cost control",
    "audit",
    "structuring",
    "modelling",
    "due diligence",
    "fund",
    "valuation",
    "cfo",
    "international",
    "franchise",
    "investor relations",
    "income tax",
    "itr",
    "tds",
    "tax",
    "consulting",
    "advisory",
    "finalisation",
];

export function inferServiceStage(input: {
    name?: string | null;
    slug?: string | null;
    categorySlug?: string | null;
    categoryName?: string | null;
    isBundle?: boolean | null;
}): ServiceStage {
    if (input.isBundle || input.categorySlug === "bundles") return "Start";

    const haystack = [input.name, input.slug, input.categorySlug, input.categoryName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    if (PROTECT_MATCHERS.some((term) => haystack.includes(term))) return "Protect";
    if (MANAGE_MATCHERS.some((term) => haystack.includes(term))) return "Manage";
    if (START_MATCHERS.some((term) => haystack.includes(term))) return "Start";

    return "Manage";
}
