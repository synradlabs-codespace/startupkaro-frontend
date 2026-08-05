import { customerInvoiceService, customerPurchaseService } from "@/services/customer.service";

export async function downloadCustomerInvoice(orderId: string) {
    const response = await customerInvoiceService.downloadByOrder(orderId);
    const disposition = response.headers["content-disposition"] as string | undefined;
    const match = disposition?.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? `invoice_${orderId}.pdf`;
    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export async function downloadCustomerReceipt(paymentId: string) {
    const response = await customerPurchaseService.downloadReceipt(paymentId);
    const disposition = response.headers["content-disposition"] as string | undefined;
    const match = disposition?.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? `receipt_${paymentId}.pdf`;
    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
