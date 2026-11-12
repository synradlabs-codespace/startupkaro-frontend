"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { YearRow } from "@/features/tools/lib/calculators/emi";
import { formatINR } from "@/features/tools/lib/format";
import { cn } from "@/lib/utils";

export function AmortisationTable({ rows, showPrepaid = false }: { rows: YearRow[]; showPrepaid?: boolean }) {
    const [open, setOpen] = useState(false);
    const visible = open ? rows : rows.slice(0, 5);

    return (
        <div className="rounded-2xl border border-hairline bg-canvas p-5 sm:p-7">
            <h3 className="font-display text-xl font-medium text-ink">Year-wise repayment schedule</h3>
            <div className="mt-4 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Year</TableHead>
                            <TableHead className="text-right">Principal</TableHead>
                            <TableHead className="text-right">Interest</TableHead>
                            {showPrepaid && <TableHead className="text-right">Prepaid</TableHead>}
                            <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visible.map((row) => (
                            <TableRow key={row.year}>
                                <TableCell>{row.year}</TableCell>
                                <TableCell className="text-right tabular-nums">{formatINR(row.principalPaid)}</TableCell>
                                <TableCell className="text-right tabular-nums">{formatINR(row.interestPaid)}</TableCell>
                                {showPrepaid && <TableCell className="text-right tabular-nums">{formatINR(row.prepaid)}</TableCell>}
                                <TableCell className="text-right tabular-nums">{formatINR(row.closingBalance)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {rows.length > 5 && (
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.5px] text-primary-brand"
                >
                    {open ? "Show less" : `Show all ${rows.length} years`}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                </button>
            )}
        </div>
    );
}
