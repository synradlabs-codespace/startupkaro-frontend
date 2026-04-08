// features/admin/components/AdminEmployeesPage.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockEmployees } from "@/lib/mock-data";
import { Search, Plus, Eye } from "lucide-react";

export function AdminEmployeesPage() {
    const [search, setSearch] = useState("");

    const filtered = mockEmployees.filter(
        (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <PageHeader
                title="Employees"
                description={`${mockEmployees.length} team members`}
                action={
                    <Button size="sm" className="bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white">
                        <Link href="/admin/employees/new"><Plus className="h-4 w-4 mr-1" /> Add Employee</Link>
                    </Button>
                }
            />
            <div className="p-6 space-y-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((emp) => (
                                    <TableRow key={emp.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs bg-[var(--color-indigo)]/10 text-[var(--color-indigo)]">
                                                        {emp.name.split(" ").map(n => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{emp.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">{emp.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={emp.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"}>
                                                {emp.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{emp.joined}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Link href={`/admin/employees/${emp.id}`}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}