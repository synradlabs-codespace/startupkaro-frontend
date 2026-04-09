// features/admin/components/AdminInquiriesPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InquiryStatusBadge } from "@/components/custom/StatusBadge";
import { mockInquiries } from "@/lib/mock-data";
import { Search, Eye, Trash2 } from "lucide-react";

const PAGE_SIZE = 10;

export function AdminInquiriesPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [inquiries, setInquiries] = useState(mockInquiries);

    const filtered = inquiries.filter((i) => {
        const matchSearch =
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.email.toLowerCase().includes(search.toLowerCase()) ||
            i.message.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || i.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleDelete = (id: string) => {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
    };

    const handleFilterChange = (value: string) => {
        setStatusFilter(value ?? "all");
        setPage(1);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div>
            <PageHeader title="Inquiries" description={`${inquiries.length} inquiries received`} />
            <div className="p-6 space-y-4">
                <div className="flex gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or message..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="unresolved">Unresolved</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-muted/50">
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Name</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Email</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Mobile</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Message</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Status</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Date</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70 uppercase text-xs tracking-wide">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                                            No inquiries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((inq) => (
                                        <TableRow key={inq.id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">{inq.name}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{inq.email}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{inq.mobile}</TableCell>
                                            <TableCell className="max-w-xs">
                                                <p className="text-sm text-muted-foreground truncate">{inq.message}</p>
                                            </TableCell>
                                            <TableCell><InquiryStatusBadge status={inq.status} /></TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{inq.date}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Link href={`/admin/inquiries/${inq.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[var(--color-green)]/10 hover:text-[var(--color-green)]">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(inq.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            total={filtered.length}
                            page={page}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
