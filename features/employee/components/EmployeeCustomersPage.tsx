// features/employee/components/EmployeeCustomersPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockCustomers } from "@/lib/mock-data";
import { Search, Eye } from "lucide-react";

const PAGE_SIZE = 10;

export function EmployeeCustomersPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const filtered = mockCustomers.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div>
            <PageHeader title="Customers" description={`${mockCustomers.length} registered customers`} />
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
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Customer</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Email</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Mobile</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Orders</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Joined</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70 uppercase text-xs tracking-wide">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                                            No customers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((customer) => (
                                        <TableRow key={customer.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs bg-[var(--color-indigo)]/10 text-[var(--color-indigo)] font-semibold">
                                                            {customer.name.split(" ").map(n => n[0]).join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{customer.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{customer.email}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{customer.mobile}</TableCell>
                                            <TableCell>
                                                <span className="font-medium">{customer.orders}</span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{customer.joined}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/employee/customers/${customer.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[var(--color-indigo)]/10 hover:text-[var(--color-indigo)]">
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
