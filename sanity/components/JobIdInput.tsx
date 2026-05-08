"use client";

import { set } from "sanity";
import type { StringInputProps } from "sanity";
import { RotateCcw } from "lucide-react";

export function JobIdInput(props: StringInputProps) {
    const { onChange, renderDefault } = props;

    const regenerate = () => {
        onChange(set(`SK-${String(Date.now()).slice(-6)}`));
    };

    return (
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>{renderDefault(props)}</div>
            <button
                type="button"
                onClick={regenerate}
                title="Generate a new Job ID"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "7px 12px",
                    marginTop: "1px",
                    border: "1px solid var(--card-border-color, #e2e8f0)",
                    borderRadius: "4px",
                    background: "var(--card-bg-color, #fff)",
                    color: "var(--card-muted-fg-color, #64748b)",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                }}
            >
                <RotateCcw size={12} />
                Regenerate
            </button>
        </div>
    );
}
