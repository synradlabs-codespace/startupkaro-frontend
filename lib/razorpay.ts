// lib/razorpay.ts

export interface RazorpayHandlerResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: { color?: string };
}

export interface RazorpayFailureError {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
}

/** Thrown by `openRazorpayCheckout` instead of a generic Error, so callers can
 * tell a user closing the modal apart from Razorpay actually declining the
 * payment and respond differently (stay put + offer retry vs. show a
 * failure page). */
export class RazorpayCheckoutError extends Error {
    reason: "dismissed" | "failed";
    code?: string;
    description?: string;

    constructor(reason: "dismissed" | "failed", error?: RazorpayFailureError) {
        super(error?.description ?? (reason === "dismissed" ? "Payment cancelled" : "Payment failed"));
        this.reason = reason;
        this.code = error?.code;
        this.description = error?.description;
    }
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions & {
            handler: (response: RazorpayHandlerResponse) => void;
            modal?: { ondismiss?: () => void };
        }) => {
            open: () => void;
            on: (event: "payment.failed", handler: (response: { error: RazorpayFailureError }) => void) => void;
        };
    }
}

export function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window !== "undefined" && window.Razorpay) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay script"));
        document.body.appendChild(script);
    });
}

export function openRazorpayCheckout(options: RazorpayOptions): Promise<RazorpayHandlerResponse> {
    return new Promise((resolve, reject) => {
        let settled = false;
        const rzp = new window.Razorpay({
            ...options,
            handler: (response) => {
                settled = true;
                resolve(response);
            },
            modal: {
                ondismiss: () => {
                    // A declined payment also closes the modal, which fires
                    // ondismiss after payment.failed already rejected below -
                    // don't overwrite that more specific rejection.
                    if (settled) return;
                    settled = true;
                    reject(new RazorpayCheckoutError("dismissed"));
                },
            },
        });
        rzp.on("payment.failed", (response) => {
            if (settled) return;
            settled = true;
            reject(new RazorpayCheckoutError("failed", response.error));
        });
        rzp.open();
    });
}
