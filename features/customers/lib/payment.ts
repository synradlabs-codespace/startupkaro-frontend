// features/customers/lib/payment.ts
//
// Shared, framework-free helpers for resuming a customer's payment. Kept out
// of the hooks/components so both the checkout flow and the retry flow read
// the API response the same way.

import type { CustomerPurchase, RazorpayInitiation } from "@/services/customer.service";

/** `POST /customer/cart/checkout` nests the payment fields under `payment`;
 * `POST /customer/purchases/payments/:id/retry` and
 * `POST /customer/purchases/:orderId/pay` return them flat. Both shapes are
 * seen in the wild, so this accepts either. */
export type RawPaymentInitiation =
    | RazorpayInitiation
    | {
          orderId?: string;
          orderNumber?: string;
          payment: RazorpayInitiation;
      };

export interface NormalizedPaymentInitiation {
    orderId?: string;
    orderNumber?: string;
    paymentId?: string;
    razorpayOrderId: string;
    razorpayKeyId: string;
    amount: number;
    currency: string;
    attemptNumber?: number;
    serviceName?: string;
    description?: string;
}

export function normalizePaymentInitiation(raw: RawPaymentInitiation): NormalizedPaymentInitiation {
    const nested = "payment" in raw && raw.payment ? raw.payment : undefined;
    const flat = nested ?? (raw as RazorpayInitiation);
    const orderId = "orderId" in raw ? raw.orderId : undefined;
    const orderNumber = "orderNumber" in raw ? raw.orderNumber : undefined;

    return {
        orderId: orderId ?? flat.orderId,
        orderNumber: orderNumber ?? flat.orderNumber,
        paymentId: flat.paymentId,
        razorpayOrderId: flat.razorpayOrderId ?? "",
        razorpayKeyId: flat.razorpayKeyId ?? flat.keyId ?? "",
        amount: flat.amount,
        currency: flat.currency,
        attemptNumber: (flat as { attemptNumber?: number }).attemptNumber,
        serviceName: flat.serviceName,
        description: flat.description,
    };
}

export function getPurchaseAmountDue(purchase: CustomerPurchase): number {
    const amountPaid = purchase.amountPaid ?? 0;
    return purchase.amountDue ?? Math.max(purchase.amount - amountPaid, 0);
}

/** A `created` or `failed` payment on the order is an abandoned/declined
 * checkout - retry re-opens that same payment. Returns undefined when there
 * is nothing to retry (e.g. everything is captured), so callers should fall
 * back to `payBalance`. */
export function getResumablePaymentId(purchase: CustomerPurchase): string | undefined {
    const resumable = purchase.payments?.find((payment) => payment.status === "created" || payment.status === "failed");
    return resumable?.id ?? purchase.paymentId;
}

export function isPaymentResumable(purchase: CustomerPurchase): boolean {
    // Drafts shouldn't reach the client (the backend excludes them from
    // `GET /customer/purchases`), but this is the last line of defense in
    // case one ever leaks through - a draft has never been attempted, so it
    // has nothing to resume.
    if (purchase.status === "cancelled" || purchase.status === "draft") return false;
    return getPurchaseAmountDue(purchase) > 0;
}
