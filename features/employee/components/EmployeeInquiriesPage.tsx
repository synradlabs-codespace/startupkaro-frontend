"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InquiryStatusBadge, formatInquiryStatus } from "@/components/custom/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInquiryList } from "@/features/admin/hooks/useAdminInquiries";
import { formatDate } from "@/features/admin/lib/format";
import { Search, Eye } from "lucide-react";

const PAGE_SIZE = 10;

export function EmployeeInquiriesPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const inquiriesQuery = useInquiryList({
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        page,
        limit: pageSize,
    });

    const inquiries = inquiriesQuery.data?.data ?? [];
    const total = inquiriesQuery.data?.pagination.total ?? 0;

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleFilterChange = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };

    return (
        <div>
            <PageHeader title="Inquiries" description={`${total} inquiries received`} />
            <div className="p-6 space-y-4">
                <div className="flex gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-50">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                        <Input
                            placeholder="Search by name, email, or message..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue>{statusFilter === "all" ? "All Statuses" : formatInquiryStatus(statusFilter)}</SelectValue>
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
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Name</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Email</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Phone</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Subject</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Status</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Date</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70 uppercase text-xs tracking-wide">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inquiriesQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate py-12">
                                            Loading inquiries...
                                        </TableCell>
                                    </TableRow>
                                ) : inquiriesQuery.isError ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-error-brand py-12">
                                            Failed to load inquiries
                                        </TableCell>
                                    </TableRow>
                                ) : inquiries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate py-12">
                                            No inquiries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    inquiries.map((inq) => (
                                        <TableRow key={inq.id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">{inq.name}</TableCell>
                                            <TableCell className="text-slate text-sm">{inq.email}</TableCell>
                                            <TableCell className="text-slate text-sm">{inq.phone || "—"}</TableCell>
                                            <TableCell className="max-w-xs">
                                                <p className="text-sm text-slate truncate">{inq.subject}</p>
                                            </TableCell>
                                            <TableCell><InquiryStatusBadge status={inq.status ?? "unresolved"} /></TableCell>
                                            <TableCell className="text-slate text-sm">{formatDate(inq.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/employee/inquiries/${inq.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-brand/10 hover:text-charcoal">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            total={total}
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
