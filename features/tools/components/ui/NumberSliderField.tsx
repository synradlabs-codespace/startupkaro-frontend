"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/features/tools/lib/format";

type Unit = "currency" | "percent" | "years" | "months" | "none";

interface NumberSliderFieldProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    /** Slider upper bound when the input itself accepts a larger value. */
    sliderMax?: number;
    unit?: Unit;
    hint?: string;
    /** Hide the range slider (for free-entry fields such as deductions). */
    hideSlider?: boolean;
}

const suffixFor: Record<Unit, string | null> = { currency: null, percent: "%", years: "yrs", months: "mo", none: null };

function display(value: number, unit: Unit): string {
    if (unit === "currency" || unit === "none") return formatNumber(value);
    return String(value);
}

function parse(raw: string): number {
    const cleaned = raw.replace(/[^\d.]/g, "");
    return cleaned === "" ? NaN : Number(cleaned);
}

export function NumberSliderField({
    label,
    value,
    onChange,
    min,
    max,
    step,
    sliderMax,
    unit = "none",
    hint,
    hideSlider = false,
}: NumberSliderFieldProps) {
    const id = useId();
    const [draft, setDraft] = useState<string | null>(null);
    const rangeMax = sliderMax ?? max;
    const rangeValue = Math.min(value, rangeMax);
    const pct = rangeMax > min ? ((rangeValue - min) / (rangeMax - min)) * 100 : 0;
    const suffix = suffixFor[unit];

    const commit = (n: number) => {
        if (!Number.isFinite(n)) return;
        onChange(Math.min(max, Math.max(min, n)));
    };

    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
                <label htmlFor={id} className="text-sm font-medium text-charcoal">
                    {label}
                </label>
                <div className="flex h-9 w-40 items-center rounded-md border border-hairline-strong bg-canvas px-2.5 focus-within:border-primary-brand focus-within:ring-2 focus-within:ring-primary-brand/20 sm:w-44">
                    {unit === "currency" && <span className="mr-1 text-sm text-slate">₹</span>}
                    <input
                        id={id}
                        inputMode="decimal"
                        autoComplete="off"
                        className="w-full min-w-0 bg-transparent text-right text-sm font-semibold text-ink outline-none"
                        value={draft ?? display(value, unit)}
                        onFocus={() => setDraft(String(value))}
                        onChange={(event) => {
                            setDraft(event.target.value);
                            const n = parse(event.target.value);
                            if (Number.isFinite(n) && n >= min && n <= max) onChange(n);
                        }}
                        onBlur={() => {
                            if (draft !== null) commit(parse(draft));
                            setDraft(null);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") (event.target as HTMLInputElement).blur();
                        }}
                    />
                    {suffix && <span className="ml-1 text-xs text-slate">{suffix}</span>}
                </div>
            </div>
            {!hideSlider && (
                <input
                    type="range"
                    aria-label={label}
                    min={min}
                    max={rangeMax}
                    step={step}
                    value={rangeValue}
                    onChange={(event) => onChange(Number(event.target.value))}
                    className={cn("tool-range h-1.5 w-full cursor-pointer appearance-none rounded-full")}
                    style={{ background: `linear-gradient(to right, #296ef9 ${pct}%, #e8e8e8 ${pct}%)` }}
                />
            )}
            {hint && <p className="text-xs text-slate">{hint}</p>}
        </div>
    );
}
