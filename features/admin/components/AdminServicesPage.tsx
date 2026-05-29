"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActiveBadge } from "@/components/custom/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteService, useServiceList } from "@/features/admin/hooks/useAdminServices";
import { formatINR } from "@/lib/currency";
import { Eye, Plus, Trash2 } from "lucide-react";

const PAGE_SIZE = 10;

export function AdminServicesPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const servicesQuery = useServiceList({ page, limit: pageSize });
    const services = servicesQuery.data?.data ?? [];
    const total = servicesQuery.data?.pagination.total ?? 0;

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
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Name</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Slug</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Price</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Active</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70 uppercase text-xs tracking-wide">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {servicesQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-slate py-12">
                                            Loading services...
                                        </TableCell>
                                    </TableRow>
                                ) : servicesQuery.isError ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-error-brand py-12">
                                            Failed to load services
                                        </TableCell>
                                    </TableRow>
                                ) : services.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-slate py-12">
                                            No services found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    services.map((service) => (
                                        <TableRow key={service.id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">{service.name}</TableCell>
                                            <TableCell className="text-slate text-sm">{service.slug}</TableCell>
                                            <TableCell className="font-medium">{formatINR(service.price)}</TableCell>
                                            <TableCell>
                                                <ActiveBadge isActive={service.isActive} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ServiceActions id={service.id} />
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

function ServiceActions({ id }: { id: string }) {
    const deleteService = useDeleteService(id);

    const handleDelete = async () => {
        if (!window.confirm("Delete this service?")) return;
        await deleteService.mutateAsync();
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
