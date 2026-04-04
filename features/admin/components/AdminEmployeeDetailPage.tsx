// features/admin/components/AdminEmployeeDetailPage.tsx

import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockEmployees } from "@/lib/mock-data";
import { Mail } from "lucide-react";

export function AdminEmployeeDetailPage({ id }: { id: string }) {
    const emp = mockEmployees.find((e) => e.id === id) ?? mockEmployees[0];

    return (
        <div>
            <PageHeader title="Employee Profile" />
            <div className="p-6 max-w-lg">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-3">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="text-lg bg-[var(--color-indigo)]/10 text-[var(--color-indigo)]">
                                    {emp.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-base">{emp.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{emp.id}</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline">{emp.role}</Badge>
                                <Badge className={emp.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-600"}>
                                    {emp.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{emp.email}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Joined {emp.joined}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}