// features/customers/components/CustomerProfilePage.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Calendar } from "lucide-react";

const mockProfile = {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    mobile: "+91 98765 43210",
    joined: "2025-01-15",
};

export function CustomerProfilePage() {
    return (
        <div>
            <PageHeader title="Profile" description="Your account details" />
            <div className="p-6 max-w-lg space-y-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="text-lg bg-[var(--color-green)]/10 text-[var(--color-green)]">
                                    RS
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-lg">{mockProfile.name}</p>
                                <p className="text-sm text-muted-foreground">Customer Account</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-base">Contact Details</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span>{mockProfile.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Phone className="h-4 w-4 shrink-0" />
                            <span>{mockProfile.mobile}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span>Member since {mockProfile.joined}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-base">Security</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Password</p>
                                <p className="text-xs text-muted-foreground">Last updated recently</p>
                            </div>
                            <Button variant="outline" size="sm">
                                <Link href="/customer/profile/change-password">Change Password</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}