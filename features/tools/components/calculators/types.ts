import type { ToolInputs } from "@/features/tools/lib/params";

export interface CalculatorProps {
    slug: string;
    name: string;
    category: string;
    /** Parsed + clamped inputs (from a shared link, or defaults). */
    initial: ToolInputs;
}
