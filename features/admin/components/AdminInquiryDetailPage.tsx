// features/admin/components/AdminInquiryDetailPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InquiryStatusBadge } from "@/components/custom/StatusBadge";
import { mockInquiries } from "@/lib/mock-data";
import { Trash2, CheckCircle2, StickyNote, Send } from "lucide-react";

export function AdminInquiryDetailPage({ id }: { id: string }) {
    const router = useRouter();
    const inquiry = mockInquiries.find((i) => i.id === id) ?? mockInquiries[0];

    const [status, setStatus] = useState<"unresolved" | "resolved">(inquiry.status);
    const [statusSaved, setStatusSaved] = useState(false);
    const [notes, setNotes] = useState<string[]>(inquiry.notes);
    const [newNote, setNewNote] = useState("");

    const handleDelete = () => {
        router.push("/admin/inquiries");
    };

    const handleSaveStatus = () => {
        setStatusSaved(true);
        setTimeout(() => setStatusSaved(false), 2000);
    };

    const handleAddNote = () => {
        const trimmed = newNote.trim();
        if (!trimmed) return;
        setNotes((prev) => [...prev, trimmed]);
        setNewNote("");
    };

    const statusChanged = status !== inquiry.status;

    return (
        <div>
            <PageHeader
                title="Inquiry Detail"
                action={
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                }
            />
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">

                    {/* Left — Inquiry Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Inquiry from {inquiry.name}</CardTitle>
                                <InquiryStatusBadge status={status} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            {[
                                { label: "Name", value: inquiry.name },
                                { label: "Email", value: inquiry.email },
                                { label: "Mobile", value: inquiry.mobile },
                                { label: "Date", value: inquiry.date },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between">
                                    <span className="text-muted-foreground">{label}</span>
                                    <span className="font-medium">{value}</span>
                                </div>
                            ))}
                            <div className="pt-2 border-t">
                                <p className="text-muted-foreground text-xs mb-2">Message</p>
                                <p className="text-sm leading-relaxed">{inquiry.message}</p>
                            </div>
                            <div className="pt-2 border-t space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Status</Label>
                                <Select value={status} onValueChange={(v) => setStatus(v as "unresolved" | "resolved")}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unresolved">Unresolved</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                                {(statusChanged || statusSaved) && (
                                    <Button
                                        size="sm"
                                        className="w-full mt-1 bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white"
                                        onClick={handleSaveStatus}
                                        disabled={statusSaved}
                                    >
                                        {statusSaved ? (
                                            <><CheckCircle2 className="h-4 w-4 mr-1" /> Saved</>
                                        ) : (
                                            "Save Status"
                                        )}
                                    </Button>
                                )}
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
