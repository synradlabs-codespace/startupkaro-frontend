import { adminPaymentService } from "@/services/admin.service";

export async function downloadAdminReceipt(paymentId: string) {
    const response = await adminPaymentService.downloadReceipt(paymentId);
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
