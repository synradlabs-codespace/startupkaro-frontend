"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { useOrder, useOrderHistory, useUpdateOrder } from "@/features/admin/hooks/useAdminOrders";
import { downloadInvoice } from "@/features/admin/lib/downloadInvoice";
import { formatDate, formatDateHeader, formatTime, getAdminOrderPaymentStatus, getApiErrorMessage } from "@/features/admin/lib/format";
import { OrderPaymentsPanel } from "@/features/admin/components/OrderPaymentsPanel";
import { useToast } from "@/components/providers/ToastProvider";
import type { Note } from "@/services/admin.service";
import { formatINR } from "@/lib/currency";
import { Pencil, Download, StickyNote, Send } from "lucide-react";

function groupNotesByDate(notes: Note[]) {
    return notes.reduce<{ key: string; label: string; notes: Note[] }[]>((acc, note) => {
        const key = note.createdAt ? new Date(note.createdAt).toDateString() : "__nodate__";
        const label = note.createdAt ? formatDateHeader(note.createdAt) : "";
        const last = acc[acc.length - 1];
        if (last?.key === key) {
            last.notes.push(note);
        } else {
            acc.push({ key, label, notes: [note] });
        }
        return acc;
    }, []);
}

export function AdminOrderDetailPage({ id }: { id: string }) {
    const toast = useToast();
    const orderQuery = useOrder(id);
    const historyQuery = useOrderHistory(id);
    const updateOrder = useUpdateOrder(id);
    const order = orderQuery.data?.data;
    const [downloading, setDownloading] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [noteError, setNoteError] = useState("");

    const handleAddNote = async () => {
        const trimmed = newNote.trim();
        if (!trimmed) return;
        setNoteError("");
        setNewNote("");
        try {
            await updateOrder.mutateAsync({ notes: [{ text: trimmed }] });
        } catch (err: unknown) {
            setNoteError(getApiErrorMessage(err, "Failed to save note"));
            setNewNote(trimmed);
        }
    };
    const handleDownload = async () => {
        setDownloading(true);
        try {
            await downloadInvoice(id);
            toast.success("Invoice downloaded");
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Failed to download invoice"));
        } finally {
            setDownloading(false);
        }
    };

    if (orderQuery.isLoading) {
        return (
            <div>
                <PageHeader title={`Order ${id}`} />
                <div className="p-6 text-sm text-slate">Loading order...</div>
            </div>
        );
    }

    if (orderQuery.isError || !order) {
        return (
            <div>
                <PageHeader title={`Order ${id}`} />
                <div className="p-6 text-sm text-error-brand">Failed to load order</div>
            </div>
        );
    }

    const notes = order.notes ?? [];
    const items = order.items ?? [];
    const serviceLabel = order.service?.name ?? (items.length === 1 ? items[0].name : `${items.length} services`);

    return (
        <div>
            <PageHeader
                title={`Order ${order.orderNumber || order.id}`}
                description={serviceLabel}
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading} className="uppercase tracking-wide">
                            <Download className="h-4 w-4 mr-1" /> {downloading ? "Downloading..." : "Invoice"}
                        </Button>
                        <Link href={`/admin/orders/${id}/edit`}>
                            <Button size="sm" className="bg-primary-brand hover:bg-primary-brand/90 text-white uppercase tracking-wide">
                                <Pencil className="h-4 w-4 mr-1" /> Edit
                            </Button>
                        </Link>
                    </div>
                }
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Col 1 */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Order Info</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <Row label="Order ID" value={order.orderNumber || order.id} mono />
                            <Row label="Service" value={serviceLabel} />
                            <Row label="Amount" value={formatINR(order.amount)} />
                            {order.amountPaid != null && <Row label="Paid" value={formatINR(order.amountPaid)} />}
                            {order.amountDue != null && <Row label="Due" value={formatINR(order.amountDue)} />}
                            {order.paymentState && <Row label="Payment State" value={String(order.paymentState).replace(/_/g, " ")} />}
                            <Row label="Date" value={formatDate(order.createdAt)} />
                            <div className="flex items-center justify-between pt-1 border-t">
                                <span className="text-slate">Order Status</span>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate">Payment Status</span>
                                <PaymentStatusBadge status={getAdminOrderPaymentStatus(order)} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-base">Customer Info</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <Row label="Name" value={order.customer.name} />
                            <Row label="Email" value={order.customer.email} />
                            {order.customer.phone && <Row label="Phone" value={order.customer.phone} />}
                            <div className="pt-2">
                                <Link href={`/admin/customers/${order.customer.id}`}>
                                    <Button variant="outline" size="sm" className="uppercase tracking-wide">View Customer Profile</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    {items.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle className="text-base">Line Items</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                {items.map((item) => (
                                    <div key={item.id} className="rounded-lg border border-hairline bg-surface p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-charcoal">{item.name}</p>
                                                <p className="mt-0.5 text-xs text-slate">Qty {item.quantity} x {formatINR(item.unitPrice)}</p>
                                            </div>
                                            <p className="font-medium text-ink">{formatINR(item.amount)}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                    <OrderPaymentsPanel orderId={order.id} orderAmount={order.amount} />
                </div>

                {/* Col 2 Notes */}
                <div className="space-y-4">
                <Card className="flex flex-col max-h-[calc(100vh-8rem)] overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <StickyNote className="h-4 w-4 text-slate" />
                            Notes
                            {notes.length > 0 && (
                                <span className="text-xs font-normal text-slate">({notes.length})</span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 min-h-0 space-y-3">
                        <div className="overflow-y-auto flex-1 min-h-0">
                            {notes.length === 0 ? (
                                <p className="text-sm text-slate text-center py-8">No notes yet. Add the first note below.</p>
                            ) : (
                                <div className="space-y-4">
                                    {groupNotesByDate(notes).map((group) => (
                                        <div key={group.key}>
                                            {group.label && (
                                                <div className="flex items-center gap-2 my-2">
                                                    <div className="flex-1 h-px bg-border" />
                                                    <span className="text-xs text-slate px-1 shrink-0">{group.label}</span>
                                                    <div className="flex-1 h-px bg-border" />
                                                </div>
                                            )}
                                            <ul className="space-y-2">
                                                {group.notes.map((note, i) => (
                                                    <li key={i} className={`${note.createdBy.name === "Admin" ? "bg-tint-sky" : "bg-muted/40"} w-fit rounded-lg px-3 py-2 text-sm space-y-0.5`}>
                                                        <p className="whitespace-pre-wrap leading-relaxed">{note.text}</p>
                                                        {(note.createdAt || note.createdBy.name) && (
                                                            <p className="text-xs text-slate">
                                                                {note.createdAt && <>{formatTime(note.createdAt)}</>}
                                                                {note.createdBy.name && <> · {note.createdBy.name}</>}
                                                            </p>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {noteError && <p className="text-xs text-error-brand">{noteError}</p>}
                        <div className="flex gap-2 pt-1 items-center">
                            <Textarea
                                placeholder="Add a note..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                className="resize-none text-sm min-h-15"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.shiftKey) {
                                        e.preventDefault();
                                        void handleAddNote();
                                    }
                                }}
                            />
                            <Button
                                size="icon"
                                className="shrink-0 bg-primary-brand hover:bg-primary-brand/90 text-white"
                                onClick={() => void handleAddNote()}
                                disabled={!newNote.trim() || updateOrder.isPending}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-slate">Press Enter for a new line. Shift+Enter adds the note.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base">Status History</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {historyQuery.isLoading ? (
                            <p className="text-slate">Loading history...</p>
                        ) : historyQuery.isError ? (
                            <p className="text-error-brand">Failed to load history</p>
                        ) : (historyQuery.data ?? []).length === 0 ? (
                            <p className="text-slate">No status history yet.</p>
                        ) : (
                            (historyQuery.data ?? []).map((entry) => (
                                <div key={entry.id} className="rounded-lg border border-hairline bg-surface p-3">
                                    <p className="font-medium text-charcoal">
                                        {entry.fromStatus ? `${entry.fromStatus} to ` : ""}{entry.toStatus}
                                    </p>
                                    <p className="mt-1 text-xs text-slate">
                                        {formatDate(entry.createdAt)} | {entry.actorName ?? entry.actorType ?? "System"}
                                    </p>
                                    {entry.reason && <p className="mt-1 text-xs text-graphite">{entry.reason}</p>}
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-slate">{label}</span>
            <span className={mono ? "font-mono text-xs text-right" : "font-medium text-right"}>{value}</span>
        </div>
    );
}
