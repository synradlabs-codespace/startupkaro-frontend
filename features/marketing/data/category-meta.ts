// features/marketing/data/category-meta.ts
// Shared category → icon/color mapping used by marketing pages.

import { FileText, Building2, Scale, FileCheck, LayoutGrid } from "lucide-react";

export const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
    Tax: { icon: FileText, color: "text-violet-600", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700" },
    Business: { icon: Building2, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
    Legal: { icon: Scale, color: "text-rose-600", bg: "bg-rose-50", badge: "bg-rose-100 text-rose-700" },
    License: { icon: FileCheck, color: "text-teal-600", bg: "bg-teal-50", badge: "bg-teal-100 text-teal-700" },
};

export const fallbackMeta = {
    icon: LayoutGrid,
    color: "text-gray-600",
    bg: "bg-gray-100",
    badge: "bg-gray-100 text-gray-600",
};
