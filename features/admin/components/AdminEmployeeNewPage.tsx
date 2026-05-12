// features/admin/components/AdminEmployeeNewPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, KeyRound, User } from "lucide-react";

export function AdminEmployeeNewPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/admin/employees");
    };

    const field = (key: keyof typeof form) => ({
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, [key]: e.target.value })),
    });

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Add Employee" description="Create a new employee account" />

            <div className="flex-1 p-6 max-w-lg">
                <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-5">
                    <div className="flex items-center gap-3 pb-3 border-b border-hairline">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent-admin to-accent-admin border border-hairline flex items-center justify-center shrink-0">
                            <UserPlus className="h-4 w-4 text-charcoal" />
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
                                {...field("name")}
                                placeholder="Arjun Verma"
                                className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                            />
                            <p className="text-xs text-stone">As it will appear on the employee profile</p>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="h-3 w-3" /> Work Email
                            </Label>
                            <Input
                                {...field("email")}
                                type="email"
                                placeholder="arjun@startupkaro.com"
                                className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                            />
                            <p className="text-xs text-stone">Used for login and communications</p>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <KeyRound className="h-3 w-3" /> Temporary Password
                            </Label>
                            <Input
                                {...field("password")}
                                type="password"
                                placeholder="••••••••"
                                className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                            />
                            <p className="text-xs text-stone">Employee can change this after first login</p>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <Button
                                type="submit"
                                className="bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg gap-2"
                            >
                                <UserPlus className="h-4 w-4" />
                                Create Employee
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin/employees")}
                                className="rounded-lg"
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
