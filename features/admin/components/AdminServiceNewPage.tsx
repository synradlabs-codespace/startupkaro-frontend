"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAdminCategories, useCreateService } from "@/features/admin/hooks/useAdminServices";
import { getApiErrorMessage } from "@/features/admin/lib/format";
import { toPaise } from "@/lib/currency";
import { Briefcase, IndianRupee, LinkIcon, ToggleRight } from "lucide-react";

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function AdminServiceNewPage() {
    const router = useRouter();
    const createService = useCreateService();
    const categoriesQuery = useAdminCategories();
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        categoryId: "",
        pricingType: "fixed",
        billingCycle: "one_time",
        price: "",
        taxRatePct: "18",
        priceInclusiveOfTax: false,
        isBundle: false,
        isPurchasable: true,
        isActive: true,
        sortOrder: "0",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await createService.mutateAsync({
                name: form.name,
                slug: form.slug,
                description: form.description || undefined,
                categoryId: form.categoryId || undefined,
                pricingType: form.pricingType,
                billingCycle: form.billingCycle,
                price: form.price ? toPaise(Number(form.price)) : null,
                taxRatePct: Math.round(Number(form.taxRatePct) * 100),
                priceInclusiveOfTax: form.priceInclusiveOfTax,
                isBundle: form.isBundle,
                isPurchasable: form.isPurchasable,
                isActive: form.isActive,
                sortOrder: Number(form.sortOrder) || 0,
            });
            router.push("/admin/services");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to create service"));
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Add Service" description="Create a new billable service" />
            <div className="flex-1 p-6 max-w-2xl">
                <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                        <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                            <Briefcase className="h-3.5 w-3.5 text-primary-brand" />
                        </div>
                        <h3 className="text-sm font-semibold text-charcoal">Service Details</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                    <Briefcase className="h-3 w-3" /> Name
                                </Label>
                                <Input
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    onBlur={() => setForm((f) => ({ ...f, slug: f.slug || slugify(f.name) }))}
                                    placeholder="Service Name"
                                    className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                    <LinkIcon className="h-3 w-3" /> Slug
                                </Label>
                                <Input
                                    required
                                    value={form.slug}
                                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                                    placeholder="service-slug"
                                    className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide">Category</Label>
                                <Select value={form.categoryId} onValueChange={(value) => setForm((f) => ({ ...f, categoryId: value ?? "" }))}>
                                    <SelectTrigger className="rounded-lg border-hairline">
                                        <SelectValue placeholder={categoriesQuery.isLoading ? "Loading categories..." : "Select category"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(categoriesQuery.data ?? []).map((category) => (
                                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                    <IndianRupee className="h-3 w-3" /> Price (Rs)
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                                    placeholder="Amount"
                                    className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide">Pricing Type</Label>
                                <Select value={form.pricingType} onValueChange={(value) => setForm((f) => ({ ...f, pricingType: value ?? "fixed", isPurchasable: value === "quote" ? false : f.isPurchasable }))}>
                                    <SelectTrigger className="rounded-lg border-hairline">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">Fixed</SelectItem>
                                        <SelectItem value="starting_from">Starting from</SelectItem>
                                        <SelectItem value="per_unit">Per unit</SelectItem>
                                        <SelectItem value="recurring">Recurring</SelectItem>
                                        <SelectItem value="quote">Quote</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide">Billing Cycle</Label>
                                <Select value={form.billingCycle} onValueChange={(value) => setForm((f) => ({ ...f, billingCycle: value ?? "one_time" }))}>
                                    <SelectTrigger className="rounded-lg border-hairline">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="one_time">One time</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="hourly">Hourly</SelectItem>
                                        <SelectItem value="per_application">Per application</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide">Tax Rate (%)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.taxRatePct}
                                    onChange={(e) => setForm((f) => ({ ...f, taxRatePct: e.target.value }))}
                                    className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide">Sort Order</Label>
                                <Input
                                    type="number"
                                    value={form.sortOrder}
                                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                                    className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                                />
                            </div>

                            {[
                                ["Active", "isActive"],
                                ["Purchasable", "isPurchasable"],
                                ["Bundle", "isBundle"],
                                ["Price Includes Tax", "priceInclusiveOfTax"],
                            ].map(([label, key]) => (
                                <div key={key} className="space-y-1.5">
                                    <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                        <ToggleRight className="h-3 w-3" /> {label}
                                    </Label>
                                    <div className="h-10 flex items-center gap-3">
                                        <Switch
                                            checked={Boolean(form[key as keyof typeof form])}
                                            onCheckedChange={(checked) => setForm((f) => ({ ...f, [key]: checked }))}
                                        />
                                        <span className="text-sm text-charcoal">{Boolean(form[key as keyof typeof form]) ? "Yes" : "No"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide">Description</Label>
                            <Textarea
                                value={form.description}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                placeholder="Description"
                                className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                            />
                        </div>

                        {error && <p className="text-sm text-error-brand">{error}</p>}

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={createService.isPending} className="bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg gap-2 uppercase tracking-wide">
                                <Briefcase className="h-4 w-4" />
                                {createService.isPending ? "Creating..." : "Create Service"}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => router.push("/admin/services")} className="rounded-lg uppercase tracking-wide">
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
