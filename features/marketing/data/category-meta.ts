import { LayoutGrid, LineChart, Rocket, ShieldCheck } from "lucide-react";

export const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
    Bundles: { icon: Rocket, color: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
    Start: { icon: Rocket, color: "text-license-green", bg: "bg-license-green-light", badge: "bg-license-green-light text-license-green" },
    Manage: { icon: LineChart, color: "text-violet-600", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700" },
    Protect: { icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-50", badge: "bg-rose-100 text-rose-700" },
};

export const fallbackMeta = {
    icon: LayoutGrid,
    color: "text-slate",
    bg: "bg-surface",
    badge: "bg-surface text-slate",
};
