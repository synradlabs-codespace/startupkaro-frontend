// components/custom/TablePagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
}

export function TablePagination({ total, page, pageSize, onPageChange, onPageSizeChange }: TablePaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
            <p className="text-sm text-muted-foreground">
                {total === 0 ? "No results" : (
                    <>Showing <span className="font-medium text-foreground">{from}–{to}</span> of <span className="font-medium text-foreground">{total}</span></>
                )}
            </p>
            <div className="flex items-center gap-2">
                {onPageSizeChange && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">Rows</span>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(v) => { onPageSizeChange(Number(v)); onPageChange(1); }}
                        >
                            <SelectTrigger className="h-7 w-[60px] text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50].map((s) => (
                                    <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-xs text-muted-foreground px-2 min-w-[60px] text-center">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
