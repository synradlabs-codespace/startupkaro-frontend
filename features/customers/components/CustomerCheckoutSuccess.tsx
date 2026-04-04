// features/customers/components/CustomerCheckoutSuccess.tsx

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function CustomerCheckoutSuccess() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="max-w-md w-full text-center">
                <CardContent className="pt-10 pb-8 space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-14 w-14 text-[var(--color-green)]" />
                    </div>
                    <h1 className="text-2xl font-semibold">Payment Successful!</h1>
                    <p className="text-sm text-muted-foreground">
                        Your order has been placed successfully. Our team will get in touch with you shortly to begin processing your service.
                    </p>
                    <div className="flex gap-3 justify-center pt-2">
                        <Button className="bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white">
                            <Link href="/customer/purchases">View My Purchases</Link>
                        </Button>
                        <Button variant="outline">
                            <Link href="/customer">Back to Dashboard</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}