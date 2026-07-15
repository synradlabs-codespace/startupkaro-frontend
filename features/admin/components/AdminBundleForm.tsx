"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useBundle, useCreateBundle, useServiceList, useUpdateBundle } from "@/features/admin/hooks/useAdminServices";
import { getApiErrorMessage } from "@/features/admin/lib/format";
import { toPaise } from "@/lib/currency";
import { LinkIcon, PackageCheck, Plus, Save, Trash2 } from "lucide-react";

type BundleItemForm = {
    label: string;
    componentServiceId: string;
};

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function emptyItem(): BundleItemForm {
    return { label: "", componentServiceId: "__none__" };
}

export function AdminBundleForm({ id }: { id?: string }) {
    const router = useRouter();
    const isEdit = Boolean(id);
    const bundleQuery = useBundle(id ?? "");
    const servicesQuery = useServiceList({ page: 1, limit: 100 });
    const createBundle = useCreateBundle();
    const updateBundle = useUpdateBundle(id ?? "");
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        sortOrder: "0",
        isActive: true,
        items: [emptyItem()] as BundleItemForm[],
    });
    const [error, setError] = useState("");

    const services = useMemo(
        () => (servicesQuery.data?.data ?? []).filter((service) => service.isActive),
        [servicesQuery.data?.data],
    );

    useEffect(() => {
        const bundle = bundleQuery.data?.data;
        if (!bundle) return;
        setForm({
            name: bundle.name,
            slug: bundle.slug,
            description: bundle.description ?? "",
            price: String(bundle.price / 100),
            sortOrder: String(bundle.sortOrder ?? 0),
            isActive: bundle.isActive,
            items: bundle.items?.length
                ? bundle.items.map((item) => ({
                      label: item.label,
                      componentServiceId: item.componentServiceId ?? "__none__",
                  }))
                : [emptyItem()],
        });
    }, [bundleQuery.data?.data]);

    const setItem = (index: number, patch: Partial<BundleItemForm>) => {
        setForm((current) => ({
            ...current,
            items: current.items.map((item, idx) => (idx === index ? { ...item, ...patch } : item)),
        }));
    };

    const removeItem = (index: number) => {
        setForm((current) => ({
            ...current,
            items: current.items.length === 1 ? [emptyItem()] : current.items.filter((_, idx) => idx !== index),
        }));
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        const items = form.items
            .map((item) => ({
                label: item.label.trim(),
                componentServiceId: item.componentServiceId === "__none__" ? null : item.componentServiceId,
            }))
            .filter((item) => item.label.length > 0);

        try {
            const payload = {
                name: form.name,
                slug: form.slug,
                description: form.description || undefined,
                price: toPaise(Number(form.price)),
                sortOrder: Number(form.sortOrder) || 0,
                items,
            };

            if (isEdit && id) {
                await updateBundle.mutateAsync({
                    ...payload,
                    description: form.description || null,
                    isActive: form.isActive,
                });
            } else {
                await createBundle.mutateAsync(payload);
            }
            router.push("/admin/bundles");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, `Failed to ${isEdit ? "update" : "create"} bundle`));
        }
    };

    if (isEdit && bundleQuery.isLoading) {
        return (
            <div>
                <PageHeader title="Bundle Detail" />
                <div className="p-6 text-sm text-slate">Loading bundle...</div>
            </div>
        );
    }

    if (isEdit && (bundleQuery.isError || !bundleQuery.data?.data)) {
        return (
            <div>
                <PageHeader title="Bundle Detail" />
                <div className="p-6 text-sm text-error-brand">Failed to load bundle</div>
            </div>
        );
    }

    const pending = createBundle.isPending || updateBundle.isPending;

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={isEdit ? form.name || "Bundle Detail" : "Add Bundle"}
                description={isEdit ? form.slug : "Create a fixed-price bundle"}
            />
            <div className="flex-1 p-6 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <PackageCheck className="h-4 w-4 text-primary-brand" />
                            Bundle Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <Label>Name</Label>
                                    <Input
                                        required
                                        value={form.name}
                                        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                        onBlur={() => setForm((current) => ({ ...current, slug: current.slug || slugify(current.name) }))}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1.5"><LinkIcon className="h-3 w-3" /> Slug</Label>
                                    <Input
                                        required
                                        value={form.slug}
                                        onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Price (Rs)</Label>
                                    <Input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Sort Order</Label>
                                    <Input
                                        type="number"
                                        value={form.sortOrder}
                                        onChange={(event) => setForm((current) => ({ ...current, sortOrder: event.target.value }))}
                                    />
                                </div>
                                {isEdit && (
                                    <div className="space-y-1.5">
                                        <Label>Active</Label>
                                        <div className="h-10 flex items-center gap-3">
                                            <Switch
                                                checked={form.isActive}
                                                onCheckedChange={(checked) => setForm((current) => ({ ...current, isActive: checked }))}
                                            />
                                            <span className="text-sm text-charcoal">{form.isActive ? "Active" : "Inactive"}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Description</Label>
                                <Textarea
                                    value={form.description}
                                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <Label>Bundle Items</Label>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="gap-1.5"
                                        onClick={() => setForm((current) => ({ ...current, items: [...current.items, emptyItem()] }))}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Item
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {form.items.map((item, index) => (
                                        <div key={index} className="grid gap-3 rounded-lg border border-hairline bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]">
                                            <Input
                                                placeholder="Display label"
                                                value={item.label}
                                                onChange={(event) => setItem(index, { label: event.target.value })}
                                            />
                                            <Select
                                                value={item.componentServiceId}
                                                onValueChange={(value) => setItem(index, { componentServiceId: value ?? "__none__" })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={servicesQuery.isLoading ? "Loading services..." : "Optional linked service"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">No linked service</SelectItem>
                                                    {services.map((service) => (
                                                        <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-error-brand hover:bg-error-brand/10 hover:text-error-brand"
                                                onClick={() => removeItem(index)}
                                                aria-label="Remove bundle item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && <p className="text-sm text-error-brand">{error}</p>}

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={pending} className="bg-primary-brand hover:bg-primary-brand/90 text-white gap-2 uppercase tracking-wide">
                                    <Save className="h-4 w-4" />
                                    {pending ? "Saving..." : isEdit ? "Save Bundle" : "Create Bundle"}
                                </Button>
                                <Button type="button" variant="secondary" onClick={() => router.push("/admin/bundles")} className="uppercase tracking-wide">
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
