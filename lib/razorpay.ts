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
        // On a decline, Razorpay does NOT close its modal - it shows its own
        // retry/change-method screen inside the still-open checkout iframe.
        // Rejecting immediately here would navigate the app away while that
        // iframe is still on top of the page. So a failure is only recorded,
        // and the promise settles when the modal actually closes
        // (`ondismiss`), whether the user retries-and-gives-up or hits close.
        let lastFailure: RazorpayFailureError | undefined;
        const rzp = new window.Razorpay({
            ...options,
            handler: (response) => {
                settled = true;
                resolve(response);
            },
            modal: {
                ondismiss: () => {
                    if (settled) return;
                    settled = true;
                    reject(lastFailure ? new RazorpayCheckoutError("failed", lastFailure) : new RazorpayCheckoutError("dismissed"));
                },
            },
        });
        rzp.on("payment.failed", (response) => {
            lastFailure = response.error;
        });
        rzp.open();
    });
}
