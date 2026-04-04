// features/customer/components/CustomerChangePasswordPage.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerChangePasswordPage() {
    const router = useRouter();
    const [form, setForm] = useState({ current: "", next: "", confirm: "" });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (form.next !== form.confirm) {
            setError("New passwords do not match");
            return;
        }
        // TODO: call API when ready
        router.push("/customer/profile");
    };

    return (
        <div>
            <PageHeader title="Change Password" description="Update your account password" />
            <div className="p-6 max-w-md">
                <Card>
                    <CardHeader><CardTitle className="text-base">New Password</CardTitle></CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Current Password</Label>
                                <Input type="password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input type="password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm New Password</Label>
                                <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" className="bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white">
                                    Update Password
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.push("/customer/profile")}>
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