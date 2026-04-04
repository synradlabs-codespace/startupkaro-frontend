// features/customers/components/CustomerServicesPage.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockServices } from "@/lib/mock-data";
import { Search, Clock, ArrowRight } from "lucide-react";

export function CustomerServicesPage() {
    const [search, setSearch] = useState("");

    const filtered = mockServices.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <PageHeader title="Services" description="Browse and purchase startup services" />
            <div className="p-6 space-y-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((service) => (
                        <Card key={service.id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-base leading-snug">{service.name}</CardTitle>
                                    <Badge variant="outline" className="shrink-0 text-xs">{service.category}</Badge>
                                </div>
                                <CardDescription className="text-xs leading-relaxed">{service.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto pt-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xl font-bold">₹{service.price.toLocaleString("en-IN")}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" /> {service.duration}
                                        </p>
                                    </div>
                                </div>
                                <Button className="w-full bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white" size="sm">
                                    <Link href={`/customer/services/${service.id}`}>
                                        Get Started <ArrowRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}