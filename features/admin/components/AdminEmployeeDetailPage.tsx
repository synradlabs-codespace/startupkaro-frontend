// features/admin/components/AdminEmployeeDetailPage.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/custom/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
                            className="gap-2 bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg "
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Profile
                        </Button>
                    ) : undefined
                }
            />
            <div className="p-6 max-w-lg space-y-4">

                {/* Hero Card */}
                <div className="rounded-xl bg-primary-brand p-8">

                    <div className="relative flex flex-col items-center text-center gap-4">
                        <Avatar className="h-20 w-20 ring-2 ring-white/60 ring-offset-2 ring-offset-primary-brand">
                            <AvatarFallback className="text-xl font-semibold bg-white text-primary-deep">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            {editing ? (
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="text-center font-semibold text-base rounded-lg bg-white/10 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                                />
                            ) : (
                                <p className="font-semibold text-lg text-white">{name}</p>
                            )}
                            <p className="text-xs text-white/70 font-mono">{emp.id}</p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Badge variant="outline" className="border-white/40 text-white bg-transparent">{emp.role}</Badge>
                            {editing ? (
                                <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v ?? "" }))}>
                                    <SelectTrigger className="h-8 w-28 rounded-md border-white bg-white px-3 text-xs text-primary-deep shadow-sm hover:bg-white/95 focus-visible:ring-white/35">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge className={status === "active" ? "bg-white/20 text-white hover:bg-white/25 border-white/30" : "bg-white/10 text-white/80 hover:bg-white/15 border-white/20"}>
                                    {status}
                                </Badge>
                            )}
                        </div>

                        {editing && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="gap-1.5 bg-white text-primary-deep hover:bg-white/90 rounded-lg"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Save
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="gap-1.5 rounded-lg bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                        <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                            <ShieldCheck className="h-3.5 w-3.5 text-primary-brand" />
                        </div>
                        <h3 className="text-sm font-semibold text-charcoal">Account Details</h3>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                        <Mail className="h-4 w-4 text-stone shrink-0" />
                        <div>
                            <p className="text-xs text-steel font-medium">Work Email</p>
                            <p className="text-sm text-charcoal">{emp.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                        <Calendar className="h-4 w-4 text-stone shrink-0" />
                        <div>
                            <p className="text-xs text-steel font-medium">Joined</p>
                            <p className="text-sm text-charcoal">{emp.joined}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
