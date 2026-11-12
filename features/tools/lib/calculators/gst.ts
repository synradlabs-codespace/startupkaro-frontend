// features/tools/lib/calculators/gst.ts

export type GstMode = "excl" | "incl";
export type SupplyType = "intra" | "inter";

export interface GstResult {
    base: number;
    gst: number;
    total: number;
    cgst: number;
    sgst: number;
    igst: number;
}

/**
 * excl: `amount` is the pre-tax value; GST is added on top.
 * incl: `amount` already contains GST; it is backed out.
 * Intra-state supplies split GST equally into CGST + SGST; inter-state is IGST.
 */
export function calculateGst(amount: number, ratePct: number, mode: GstMode, supply: SupplyType): GstResult {
    const base = mode === "excl" ? amount : (amount * 100) / (100 + ratePct);
    const gst = mode === "excl" ? (amount * ratePct) / 100 : amount - base;
    const total = base + gst;
    return {
        base,
        gst,
        total,
        cgst: supply === "intra" ? gst / 2 : 0,
        sgst: supply === "intra" ? gst / 2 : 0,
        igst: supply === "inter" ? gst : 0,
    };
}
