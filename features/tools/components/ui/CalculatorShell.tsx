// Two-panel calculator layout: inputs on the left, results on the right.
// Server-safe (no hooks) so calculators can compose it freely.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CalculatorShell({ inputs, results, below }: { inputs: ReactNode; results: ReactNode; below?: ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="space-y-6 rounded-2xl border border-hairline bg-canvas p-5 sm:p-7">{inputs}</div>
                <div className="space-y-6 rounded-2xl border border-hairline bg-surface p-5 sm:p-7">{results}</div>
            </div>
            {below}
        </div>
    );
}

export function StatTile({ label, value, emphasis = false, note }: { label: string; value: string; emphasis?: boolean; note?: string }) {
    return (
        <div className={cn("rounded-xl border p-4", emphasis ? "border-primary-brand/30 bg-tint-sky/40" : "border-hairline bg-canvas")}>
            <p className="text-xs font-medium uppercase tracking-[0.5px] text-slate">{label}</p>
            <p className={cn("mt-1.5 font-display font-medium text-ink", emphasis ? "text-2xl sm:text-3xl" : "text-xl")}>{value}</p>
            {note && <p className="mt-1 text-xs text-slate">{note}</p>}
        </div>
    );
}

export function ResultRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
    return (
        <div className={cn("flex items-center justify-between gap-4 py-2 text-sm", strong ? "font-semibold text-ink" : "text-charcoal")}>
            <span>{label}</span>
            <span className="text-right tabular-nums">{value}</span>
        </div>
    );
}
