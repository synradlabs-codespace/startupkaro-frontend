// features/articles/data/category-meta.ts

import { FileText, Building2, Scale, ShieldCheck, Rocket, TrendingUp, LayoutGrid } from "lucide-react";

export const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
    Tax: { icon: FileText, color: "text-violet-600", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700" },
    Business: { icon: Building2, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
    Legal: { icon: Scale, color: "text-rose-600", bg: "bg-rose-50", badge: "bg-rose-100 text-rose-700" },
    Compliance: { icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
    Startup: { icon: Rocket, color: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
    Finance: { icon: TrendingUp, color: "text-cyan-600", bg: "bg-cyan-50", badge: "bg-cyan-100 text-cyan-700" },
};

export const fallbackMeta = {
    icon: LayoutGrid,
    color: "text-gray-600",
    bg: "bg-gray-100",
    badge: "bg-gray-100 text-gray-600",
};
