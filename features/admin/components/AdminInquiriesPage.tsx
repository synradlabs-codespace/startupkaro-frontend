// features/admin/components/AdminInquiriesPage.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockInquiries } from "@/lib/mock-data";
import { Search, Eye, Trash2 } from "lucide-react";

export function AdminInquiriesPage() {
    const [search, setSearch] = useState("");
    const [inquiries, setInquiries] = useState(mockInquiries);

    const filtered = inquiries.filter(
        (i) =>
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.email.toLowerCase().includes(search.toLowerCase()) ||
            i.message.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: string) => {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
    };

    return (
        <div>
            <PageHeader title="Inquiries" description={`${inquiries.length} inquiries received`} />
            <div className="p-6 space-y-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search inquiries..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Mobile</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                                            No inquiries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((inq) => (
                                        <TableRow key={inq.id}>
                                            <TableCell className="font-medium">{inq.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{inq.email}</TableCell>
                                            <TableCell className="text-muted-foreground">{inq.mobile}</TableCell>
                                            <TableCell className="max-w-xs">
                                                <p className="text-sm text-muted-foreground truncate">{inq.message}</p>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{inq.date}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button variant="ghost" size="icon">
                                                        <Link href={`/admin/inquiries/${inq.id}`}><Eye className="h-4 w-4" /></Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}