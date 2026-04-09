// features/admin/components/AdminOrderEditPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockOrders } from "@/lib/mock-data";
import { StickyNote, Send } from "lucide-react";

export function AdminOrderEditPage({ id }: { id: string }) {
    const router = useRouter();
    const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0];

    const [form, setForm] = useState({
        service: order.service,
        amount: String(order.amount),
        status: order.status,
        paymentStatus: order.paymentStatus,
    });
    const [notes, setNotes] = useState<string[]>([]);
    const [newNote, setNewNote] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/orders/${id}`);
    };

    const set = (key: keyof typeof form) => (value: string | null) => {
        setForm((f) => ({ ...f, [key]: value ?? "" }));
    };

    const handleAddNote = () => {
        const trimmed = newNote.trim();
        if (!trimmed) return;
        setNotes((prev) => [...prev, trimmed]);
        setNewNote("");
    };

    return (
        <div>
            <PageHeader title={`Edit Order ${id}`} description="Update order details" />
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">

                    {/* Left — Edit Form */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Edit Details</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Service</Label>
                                    <Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount (₹)</Label>
                                    <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Order Status</Label>
                                    <Select value={form.status} onValueChange={set("status")}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Status</Label>
                                    <Select value={form.paymentStatus} onValueChange={set("paymentStatus")}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="unpaid">Unpaid</SelectItem>
                                            <SelectItem value="partial">Partial</SelectItem>
                                            <SelectItem value="refunded">Refunded</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button type="submit" className="bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white">
                                        Save Changes
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Right — Notes */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <StickyNote className="h-4 w-4 text-muted-foreground" />
                                Notes
                                {notes.length > 0 && (
                                    <span className="text-xs font-normal text-muted-foreground">({notes.length})</span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1 space-y-3">
                            <div className="flex-1 min-h-[160px]">
                                {notes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">No notes yet. Add the first note below.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {notes.map((note, i) => (
                                            <li key={i} className="bg-muted/40 rounded-lg px-3 py-2 text-sm">
                                                <span className="leading-relaxed">{note}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Textarea
                                    placeholder="Add a note..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="resize-none text-sm min-h-[60px]"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddNote();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    className="shrink-0 self-end bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white"
                                    onClick={handleAddNote}
                                    disabled={!newNote.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Press Enter to add, Shift+Enter for new line.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
