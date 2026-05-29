"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InquiryStatusBadge, formatInquiryStatus } from "@/components/custom/StatusBadge";
import { useDeleteInquiry, useInquiry, useUpdateInquiry } from "@/features/admin/hooks/useAdminInquiries";
import { formatDate, formatDateHeader, formatTime, getApiErrorMessage } from "@/features/admin/lib/format";
import type { InquiryStatus, Note } from "@/services/admin.service";
import { Trash2, CheckCircle2, StickyNote, Send } from "lucide-react";

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

export function AdminInquiryDetailPage({ id }: { id: string }) {
    const router = useRouter();
    const inquiryQuery = useInquiry(id);
    const updateInquiry = useUpdateInquiry(id);
    const deleteInquiry = useDeleteInquiry(id);
    const inquiry = inquiryQuery.data?.data;

    const [draftStatus, setDraftStatus] = useState<InquiryStatus | null>(null);
    const [statusSaved, setStatusSaved] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [noteError, setNoteError] = useState("");
    const [error, setError] = useState("");

    const handleDelete = async () => {
        if (!window.confirm("Delete this inquiry?")) return;
        await deleteInquiry.mutateAsync();
        router.push("/admin/inquiries");
    };

    const handleSaveStatus = async () => {
        setError("");
        setStatusSaved(false);

        try {
            await updateInquiry.mutateAsync({ status: draftStatus! });
            setStatusSaved(true);
            setDraftStatus(null);
            setTimeout(() => setStatusSaved(false), 2000);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to update inquiry"));
        }
    };

    const handleAddNote = async () => {
        const trimmed = newNote.trim();
        if (!trimmed) return;
        setNoteError("");
        setNewNote("");
        try {
            await updateInquiry.mutateAsync({ notes: [{ text: trimmed }] });
        } catch (err: unknown) {
            setNoteError(getApiErrorMessage(err, "Failed to save note"));
            setNewNote(trimmed);
        }
    };

    if (inquiryQuery.isLoading) {
        return (
            <div>
                <PageHeader title="Inquiry Detail" />
                <div className="p-6 text-sm text-slate">Loading inquiry...</div>
            </div>
        );
    }

    if (inquiryQuery.isError || !inquiry) {
        return (
            <div>
                <PageHeader title="Inquiry Detail" />
                <div className="p-6 text-sm text-error-brand">Failed to load inquiry</div>
            </div>
        );
    }

    const serverStatus: InquiryStatus = inquiry.status ?? "unresolved";
    const selectStatus = draftStatus ?? serverStatus;
    const allNotes = inquiry.notes ?? [];
    const statusChanged = draftStatus !== null && draftStatus !== serverStatus;

    return (
        <div>
            <PageHeader
                title="Inquiry Detail"
                action={
                    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteInquiry.isPending} className="uppercase tracking-wide">
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                }
            />
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="flex flex-col max-h-[calc(100vh-8rem)] overflow-hidden">
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4">
                                <CardTitle className="text-base">Inquiry from {inquiry.name}</CardTitle>
                                <InquiryStatusBadge status={serverStatus} />
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1 min-h-0 space-y-4 text-sm overflow-y-auto">
                            {[
                                { label: "Name", value: inquiry.name },
                                { label: "Email", value: inquiry.email },
                                { label: "Phone", value: inquiry.phone ?? "-" },
                                { label: "Subject", value: inquiry.subject },
                                { label: "Date", value: formatDate(inquiry.createdAt) },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between gap-4">
                                    <span className="text-slate">{label}</span>
                                    <span className="font-medium text-right">{value}</span>
                                </div>
                            ))}
                            <div className="pt-2 border-t">
                                <p className="text-slate text-xs mb-2">Message</p>
                                <p className="text-sm leading-relaxed">{inquiry.message}</p>
                            </div>
                            <div className="mt-auto pt-2 border-t space-y-1.5">
                                <Label className="text-xs text-slate">Status</Label>
                                <Select value={selectStatus ?? ""} onValueChange={(value) => setDraftStatus(value as InquiryStatus)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue>{formatInquiryStatus(selectStatus ?? "unresolved")}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unresolved">Unresolved</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                                {error && <p className="text-sm text-error-brand">{error}</p>}
                                {(statusChanged || statusSaved) && (
                                    <Button
                                        size="sm"
                                        className="w-full mt-1 bg-primary-brand hover:bg-primary-brand/90 text-white uppercase tracking-wide"
                                        onClick={handleSaveStatus}
                                        disabled={statusSaved || updateInquiry.isPending}
                                    >
                                        {statusSaved ? (
                                            <><CheckCircle2 className="h-4 w-4 mr-1" /> Saved</>
                                        ) : (
                                            updateInquiry.isPending ? "Saving..." : "Save Status"
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col max-h-[calc(100vh-8rem)] overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <StickyNote className="h-4 w-4 text-slate" />
                                Notes
                                {allNotes.length > 0 && (
                                    <span className="text-xs font-normal text-slate">({allNotes.length})</span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1 min-h-0 space-y-3">
                            <div className="overflow-y-auto flex-1 min-h-0">
                                {allNotes.length === 0 ? (
                                    <p className="text-sm text-slate text-center py-8">No notes yet. Add the first note below.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {groupNotesByDate(allNotes).map((group) => (
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
                                    disabled={!newNote.trim() || updateInquiry.isPending}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-slate">Press Enter for a new line. Shift+Enter adds the note.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
