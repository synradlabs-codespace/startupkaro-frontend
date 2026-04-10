// features/admin/components/AdminEmployeeDetailPage.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockEmployees } from "@/lib/mock-data";
import { Mail, Pencil, Check, X, Calendar, ShieldCheck } from "lucide-react";

export function AdminEmployeeDetailPage({ id }: { id: string }) {
    const emp = mockEmployees.find((e) => e.id === id) ?? mockEmployees[0];

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(emp.name);
    const [status, setStatus] = useState(emp.status ?? "");
    const [form, setForm] = useState({ name: emp.name, status: emp.status ?? "" });

    const handleEdit = () => {
        setForm({ name, status });
        setEditing(true);
    };

    const handleSave = () => {
        setName(form.name);
        setStatus(form.status);
        setEditing(false);
    };

    const handleCancel = () => {
        setForm({ name, status });
        setEditing(false);
    };

    const initials = name.split(" ").map(n => n[0]).join("");

    return (
        <div>
            <PageHeader
                title="Employee Profile"
                action={
                    !editing ? (
                        <Button
                            size="sm"
                            onClick={handleEdit}
                            className="gap-2 bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white rounded-xl shadow-sm"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Profile
                        </Button>
                    ) : undefined
                }
            />
            <div className="p-6 max-w-lg space-y-4">

                {/* Hero Card */}
                <div className="relative overflow-hidden rounded-2xl border border-[var(--color-green)]/15 bg-gradient-to-br from-[var(--color-green)]/8 via-white/80 to-green-50/60 backdrop-blur-sm shadow-sm p-8">
                    <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--color-green)]/8 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-green-300/10 blur-2xl" />

                    <div className="relative flex flex-col items-center text-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-[var(--color-green)]/20 to-green-200/40 text-[var(--color-green)]">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            {editing ? (
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="text-center font-semibold text-base rounded-xl border-gray-200 focus-visible:ring-[var(--color-green)]/30"
                                />
                            ) : (
                                <p className="font-semibold text-lg text-gray-900">{name}</p>
                            )}
                            <p className="text-xs text-muted-foreground font-mono">{emp.id}</p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Badge variant="outline">{emp.role}</Badge>
                            {editing ? (
                                <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v ?? "" }))}>
                                    <SelectTrigger className="h-7 text-xs rounded-full px-3 w-auto border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge className={status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"}>
                                    {status}
                                </Badge>
                            )}
                        </div>

                        {editing && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="gap-1.5 bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white rounded-xl"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Save
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="gap-1.5 rounded-xl"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                        <div className="h-7 w-7 rounded-lg bg-[var(--color-green)]/10 flex items-center justify-center">
                            <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-green)]" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800">Account Details</h3>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80">
                        <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Work Email</p>
                            <p className="text-sm text-gray-800">{emp.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80">
                        <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Joined</p>
                            <p className="text-sm text-gray-800">{emp.joined}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
