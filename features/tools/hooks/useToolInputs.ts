"use client";

// features/tools/hooks/useToolInputs.ts
//
// Calculator input state that mirrors itself into the URL query string, so
// the current URL is always a shareable link that reopens the same result.
// Uses history.replaceState (not router.replace) so typing never triggers a
// server round-trip or adds history entries.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { serializeInputs, type FieldSpec, type ToolInputs } from "@/features/tools/lib/params";
import { trackToolUsed } from "@/features/tools/lib/track";

const URL_SYNC_DELAY_MS = 400;
const USED_EVENT_DELAY_MS = 1200;

export function useToolInputs<T extends ToolInputs>(
    fields: readonly FieldSpec[],
    initial: T,
    meta: { slug: string; category: string }
) {
    const [inputs, setInputs] = useState<T>(initial);
    const touched = useRef(false);
    const usedTracked = useRef(false);

    const setField = useCallback((key: keyof T & string, value: T[keyof T]) => {
        touched.current = true;
        setInputs((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
    }, []);

    const query = useMemo(() => serializeInputs(fields, inputs), [fields, inputs]);

    // Keep the address bar in sync, but only after the visitor changes
    // something: a plain visit to /tools/<slug> keeps its clean canonical URL.
    useEffect(() => {
        if (!touched.current) return;
        const id = window.setTimeout(() => {
            const url = `${window.location.pathname}?${query}${window.location.hash}`;
            window.history.replaceState(window.history.state, "", url);
        }, URL_SYNC_DELAY_MS);
        return () => window.clearTimeout(id);
    }, [query]);

    // One "used" signal per page view, after the first deliberate change.
    useEffect(() => {
        if (!touched.current || usedTracked.current) return;
        const id = window.setTimeout(() => {
            usedTracked.current = true;
            trackToolUsed(meta.slug, meta.category);
        }, USED_EVENT_DELAY_MS);
        return () => window.clearTimeout(id);
    }, [query, meta.slug, meta.category]);

    const reset = useCallback((defaults: T) => {
        touched.current = true;
        setInputs(defaults);
    }, []);

    return { inputs, setField, query, reset };
}
