"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ToastTone = "success" | "error";

type ToastItem = {
    id: number;
    tone: ToastTone;
    title: string;
    description?: string;
};

type ToastInput = string | { title: string; description?: string };

type ToastContextValue = {
    success: (toast: ToastInput) => void;
    error: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const remove = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const add = useCallback((tone: ToastTone, input: ToastInput) => {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        const toast = typeof input === "string" ? { title: input } : input;
        setToasts((current) => [...current.slice(-3), { id, tone, ...toast }]);
        window.setTimeout(() => remove(id), tone === "error" ? 6200 : 4200);
    }, [remove]);

    const value = useMemo<ToastContextValue>(() => ({
        success: (toast) => add("success", toast),
        error: (toast) => add("error", toast),
    }), [add]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        role="status"
                        className="pointer-events-auto flex items-start gap-3 rounded-lg border border-hairline bg-canvas p-4 shadow-[0_10px_30px_rgba(26,26,26,0.14)]"
                    >
                        <div className={toast.tone === "success" ? "text-status-positive-fg" : "text-error-brand"}>
                            {toast.tone === "success" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-ink">{toast.title}</p>
                            {toast.description && <p className="mt-1 text-xs leading-relaxed text-slate">{toast.description}</p>}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Dismiss notification"
                            onClick={() => remove(toast.id)}
                            className="h-7 w-7 shrink-0 text-slate hover:bg-surface hover:text-charcoal"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used inside ToastProvider");
    }
    return context;
}

