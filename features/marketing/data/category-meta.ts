// features/marketing/data/category-meta.ts
// Shared category → icon/color mapping used by marketing pages.

import { FileText, Building2, Scale, FileCheck, LayoutGrid } from "lucide-react";

export const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
    Tax: { icon: FileText, color: "text-primary-brand", bg: "bg-primary-soft", badge: "bg-primary-soft text-ink" },
    Business: { icon: Building2, color: "text-primary-brand", bg: "bg-primary-soft", badge: "bg-primary-soft text-ink" },
    Legal: { icon: Scale, color: "text-primary-brand", bg: "bg-primary-soft", badge: "bg-primary-soft text-ink" },
    License: { icon: FileCheck, color: "text-primary-brand", bg: "bg-primary-soft", badge: "bg-primary-soft text-ink" },
};

export const fallbackMeta = {
    icon: LayoutGrid,
    color: "text-slate",
    bg: "bg-primary-soft",
    badge: "bg-primary-soft text-slate",
};
