// features/admin/components/AdminEmployeesPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockEmployees } from "@/lib/mock-data";
import { Search, Plus, Eye } from "lucide-react";

const PAGE_SIZE = 10;

export function AdminEmployeesPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const filtered = mockEmployees.filter(
        (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.email.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div>
            <PageHeader
                title="Employees"
                description={`${mockEmployees.length} team members`}
                action={
                    <Link href="/admin/employees/new">
                        <Button size="sm" className="bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white">
                            <Plus className="h-4 w-4 mr-1" /> Add Employee
                        </Button>
                    </Link>
                }
            />
            <div className="p-6 space-y-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-muted/50">
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Employee</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Email</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Role</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Status</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Joined</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70 uppercase text-xs tracking-wide">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                                            No employees found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((emp) => (
                                        <TableRow key={emp.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs bg-[var(--color-indigo)]/10 text-[var(--color-indigo)] font-semibold">
                                                            {emp.name.split(" ").map(n => n[0]).join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{emp.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{emp.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs bg-[var(--color-indigo)]/5 border-[var(--color-indigo)]/20 text-[var(--color-indigo)]">
                                                    {emp.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={emp.status === "active"
                                                        ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                                        : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100"
                                                    }
                                                >
                                                    {emp.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{emp.joined}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/admin/employees/${emp.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[var(--color-green)]/10 hover:text-[var(--color-green)]">
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
