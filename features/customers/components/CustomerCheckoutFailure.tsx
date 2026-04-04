// features/customers/components/CustomerCheckoutFailure.tsx

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export function CustomerCheckoutFailure() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="max-w-md w-full text-center">
                <CardContent className="pt-10 pb-8 space-y-4">
                    <div className="flex justify-center">
                        <XCircle className="h-14 w-14 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-semibold">Payment Failed</h1>
                    <p className="text-sm text-muted-foreground">
                        Your payment could not be processed. No amount has been charged. Please try again or contact support if the issue persists.
                    </p>
                    <div className="flex gap-3 justify-center pt-2">
                        <Button className="bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white">
                            <Link href="/customer/services">Try Again</Link>
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