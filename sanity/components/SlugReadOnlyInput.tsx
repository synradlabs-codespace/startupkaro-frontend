"use client";

import { useEffect } from "react";
import { set, PatchEvent, useFormValue } from "sanity";
import type { SlugInputProps } from "sanity";

export function SlugReadOnlyInput(props: SlugInputProps) {
    const { onChange, value } = props;
    const jobId = useFormValue(["jobId"]) as string | undefined;

    useEffect(() => {
        if (!jobId) return;
        const derived = jobId.toLowerCase().replace(/\s+/g, "-");
        if (value?.current !== derived) {
            onChange(PatchEvent.from(set({ _type: "slug", current: derived })));
        }
    }, [jobId]);

    return (
        <input
            readOnly
            value={value?.current ?? ""}
            placeholder="Auto-generated from Job ID"
            style={{
                width: "100%",
                background: "var(--input-bg, #f1f5f9)",
                border: "1px solid var(--card-border-color, #e2e8f0)",
                borderRadius: "4px",
                padding: "8px 12px",
                color: "var(--card-muted-fg-color, #94a3b8)",
                fontSize: "14px",
                cursor: "default",
            }}
        />
    );
}
