"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActiveBadge } from "@/components/custom/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteService, useServiceList, useServiceContentSlugs } from "@/features/admin/hooks/useAdminServices";
import type { ServiceStatusFilter } from "@/features/admin/hooks/useAdminServices";
import { formatINR } from "@/lib/currency";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { AlertTriangle, CheckCircle2, Eye, ExternalLink, Plus, Search, Trash2 } from "lucide-react";

const PAGE_SIZE = 50;

export function AdminServicesPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebouncedValue(search);
    const [status, setStatus] = useState<ServiceStatusFilter>("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const servicesQuery = useServiceList({ search: debouncedSearch || undefined, status, page, limit: pageSize });
    const contentSlugsQuery = useServiceContentSlugs();
    const services = servicesQuery.data?.data ?? [];
    const total = servicesQuery.data?.pagination.total ?? 0;
    const contentSlugs = contentSlugsQuery.data ?? new Set<string>();

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatusChange = (value: ServiceStatusFilter | null) => {
        setStatus(value ?? "all");
        setPage(1);
    };

    return (
        <div>
            <PageHeader
                title="Services"
                description={`${total} services`}
                action={
                    <Link href="/admin/services/new">
                        <Button size="sm" className="bg-primary-brand hover:bg-primary-brand/90 text-white uppercase tracking-wide">
                            <Plus className="h-4 w-4 mr-1" /> Add Service
                        </Button>
                    </Link>
                }
            />
            <div className="p-6 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
                        <Input
                            placeholder="Search by service name..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="active">Active only</SelectItem>
                            <SelectItem value="inactive">Inactive only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Name</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Slug</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Category</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Price</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Type</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Active</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">CMS Content</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70 uppercase text-xs tracking-wide">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {servicesQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-slate py-12">
                                            Loading services...
                                        </TableCell>
                                    </TableRow>
                                ) : servicesQuery.isError ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-error-brand py-12">
                                            Failed to load services
                                        </TableCell>
                                    </TableRow>
                                ) : services.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-slate py-12">
                                            No services found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    services.map((service) => {
                                        const hasContent = contentSlugs.has(service.slug);
                                        return (
                                            <TableRow key={service.id} className="hover:bg-muted/30">
                                                <TableCell className="font-medium">{service.name}</TableCell>
                                                <TableCell className="text-slate text-sm font-mono">{service.slug}</TableCell>
                                                <TableCell className="text-slate text-sm">{formatCategory(service.category)}</TableCell>
                                                <TableCell className="font-medium">{service.price != null ? formatINR(service.price) : "On request"}</TableCell>
                                                <TableCell className="text-slate text-sm">{formatType(service.type)}</TableCell>
                                                <TableCell>
                                                    <ActiveBadge isActive={service.isActive} />
                                                </TableCell>
                                                <TableCell>
                                                    {contentSlugsQuery.isLoading ? (
                                                        <span className="text-xs text-slate">Checking...</span>
                                                    ) : hasContent ? (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-status-positive-fg">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Linked
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                                No CMS content
                                                            </span>
                                                            <Link
                                                                href="/studio/intent/create/type=service/"
                                                                target="_blank"
                                                                className="inline-flex items-center gap-1 text-xs text-primary-brand hover:underline"
                                                            >
                                                                Create in Studio
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Link>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <ServiceActions id={service.id} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
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

function formatCategory(category: string) {
    if (category === "start") return "Start";
    if (category === "manage") return "Manage";
    if (category === "protect") return "Protect";
    return category || "Uncategorized";
}

function formatType(type: string) {
    if (type === "fixed") return "Fixed";
    if (type === "quote") return "Quote";
    return type || "Service";
}

function ServiceActions({ id }: { id: string }) {
    const deleteService = useDeleteService(id);

    const handleDelete = async () => {
        if (!window.confirm("Delete this service?")) return;
        await deleteService.mutateAsync().catch(() => undefined);
    };

    return (
        <div className="flex gap-1 justify-end">
            <Link href={`/admin/services/${id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-brand/10 hover:text-charcoal">
                    <Eye className="h-4 w-4" />
                </Button>
            </Link>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-error-brand hover:text-error-brand hover:bg-error-brand/10"
                onClick={handleDelete}
                disabled={deleteService.isPending}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
