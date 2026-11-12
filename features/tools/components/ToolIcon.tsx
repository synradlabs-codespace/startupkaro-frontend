import { AlarmClock, Blocks, Briefcase, CalendarClock, ChartCandlestick, ChartLine, Repeat, Sunset, BadgePercent, Building2, Car, Calculator, Coins, Gift, Home, Landmark, Percent, PieChart, PiggyBank, ReceiptIndianRupee, Scale, ShieldCheck, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import type { ToolCategory } from "@/features/tools/types";

const SLUG_ICONS: Record<string, LucideIcon> = {
    "income-tax-calculator": ReceiptIndianRupee,
    "sip-calculator": TrendingUp,
    "emi-calculator": Landmark,
    "gst-calculator": Percent,
    "home-loan-emi-calculator": Home,
    "car-loan-emi-calculator": Car,
    "salary-calculator": Wallet,
    "lumpsum-calculator": Coins,
    "fd-calculator": PiggyBank,
    "ppf-calculator": ShieldCheck,
    "hra-calculator": Building2,
    "gratuity-calculator": Gift,
    "tds-calculator": BadgePercent,
    "break-even-calculator": Scale,
    "equity-dilution-calculator": PieChart,
    "business-structure-calculator": Blocks,
    "presumptive-tax-calculator": Briefcase,
    "advance-tax-calculator": CalendarClock,
    "gst-late-fee-calculator": AlarmClock,
    "capital-gains-tax-calculator": ChartCandlestick,
    "nps-calculator": Sunset,
    "rd-calculator": Repeat,
    "cagr-calculator": ChartLine,
};

export const CATEGORY_STYLES: Record<ToolCategory, { chip: string; iconBg: string; iconFg: string }> = {
    Tax: { chip: "bg-tint-peach text-ink", iconBg: "bg-tint-peach", iconFg: "text-bloom-coral" },
    Investment: { chip: "bg-tint-sky text-ink", iconBg: "bg-tint-sky", iconFg: "text-primary-brand" },
    Loans: { chip: "bg-surface text-ink", iconBg: "bg-surface", iconFg: "text-storm-deep" },
    Payroll: { chip: "bg-tint-sky/60 text-ink", iconBg: "bg-tint-sky/60", iconFg: "text-storm-deep" },
    Business: { chip: "bg-ink text-white", iconBg: "bg-surface", iconFg: "text-ink" },
};

export function ToolIcon({ slug, category, className }: { slug: string; category: ToolCategory; className?: string }) {
    const Icon = SLUG_ICONS[slug] ?? Calculator;
    const style = CATEGORY_STYLES[category];
    return (
        <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg} ${className ?? ""}`}>
            <Icon className={`h-5 w-5 ${style.iconFg}`} />
        </span>
    );
}
