// features/marketing/data/category-meta.ts
// Shared category → icon/color mapping used by marketing pages.

import { FileText, Building2, Scale, FileCheck, LayoutGrid } from "lucide-react";

export const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
    Tax:      { icon: FileText,   color: "text-violet-600", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700" },
    Business: { icon: Building2,  color: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
    Legal:    { icon: Scale,      color: "text-rose-600",   bg: "bg-rose-50",   badge: "bg-rose-100 text-rose-700"     },
    License:  { icon: FileCheck,  color: "text-teal-600",   bg: "bg-teal-50",   badge: "bg-teal-100 text-teal-700"     },
};

export const fallbackMeta = {
    icon: LayoutGrid,
    color: "text-slate",
    bg: "bg-surface",
    badge: "bg-surface text-slate",
};
