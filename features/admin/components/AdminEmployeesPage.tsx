"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleBadge, ActiveBadge } from "@/components/custom/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEmployeeList } from "@/features/admin/hooks/useAdminEmployees";
import { formatDate, getInitials } from "@/features/admin/lib/format";
import { Search, Plus, Eye } from "lucide-react";

const PAGE_SIZE = 10;

export function AdminEmployeesPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const employeesQuery = useEmployeeList({ search: search || undefined, page, limit: pageSize });

    const employees = employeesQuery.data?.data ?? [];
    const total = employeesQuery.data?.pagination.total ?? 0;

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div>
            <PageHeader
                title="Employees"
                description={`${total} team members`}
                action={
                    <Link href="/admin/employees/new">
                        <Button size="sm" className="bg-primary-brand hover:bg-primary-brand/90 text-white uppercase tracking-wide">
                            <Plus className="h-4 w-4 mr-1" /> Add Employee
                        </Button>
                    </Link>
                }
            />
            <div className="p-6 space-y-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Employee</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Email</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Role</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Status</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Joined</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70 uppercase text-xs tracking-wide">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employeesQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-slate py-12">
                                            Loading employees...
                                        </TableCell>
                                    </TableRow>
                                ) : employeesQuery.isError ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-error-brand py-12">
                                            Failed to load employees
                                        </TableCell>
                                    </TableRow>
                                ) : employees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-slate py-12">
                                            No employees found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employees.map((emp) => (
                                        <TableRow key={emp.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs bg-primary-brand/10 text-primary-brand font-semibold">
                                                            {getInitials(emp.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{emp.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate text-sm">{emp.email}</TableCell>
                                            <TableCell>
                                                <RoleBadge role={emp.role} />
                                            </TableCell>
                                            <TableCell>
                                                <ActiveBadge isActive={emp.isActive} />
                                            </TableCell>
                                            <TableCell className="text-slate text-sm">{formatDate(emp.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/admin/employees/${emp.id}`}>
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
