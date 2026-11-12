"use client";

import { cn } from "@/lib/utils";

interface SegmentedFieldProps<T extends string> {
    label: string;
    value: T;
    options: readonly { value: T; label: string }[];
    onChange: (value: T) => void;
}

export function SegmentedField<T extends string>({ label, value, options, onChange }: SegmentedFieldProps<T>) {
    return (
        <div className="space-y-2.5">
            <p className="text-sm font-medium text-charcoal">{label}</p>
            <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const active = option.value === value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => onChange(option.value)}
                            className={cn(
                                "h-9 rounded-md border px-3.5 text-xs font-semibold uppercase tracking-[0.5px] transition-colors",
                                active
                                    ? "border-primary-brand bg-primary-brand text-white"
                                    : "border-hairline-strong bg-canvas text-charcoal hover:border-ink hover:text-ink"
                            )}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
