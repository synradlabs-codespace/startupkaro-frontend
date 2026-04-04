// features/admin/components/AdminEmployeeNewPage.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminEmployeeNewPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/admin/employees");
    };

    return (
        <div>
            <PageHeader title="Add Employee" description="Create a new employee account" />
            <div className="p-6 max-w-lg">
                <Card>
                    <CardHeader><CardTitle className="text-base">Employee Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input placeholder="Arjun Verma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Work Email</Label>
                                <Input type="email" placeholder="arjun@startupkaro.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Temporary Password</Label>
                                <Input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" className="bg-[var(--color-saffron)] hover:bg-[var(--color-saffron)]/90 text-white">
                                    Create Employee
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.push("/admin/employees")}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}