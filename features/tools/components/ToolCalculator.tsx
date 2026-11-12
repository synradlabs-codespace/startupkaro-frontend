"use client";

// Slug → calculator component. Also fires the "shared link opened" signal
// once when the page was loaded from a shared result link.

import { useEffect } from "react";
import type { ToolInputs } from "@/features/tools/lib/params";
import { trackSharedLinkOpened } from "@/features/tools/lib/track";
import { SipCalculator } from "./calculators/SipCalculator";
import { LoanCalculator } from "./calculators/LoanCalculator";
import { GstCalculator } from "./calculators/GstCalculator";
import { IncomeTaxCalculator } from "./calculators/IncomeTaxCalculator";
import { SavingsCalculator } from "./calculators/SavingsCalculator";
import { GratuityCalculator, HraCalculator, SalaryCalculator } from "./calculators/PayrollCalculators";
import { BreakEvenCalculator, EquityDilutionCalculator, TdsCalculator } from "./calculators/BusinessCalculators";
import { AdvanceTaxCalculator, CapitalGainsCalculator, GstLateFeeCalculator, PresumptiveTaxCalculator } from "./calculators/TaxPlanningCalculators";
import { BusinessStructureCalculator, CagrCalculator, NpsCalculator } from "./calculators/PlanningCalculators";

interface ToolCalculatorProps {
    slug: string;
    name: string;
    category: string;
    initial: ToolInputs;
    isShared: boolean;
}

export function ToolCalculator({ isShared, ...props }: ToolCalculatorProps) {
    useEffect(() => {
        if (!isShared) return;
        // PostHog initialises in a sibling effect; give it a moment.
        const id = window.setTimeout(() => trackSharedLinkOpened(props.slug), 1500);
        return () => window.clearTimeout(id);
    }, [isShared, props.slug]);

    switch (props.slug) {
        case "sip-calculator":
            return <SipCalculator {...props} />;
        case "emi-calculator":
            return <LoanCalculator {...props} variant="emi" />;
        case "home-loan-emi-calculator":
            return <LoanCalculator {...props} variant="home" />;
        case "car-loan-emi-calculator":
            return <LoanCalculator {...props} variant="car" />;
        case "gst-calculator":
            return <GstCalculator {...props} />;
        case "income-tax-calculator":
            return <IncomeTaxCalculator {...props} />;
        case "salary-calculator":
            return <SalaryCalculator {...props} />;
        case "lumpsum-calculator":
            return <SavingsCalculator {...props} variant="lumpsum" />;
        case "fd-calculator":
            return <SavingsCalculator {...props} variant="fd" />;
        case "ppf-calculator":
            return <SavingsCalculator {...props} variant="ppf" />;
        case "hra-calculator":
            return <HraCalculator {...props} />;
        case "gratuity-calculator":
            return <GratuityCalculator {...props} />;
        case "tds-calculator":
            return <TdsCalculator {...props} />;
        case "break-even-calculator":
            return <BreakEvenCalculator {...props} />;
        case "equity-dilution-calculator":
            return <EquityDilutionCalculator {...props} />;
        case "business-structure-calculator":
            return <BusinessStructureCalculator {...props} />;
        case "presumptive-tax-calculator":
            return <PresumptiveTaxCalculator {...props} />;
        case "advance-tax-calculator":
            return <AdvanceTaxCalculator {...props} />;
        case "gst-late-fee-calculator":
            return <GstLateFeeCalculator {...props} />;
        case "capital-gains-tax-calculator":
            return <CapitalGainsCalculator {...props} />;
        case "nps-calculator":
            return <NpsCalculator {...props} />;
        case "rd-calculator":
            return <SavingsCalculator {...props} variant="rd" />;
        case "cagr-calculator":
            return <CagrCalculator {...props} />;
        default:
            return null;
    }
}
