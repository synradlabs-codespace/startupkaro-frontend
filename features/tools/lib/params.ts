// features/tools/lib/params.ts
//
// Tiny input schema used to (a) parse + clamp calculator inputs from a shared
// URL, (b) serialise them back to short query params, and (c) drive slider
// bounds in the UI. The same parser runs on the server page, the client
// calculator and the edge result-card route, so the three can never disagree.

export interface NumberFieldSpec {
    type: "number";
    key: string;
    min: number;
    max: number;
    step: number;
    default: number;
}

export interface EnumFieldSpec<T extends string = string> {
    type: "enum";
    key: string;
    options: readonly T[];
    default: T;
}

export type FieldSpec = NumberFieldSpec | EnumFieldSpec;

export type RawParams =
    | URLSearchParams
    | Record<string, string | string[] | undefined>;

export type ToolInputs = Record<string, number | string>;

function readRaw(raw: RawParams, key: string): string | undefined {
    if (raw instanceof URLSearchParams) return raw.get(key) ?? undefined;
    const value = raw[key];
    return Array.isArray(value) ? value[0] : value;
}

export function clampNumber(value: number, spec: NumberFieldSpec): number {
    if (!Number.isFinite(value)) return spec.default;
    const clamped = Math.min(spec.max, Math.max(spec.min, value));
    // Snap to the step grid so "12.3333333" from a hand-edited URL stays tidy.
    const decimals = (String(spec.step).split(".")[1] ?? "").length;
    return Number(clamped.toFixed(decimals));
}

/** Parse untrusted query params into a complete, clamped inputs object. */
export function parseInputs(fields: readonly FieldSpec[], raw: RawParams): ToolInputs {
    const out: ToolInputs = {};
    for (const spec of fields) {
        const value = readRaw(raw, spec.key);
        if (spec.type === "number") {
            out[spec.key] = value === undefined || value.trim() === "" ? spec.default : clampNumber(Number(value), spec);
        } else {
            out[spec.key] = value !== undefined && (spec.options as readonly string[]).includes(value) ? value : spec.default;
        }
    }
    return out;
}

export function defaultInputs(fields: readonly FieldSpec[]): ToolInputs {
    return parseInputs(fields, {});
}

/** True when the URL carries at least one recognised input, i.e. it is a shared result link. */
export function hasInputParams(fields: readonly FieldSpec[], raw: RawParams): boolean {
    return fields.some((spec) => {
        const value = readRaw(raw, spec.key);
        return value !== undefined && value !== "";
    });
}

/** Serialise inputs to a query string (no leading "?"). Keys are emitted in schema order. */
export function serializeInputs(fields: readonly FieldSpec[], inputs: ToolInputs): string {
    const params = new URLSearchParams();
    for (const spec of fields) {
        const value = inputs[spec.key];
        if (value !== undefined) params.set(spec.key, String(value));
    }
    return params.toString();
}
