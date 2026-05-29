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

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions & {
            handler: (response: RazorpayHandlerResponse) => void;
            modal?: { ondismiss?: () => void };
        }) => { open: () => void };
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
        const rzp = new window.Razorpay({
            ...options,
            handler: (response) => resolve(response),
            modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        });
        rzp.open();
    });
}
