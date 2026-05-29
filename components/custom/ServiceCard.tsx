import Link from "next/link";
import { Clock, ArrowRight, FileText, Building2, Scale, FileCheck, LayoutGrid } from "lucide-react";
import { categoryCardStyles, fallbackCardStyles } from "@/lib/category-pills";
import { formatINR } from "@/lib/currency";

const categoryIcons: Record<string, React.ElementType> = {
    Tax: FileText,
    Business: Building2,
    Legal: Scale,
    License: FileCheck,
};

export interface ServiceCardProps {
    name: string;
    description: string;
    category: string;
    price: number;
    priceInPaise?: boolean;
    duration: string;
    href: string;
}

export function ServiceCard({ name, description, category, price, priceInPaise = false, duration, href }: ServiceCardProps) {
    const styles = categoryCardStyles[category as keyof typeof categoryCardStyles] ?? fallbackCardStyles;
    const Icon = categoryIcons[category] ?? LayoutGrid;
    const formattedPrice = priceInPaise ? formatINR(price) : formatINR(price * 100);

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-canvas transition-all duration-200 hover:-translate-y-0.5 hover:border-hairline-strong">
            <div className={`h-1 w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${styles.strip}`} />

            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.iconBg}`}>
                        <Icon className={`h-5 w-5 ${styles.iconText}`} />
                    </div>
                    <span className={`rounded-md border px-2.5 py-1 text-xs font-medium uppercase tracking-[0.28px] ${styles.badge}`}>
                        {category}
                    </span>
                </div>

                <h3 className="mb-1.5 font-display text-xl font-medium leading-snug text-ink">{name}</h3>
                <p className="flex-1 text-sm leading-relaxed text-charcoal">{description}</p>

                <div className="h-px bg-hairline my-4" />

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-display text-2xl font-medium text-ink">
                            {formattedPrice}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-graphite">
                            <Clock className="h-3 w-3" />
                            {duration}
                        </p>
                    </div>
                    <Link
                        href={href}
                        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-primary-brand px-3 text-xs font-medium text-white transition-colors hover:bg-primary-deep"
                    >
                        Learn More
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
