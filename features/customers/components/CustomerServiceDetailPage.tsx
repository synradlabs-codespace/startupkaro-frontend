// features/customers/components/CustomerServiceDetailPage.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockServices } from "@/lib/mock-data";
import { Clock, ShieldCheck, ArrowRight } from "lucide-react";

export function CustomerServiceDetailPage({ id }: { id: string }) {
    const service = mockServices.find((s) => s.id === id) ?? mockServices[0];

    return (
        <div>
            <PageHeader title={service.name} description={service.category} />
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardHeader><CardTitle className="text-base">About this service</CardTitle></CardHeader>
                        <CardContent className="text-sm text-muted-foreground leading-relaxed">
                            <p>{service.description}</p>
                            <ul className="mt-4 space-y-2">
                                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--color-green)]" /> 100% legal compliance guaranteed</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--color-green)]" /> Expert CA/CS assigned to your case</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--color-green)]" /> End-to-end document handling</li>
                                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--color-green)]" /> Real-time status updates</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <Card className="h-fit">
                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <p className="text-3xl font-bold">₹{service.price.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Delivered in {service.duration}
                            </p>
                        </div>
                        <Badge variant="outline">{service.category}</Badge>
                        <Button className="w-full bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white">
                            <Link href={`/customer/checkout?service=${service.id}`}>
                                Proceed to Checkout <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}