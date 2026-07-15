"use client";

import { useState } from "react";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useService, useUpdateService, useServiceContentSlugs } from "@/features/admin/hooks/useAdminServices";
import { formatDate, getApiErrorMessage } from "@/features/admin/lib/format";
import { formatINR, toPaise } from "@/lib/currency";
import { AlertTriangle, CheckCircle2, ExternalLink, Pencil, Save } from "lucide-react";
import Link from "next/link";

const stageOptions = [
    { label: "Start", value: "start" },
    { label: "Manage", value: "manage" },
    { label: "Protect", value: "protect" },
] as const;

export function AdminServiceDetailPage({ id }: { id: string }) {
    const serviceQuery = useService(id);
    const updateService = useUpdateService(id);
    const contentSlugsQuery = useServiceContentSlugs();
    const service = serviceQuery.data?.data;
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        category: "start" as "start" | "manage" | "protect",
        type: "fixed" as "fixed" | "quote",
        price: "",
        sortOrder: "0",
        isActive: true,
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSaved(false);

        try {
            await updateService.mutateAsync({
                name: form.name,
                slug: form.slug,
                description: form.description || null,
                category: form.category,
                type: form.type,
                price: form.price ? toPaise(Number(form.price)) : null,
                sortOrder: Number(form.sortOrder) || 0,
                isActive: form.isActive,
            });
            setEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to update service"));
        }
    };

    if (serviceQuery.isLoading) {
        return (
            <div>
                <PageHeader title="Service Detail" />
                <div className="p-6 text-sm text-slate">Loading service...</div>
            </div>
        );
    }

    if (serviceQuery.isError || !service) {
        return (
            <div>
                <PageHeader title="Service Detail" />
                <div className="p-6 text-sm text-error-brand">Failed to load service</div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={service.name}
                description={service.slug}
                action={
                    !editing ? (
                        <Button
                            size="sm"
                            onClick={() => {
                                setForm({
                                    name: service.name,
                                    slug: service.slug,
                                    description: service.description ?? "",
                                    category: (service.category === "manage" || service.category === "protect" ? service.category : "start"),
                                    type: service.type === "quote" ? "quote" : "fixed",
                                    price: service.price != null ? String(service.price / 100) : "",
                                    sortOrder: String(service.sortOrder ?? 0),
                                    isActive: service.isActive,
                                });
                                setEditing(true);
                            }}
                            className="bg-primary-brand hover:bg-primary-brand/90 text-white gap-2 uppercase tracking-wide"
                        >
                            <Pencil className="h-4 w-4" /> Edit
                        </Button>
                    ) : undefined
                }
            />
            <div className="p-6 max-w-3xl space-y-4">
                {/* CMS content awareness banner */}
                {!contentSlugsQuery.isLoading && service && (
                    contentSlugsQuery.data?.has(service.slug) ? (
                        <div className="rounded-lg border border-status-positive-border bg-status-positive-bg px-4 py-3 text-sm text-status-positive-fg flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                Sanity CMS content is linked to this service.
                            </span>
                            <Link
                                href="/studio/structure/service"
                                target="_blank"
                                className="inline-flex items-center gap-1 text-xs font-medium hover:underline shrink-0"
                            >
                                Edit in Studio <ExternalLink className="h-3 w-3" />
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                No Sanity CMS content for slug <code className="font-mono text-xs bg-amber-100 px-1 rounded">{service.slug}</code>. Customers and marketing pages will show name and price only.
                            </span>
                            <Link
                                href="/studio/intent/create/type=service/"
                                target="_blank"
                                className="inline-flex items-center gap-1 text-xs font-medium hover:underline shrink-0"
                            >
                                Create in Studio <ExternalLink className="h-3 w-3" />
                            </Link>
                        </div>
                    )
                )}

                {saved && (
                    <div className="rounded-lg border border-status-positive-border bg-status-positive-bg px-4 py-3 text-sm text-status-positive-fg flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Saved
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Service Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {editing ? (
                            <form onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug</Label>
                                        <Input required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Price (Rs)</Label>
                                        <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={form.category} onValueChange={(value) => setForm((f) => ({ ...f, category: value as typeof form.category }))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {stageOptions.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select value={form.type} onValueChange={(value) => setForm((f) => ({ ...f, type: value as typeof form.type }))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fixed">Fixed</SelectItem>
                                                <SelectItem value="quote">Quote</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sort Order</Label>
                                        <Input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Active</Label>
                                        <div className="h-10 flex items-center gap-3">
                                            <Switch checked={form.isActive} onCheckedChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))} />
                                            <span className="text-sm text-charcoal">{form.isActive ? "Active" : "Inactive"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                                </div>
                                {error && <p className="text-sm text-error-brand">{error}</p>}
                                <div className="flex gap-3">
                                    <Button type="submit" disabled={updateService.isPending} className="bg-primary-brand hover:bg-primary-brand/90 text-white gap-2 uppercase tracking-wide">
                                        <Save className="h-4 w-4" />
                                        {updateService.isPending ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button type="button" variant="secondary" onClick={() => setEditing(false)} className="uppercase tracking-wide">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-3 text-sm">
                                <Row label="Name" value={service.name} />
                                <Row label="Slug" value={service.slug} />
                                <Row label="Category" value={formatCategory(service.category)} />
                                <Row label="Price" value={service.price != null ? formatINR(service.price) : "On request"} />
                                <Row label="Type" value={formatType(service.type)} />
                                <Row label="Sort Order" value={String(service.sortOrder ?? 0)} />
                                <Row label="Status" value={service.isActive ? "Active" : "Inactive"} />
                                <Row label="Created" value={formatDate(service.createdAt)} />
                                <div className="pt-3 border-t border-hairline">
                                    <p className="text-xs text-slate mb-1">Description</p>
                                    <p className="text-sm text-charcoal leading-relaxed">{service.description || "No description added."}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-slate">{label}</span>
            <span className="font-medium text-charcoal text-right">{value}</span>
        </div>
    );
}

function formatCategory(category: string) {
    if (category === "start") return "Start";
    if (category === "manage") return "Manage";
    if (category === "protect") return "Protect";
    return category || "Uncategorized";
}

function formatType(type: string) {
    if (type === "fixed") return "Fixed";
    if (type === "quote") return "Quote";
    return type || "Service";
}
