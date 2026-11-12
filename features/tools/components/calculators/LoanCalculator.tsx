"use client";

// One component for the EMI, Home Loan and Car Loan tools. `variant` picks
// the fields and the extras (prepayment for home loans, down payment for cars).

import { useMemo } from "react";
import {
    CAR_LOAN_FIELDS,
    EMI_FIELDS,
    HOME_LOAN_FIELDS,
    TOOL_ENGINES,
    carLoanFromInputs,
    emiFromInputs,
    homeLoanFromInputs,
} from "@/features/tools/lib/engines";
import type { FieldSpec, NumberFieldSpec, ToolInputs } from "@/features/tools/lib/params";
import { formatINR, formatINRCompact, formatTenure } from "@/features/tools/lib/format";
import { useToolInputs } from "@/features/tools/hooks/useToolInputs";
import { NumberSliderField } from "../ui/NumberSliderField";
import { CalculatorShell, ResultRow, StatTile } from "../ui/CalculatorShell";
import { BreakdownDonut, GrowthChart, TOOL_COLORS } from "../ui/charts";
import { AmortisationTable } from "../ui/AmortisationTable";
import { ShareResultBar } from "../ui/ShareResultBar";
import type { CalculatorProps } from "./types";

type Variant = "emi" | "home" | "car";

const FIELDS: Record<Variant, readonly FieldSpec[]> = { emi: EMI_FIELDS, home: HOME_LOAN_FIELDS, car: CAR_LOAN_FIELDS };

const SLIDER_MAX: Record<string, number> = { p: 20_000_000, c: 5_000_000, d: 3_000_000, pa: 2_000_000 };

export function LoanCalculator({ slug, name, category, initial, variant }: CalculatorProps & { variant: Variant }) {
    const fields = FIELDS[variant];
    const { inputs, setField, query } = useToolInputs<ToolInputs>(fields, initial, { slug, category });
    const spec = (key: string) => fields.find((f) => f.key === key) as NumberFieldSpec;
    const num = (key: string) => Number(inputs[key]);

    const result = useMemo(() => {
        if (variant === "home") return { ...homeLoanFromInputs(inputs), price: 0, down: 0 };
        if (variant === "car") return carLoanFromInputs(inputs);
        return { ...emiFromInputs(inputs), price: 0, down: 0 };
    }, [inputs, variant]);

    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = (key: string, label: string, unit: "currency" | "percent" | "years", hint?: string) => {
        const s = spec(key);
        return (
            <NumberSliderField
                key={key}
                label={label}
                unit={unit}
                min={s.min}
                max={s.max}
                step={s.step}
                sliderMax={SLIDER_MAX[key]}
                value={num(key)}
                onChange={(v) => setField(key, v)}
                hint={hint}
            />
        );
    };

    return (
        <CalculatorShell
            inputs={
                <>
                    {variant === "car" ? (
                        <>
                            {field("c", "On-road price", "currency")}
                            {field("d", "Down payment", "currency", `Loan amount: ${formatINR(result.principal)}`)}
                        </>
                    ) : (
                        field("p", variant === "home" ? "Home loan amount" : "Loan amount", "currency")
                    )}
                    {field("r", "Interest rate (p.a.)", "percent")}
                    {field("y", "Loan tenure", "years")}
                    {variant === "home" &&
                        field("pa", "Yearly prepayment", "currency", "Extra amount you pay at the end of every year. Set to 0 to skip.")}
                </>
            }
            results={
                <>
                    <StatTile label="Monthly EMI" value={formatINR(result.emi)} emphasis />
                    <div className="grid grid-cols-2 gap-3">
                        <StatTile label="Total interest" value={formatINRCompact(result.totalInterest)} />
                        <StatTile label="Total payment" value={formatINRCompact(result.totalPayment)} />
                    </div>
                    {variant === "home" && result.interestSaved > 0 && (
                        <div className="rounded-xl border border-status-positive-fg/20 bg-canvas p-4 text-sm text-charcoal">
                            Prepaying saves <strong className="text-ink">{formatINRCompact(result.interestSaved)}</strong> in interest and closes the loan{" "}
                            <strong className="text-ink">{formatTenure(result.monthsSaved)}</strong> early, in {formatTenure(result.months)}.
                        </div>
                    )}
                    {variant === "car" && (
                        <div className="rounded-xl border border-hairline bg-canvas px-4 py-2">
                            <ResultRow label="On-road price" value={formatINR(result.price)} />
                            <ResultRow label="Down payment" value={formatINR(result.down)} />
                            <ResultRow label="Loan amount" value={formatINR(result.principal)} />
                            <ResultRow label="Total cost of car" value={formatINR(result.down + result.totalPayment)} strong />
                        </div>
                    )}
                    <BreakdownDonut
                        data={[
                            { name: "Principal", value: result.principal, color: TOOL_COLORS.primary },
                            { name: "Interest", value: result.totalInterest, color: TOOL_COLORS.secondary },
                        ]}
                    />
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
            below={
                <>
                    <div className="rounded-2xl border border-hairline bg-canvas p-5 sm:p-7">
                        <h3 className="font-display text-xl font-medium text-ink">Outstanding balance</h3>
                        <div className="mt-4">
                            <GrowthChart
                                data={result.schedule.map((row) => ({ label: `Yr ${row.year}`, balance: Math.round(row.closingBalance) }))}
                                series={[{ key: "balance", label: "Balance", color: TOOL_COLORS.primary }]}
                            />
                        </div>
                    </div>
                    <AmortisationTable rows={result.schedule} showPrepaid={variant === "home" && num("pa") > 0} />
                </>
            }
        />
    );
}
