"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEmployee } from "@/features/admin/hooks/useAdminEmployees";
import { getApiErrorMessage } from "@/features/admin/lib/format";
import { formatRole } from "@/components/custom/StatusBadge";
import type { AdminRole } from "@/services/admin.service";
import {
    formatNameInput, formatPhoneDigits,
    validateName, validateEmail, validatePassword, validatePhoneDigits, buildPhone,
} from "@/lib/validation";
import { UserPlus, Mail, KeyRound, User, Phone, ShieldCheck } from "lucide-react";

export function AdminEmployeeNewPage() {
    const router = useRouter();
    const createEmployee = useCreateEmployee();
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" as AdminRole });
    const [phoneDigits, setPhoneDigits] = useState("");
    const [fieldErrors, setFieldErrors] = useState({ name: "", email: "", password: "", phone: "" });
    const [error, setError] = useState("");

    const clearFieldError = (key: keyof typeof fieldErrors) =>
        setFieldErrors((f) => ({ ...f, [key]: "" }));

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, name: formatNameInput(e.target.value) }));
        if (fieldErrors.name) clearFieldError("name");
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, email: e.target.value }));
        if (fieldErrors.email) clearFieldError("email");
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, password: e.target.value }));
        if (fieldErrors.password) clearFieldError("password");
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneDigits(formatPhoneDigits(e.target.value));
        if (fieldErrors.phone) clearFieldError("phone");
    };

    const validate = () => {
        const errors = {
            name: validateName(form.name),
            email: validateEmail(form.email),
            password: validatePassword(form.password),
            phone: validatePhoneDigits(phoneDigits),
        };
        setFieldErrors(errors);
        return Object.values(errors).every((e) => e === "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!validate()) return;

        try {
            await createEmployee.mutateAsync({
                name: form.name.trim(),
                email: form.email,
                password: form.password,
                phone: buildPhone(phoneDigits),
                role: form.role,
            });
            router.push("/admin/employees");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to create employee"));
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Add Employee" description="Create a new employee account" />

            <div className="flex-1 p-6 max-w-lg">
                <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-5">
                    <div className="flex items-center gap-3 pb-3 border-b border-hairline">
                        <div className="h-9 w-9 rounded-lg bg-primary-brand/10 flex items-center justify-center shrink-0">
                            <UserPlus className="h-4 w-4 text-primary-brand" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-charcoal">Employee Details</h3>
                            <p className="text-xs text-steel">Fill in the details to add them to the team</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <User className="h-3 w-3" /> Full Name
                            </Label>
                            <Input
                                value={form.name}
                                onChange={handleNameChange}
                                required
                                placeholder="Full Name"
                                className={`rounded-lg focus-visible:ring-primary-brand/20 ${fieldErrors.name ? "border-error-brand" : "border-hairline"}`}
                            />
                            {fieldErrors.name
                                ? <p className="text-xs text-error-brand">{fieldErrors.name}</p>
                                : <p className="text-xs text-stone">Letters and spaces only</p>
                            }
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="h-3 w-3" /> Work Email
                            </Label>
                            <Input
                                value={form.email}
                                onChange={handleEmailChange}
                                required
                                type="email"
                                placeholder="Email"
                                className={`rounded-lg focus-visible:ring-primary-brand/20 ${fieldErrors.email ? "border-error-brand" : "border-hairline"}`}
                            />
                            {fieldErrors.email
                                ? <p className="text-xs text-error-brand">{fieldErrors.email}</p>
                                : <p className="text-xs text-stone">Used for login and communications</p>
                            }
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Phone className="h-3 w-3" /> Phone
                            </Label>
                            <div className={`flex items-center rounded-lg border bg-canvas overflow-hidden focus-within:ring-2 focus-within:ring-primary-brand/20 ${fieldErrors.phone ? "border-error-brand" : "border-hairline"}`}>
                                <span className="px-3 py-2 text-sm text-ink bg-surface border-r border-hairline select-none shrink-0">+91</span>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    value={phoneDigits}
                                    onChange={handlePhoneChange}
                                    placeholder="Number"
                                    maxLength={10}
                                    className="flex-1 px-3 py-2 text-sm text-ink bg-canvas outline-none placeholder:text-graphite"
                                />
                            </div>
                            {fieldErrors.phone && <p className="text-xs text-error-brand">{fieldErrors.phone}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <ShieldCheck className="h-3 w-3" /> Role
                            </Label>
                            <Select value={form.role} onValueChange={(value) => setForm((f) => ({ ...f, role: (value ?? f.role) as AdminRole }))}>
                                <SelectTrigger className="rounded-lg border-hairline focus:ring-primary-brand/20">
                                    <SelectValue>{formatRole(form.role)}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employee">Employee</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <KeyRound className="h-3 w-3" /> Temporary Password
                            </Label>
                            <Input
                                value={form.password}
                                onChange={handlePasswordChange}
                                required
                                type="password"
                                placeholder="Password"
                                className={`rounded-lg focus-visible:ring-primary-brand/20 ${fieldErrors.password ? "border-error-brand" : "border-hairline"}`}
                            />
                            {fieldErrors.password
                                ? <p className="text-xs text-error-brand">{fieldErrors.password}</p>
                                : <p className="text-xs text-stone">Employee can change this after first login</p>
                            }
                        </div>

                        {error && <p className="text-sm text-error-brand">{error}</p>}

                        <div className="flex gap-3 pt-1">
                            <Button
                                type="submit"
                                disabled={createEmployee.isPending}
                                className="bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg gap-2 uppercase tracking-wide"
                            >
                                <UserPlus className="h-4 w-4" />
                                {createEmployee.isPending ? "Creating..." : "Create Employee"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.push("/admin/employees")}
                                className="rounded-lg uppercase tracking-wide"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
