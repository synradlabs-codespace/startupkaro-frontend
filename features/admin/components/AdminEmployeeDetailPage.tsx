"use client";

import { useState } from "react";
import { PageHeader } from "@/components/custom/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployee, useUpdateEmployee } from "@/features/admin/hooks/useAdminEmployees";
import { formatDate, getApiErrorMessage, getInitials } from "@/features/admin/lib/format";
import type { AdminRole } from "@/services/admin.service";
import { Mail, Pencil, Check, X, Calendar, ShieldCheck, Phone } from "lucide-react";
import { formatRole, formatActiveStatus } from "@/components/custom/StatusBadge";

export function AdminEmployeeDetailPage({ id }: { id: string }) {
    const employeeQuery = useEmployee(id);
    const updateEmployee = useUpdateEmployee(id);
    const employee = employeeQuery.data?.data;

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<{ name: string; status: string; role: AdminRole } | null>(null);
    const [error, setError] = useState("");

    const handleEdit = () => {
        if (!employee) return;
        setDraft({
            name: employee.name,
            status: employee.isActive ? "active" : "inactive",
            role: employee.role,
        });
        setError("");
        setEditing(true);
    };

    const handleSave = async () => {
        setError("");

        try {
            await updateEmployee.mutateAsync({
                name: form.name,
                isActive: form.status === "active",
                role: form.role,
            });
            setEditing(false);
            setDraft(null);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to update employee"));
        }
    };

    const handleCancel = () => {
        setDraft(null);
        setError("");
        setEditing(false);
    };

    if (employeeQuery.isLoading) {
        return (
            <div>
                <PageHeader title="Employee Profile" />
                <div className="p-6 text-sm text-slate">Loading employee...</div>
            </div>
        );
    }

    if (employeeQuery.isError || !employee) {
        return (
            <div>
                <PageHeader title="Employee Profile" />
                <div className="p-6 text-sm text-error-brand">Failed to load employee</div>
            </div>
        );
    }

    const form = draft ?? {
        name: employee.name,
        status: employee.isActive ? "active" : "inactive",
        role: employee.role,
    };
    const displayName = editing ? form.name : employee.name;
    const displayStatus = editing ? form.status : employee.isActive ? "active" : "inactive";
    const displayRole = editing ? form.role : employee.role;

    return (
        <div>
            <PageHeader
                title="Employee Profile"
                action={
                    !editing ? (
                        <Button
                            size="sm"
                            onClick={handleEdit}
                            className="gap-2 bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg uppercase tracking-wide"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Profile
                        </Button>
                    ) : undefined
                }
            />
            <div className="p-6 max-w-lg space-y-4">
                <div className="rounded-xl bg-primary-brand p-8">
                    <div className="relative flex flex-col items-center text-center gap-4">
                        <Avatar className="h-20 w-20 ring-2 ring-white/60 ring-offset-2 ring-offset-primary-brand">
                            <AvatarFallback className="text-xl font-semibold bg-white text-primary-deep">
                                {getInitials(displayName)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            {editing ? (
                                <Input
                                    value={form.name}
                                    onChange={(e) => setDraft((f) => ({ ...(f ?? form), name: e.target.value }))}
                                    className="text-center font-semibold text-base rounded-lg bg-white/10 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                                />
                            ) : (
                                <p className="font-semibold text-lg text-white">{displayName}</p>
                            )}
                        </div>

                        <div className="flex gap-2 items-center">
                            {editing ? (
                                <Select value={form.role} onValueChange={(value) => setDraft((f) => ({ ...(f ?? form), role: (value ?? form.role) as AdminRole }))}>
                                    <SelectTrigger className="h-8 w-28 rounded-md border-white bg-white px-3 text-xs text-primary-deep shadow-sm hover:bg-white/95 focus-visible:ring-white/35">
                                        <SelectValue>{formatRole(form.role)}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employee">Employee</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge variant="outline" className="border-white/40 text-white bg-transparent">{formatRole(displayRole)}</Badge>
                            )}
                            {editing ? (
                                <Select value={form.status} onValueChange={(value) => setDraft((f) => ({ ...(f ?? form), status: value ?? form.status }))}>
                                    <SelectTrigger className="h-8 w-28 rounded-md border-white bg-white px-3 text-xs text-primary-deep shadow-sm hover:bg-white/95 focus-visible:ring-white/35">
                                        <SelectValue>{formatActiveStatus(form.status === "active")}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge className={displayStatus === "active" ? "bg-white/20 text-white hover:bg-white/25 border-white/30" : "bg-white/10 text-white/80 hover:bg-white/15 border-white/20"}>
                                    {formatActiveStatus(displayStatus === "active")}
                                </Badge>
                            )}
                        </div>

                        {error && <p className="text-sm text-white">{error}</p>}

                        {editing && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={updateEmployee.isPending}
                                    className="gap-1.5 bg-white text-primary-deep hover:bg-white/90 rounded-lg uppercase tracking-wide"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    {updateEmployee.isPending ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="gap-1.5 rounded-lg bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white uppercase tracking-wide"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

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
                            <p className="text-sm text-charcoal">{employee.email}</p>
                        </div>
                    </div>

                    {employee.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                            <Phone className="h-4 w-4 text-stone shrink-0" />
                            <div>
                                <p className="text-xs text-steel font-medium">Phone</p>
                                <p className="text-sm text-charcoal">{employee.phone}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                        <Calendar className="h-4 w-4 text-stone shrink-0" />
                        <div>
                            <p className="text-xs text-steel font-medium">Joined</p>
                            <p className="text-sm text-charcoal">{formatDate(employee.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
