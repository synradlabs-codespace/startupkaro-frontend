import { adminInvoiceService } from "@/services/admin.service";

export async function downloadInvoice(orderId: string) {
    let invoiceId = "";
    try {
        const invoice = await adminInvoiceService.getSummary(orderId);
        invoiceId = invoice.data.data.id;
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status !== 404) throw err;
        const issued = await adminInvoiceService.issueForOrder(orderId);
        invoiceId = issued.data.data.id;
    }

    const response = await adminInvoiceService.download(invoiceId);
    const disposition = response.headers["content-disposition"] as string | undefined;
    const match = disposition?.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? `invoice_${invoiceId}.pdf`;
    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
