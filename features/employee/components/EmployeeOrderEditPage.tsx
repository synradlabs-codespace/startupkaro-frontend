// features/employee/components/EmployeeOrderEditPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockOrders } from "@/lib/mock-data";
import { StickyNote, Send, CheckCircle2 } from "lucide-react";

export function EmployeeOrderEditPage({ id }: { id: string }) {
    const router = useRouter();
    const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0];

    const [status, setStatus] = useState(order.status);
    const [saved, setSaved] = useState(false);
    const [notes, setNotes] = useState<string[]>([]);
    const [newNote, setNewNote] = useState("");

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            router.push(`/employee/orders/${id}`);
        }, 1200);
    };

    const handleAddNote = () => {
        const trimmed = newNote.trim();
        if (!trimmed) return;
        setNotes((prev) => [...prev, trimmed]);
        setNewNote("");
    };

    const statusChanged = status !== order.status;

    return (
        <div>
            <PageHeader title={`Edit Order ${id}`} description="Update order status and add notes" />
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">

                    {/* Left — Status */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Order Status</CardTitle></CardHeader>
                        <CardContent className="space-y-5 text-sm">
                            {/* Read-only summary */}
                            {[
                                { label: "Order ID", value: order.id, mono: true },
                                { label: "Service", value: order.service },
                                { label: "Amount", value: `₹${order.amount.toLocaleString("en-IN")}` },
                                { label: "Customer", value: order.customer },
                            ].map(({ label, value, mono }) => (
                                <div key={label} className="flex justify-between">
                                    <span className="text-muted-foreground">{label}</span>
                                    <span className={mono ? "font-mono text-xs" : "font-medium"}>{value}</span>
                                </div>
                            ))}

                            <div className="pt-2 border-t space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Update Status</Label>
                                <Select value={status} onValueChange={(v) => setStatus(v ?? status)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    className="bg-[var(--color-indigo)] hover:bg-[var(--color-indigo)]/90 text-white"
                                    onClick={handleSave}
                                    disabled={saved || !statusChanged}
                                >
                                    {saved ? (
                                        <><CheckCircle2 className="h-4 w-4 mr-1" /> Saved</>
                                    ) : (
                                        "Save Status"
                                    )}
                                </Button>
                                <Button variant="outline" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                            </div>
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
                                    size="icon"
                                    className="shrink-0 self-end bg-[var(--color-indigo)] hover:bg-[var(--color-indigo)]/90 text-white"
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
