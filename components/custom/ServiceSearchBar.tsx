"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ServiceSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function ServiceSearchBar({
    value,
    onChange,
    placeholder = "Search for GST registration, Private Limited Company, Trademark, Consulting Service…",
    className,
}: ServiceSearchBarProps) {
    return (
        <div className={`relative ${className ?? ""}`}>
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite" />
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label="Search services"
                className="h-14 w-full rounded-2xl border-hairline-strong bg-canvas pl-12 pr-12 text-base shadow-[0_2px_16px_rgba(26,26,26,0.06)] transition-all duration-200 focus-visible:border-primary-brand focus-visible:shadow-[0_4px_24px_rgba(41,110,249,0.14)] focus-visible:ring-primary-brand/15"
            />
            {value && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => onChange("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-graphite transition-colors hover:bg-surface hover:text-ink"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
