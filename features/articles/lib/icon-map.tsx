import {
    FileText,
    Scale,
    ShieldCheck,
    Rocket,
    TrendingUp,
    Building2,
    Briefcase,
    Globe,
    Lightbulb,
    LayoutGrid,
    type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
    FileText,
    Scale,
    ShieldCheck,
    Rocket,
    TrendingUp,
    Building2,
    Briefcase,
    Globe,
    Lightbulb,
    LayoutGrid,
};

export function getIcon(iconName?: string): LucideIcon {
    if (iconName && iconName in ICON_MAP) return ICON_MAP[iconName];
    return LayoutGrid;
}
