// features/tools/data/tools.registry.ts
//
// SEO + editorial content for every free tool. Only tools that are actually
// built are listed here: the registry drives generateStaticParams, the
// sitemap, the hub page, the header menu and the admin analytics allowlist.
//
// Copy rules: no em/en dashes (sanitizeSeoText would rewrite them anyway),
// keyword-led H1s, plain language, numbers in worked examples must match the
// calculator output for the same inputs.

import type { ToolCategory, ToolDefinition } from "@/features/tools/types";
import { TAX_RULES_AS_OF, TAX_YEAR_LABEL, ASSESSMENT_YEAR_LABEL } from "./tax-rules";

const REVIEWED = TAX_RULES_AS_OF;

export const TOOL_CATEGORIES: ToolCategory[] = ["Tax", "Investment", "Loans", "Payroll", "Business"];

export const TOOLS: ToolDefinition[] = [
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "income-tax-calculator",
        name: "Income Tax Calculator",
        category: "Tax",
        shortDescription: `Compare old vs new regime tax for ${TAX_YEAR_LABEL}`,
        h1: `Income Tax Calculator ${TAX_YEAR_LABEL}: Old vs New Regime`,
        metaTitle: `Income Tax Calculator ${TAX_YEAR_LABEL} (${ASSESSMENT_YEAR_LABEL}), Old vs New Regime`,
        metaDescription: `Free income tax calculator for ${TAX_YEAR_LABEL}. Compare old and new regime tax instantly with the latest slabs, ₹75,000 standard deduction, 87A rebate up to ₹12 lakh, surcharge and cess.`,
        ogTitle: `Income Tax Calculator ${TAX_YEAR_LABEL}: Old vs New Regime`,
        keywords: [
            "income tax calculator",
            `income tax calculator ${TAX_YEAR_LABEL}`,
            "old vs new tax regime calculator",
            "new tax regime calculator",
            "tax calculator india",
            "salary tax calculator",
            "87A rebate calculator",
        ],
        intro: [
            `Work out your income tax for ${TAX_YEAR_LABEL} (${ASSESSMENT_YEAR_LABEL}) under both the new and the old regime in one go. Enter your annual income, pick your age group and add any deductions you claim. The calculator applies the current slabs, the standard deduction, the Section 87A rebate, surcharge with marginal relief and the 4% health and education cess.`,
            "The new regime is the default, but it is not always the cheaper one. If you claim large deductions such as HRA, home loan interest and the full 80C limit, the old regime can still win. This tool shows you the exact difference so you can choose with confidence before you file or declare to your employer.",
        ],
        formula: {
            heading: "How income tax is calculated",
            expression: "Tax = (Slab tax on taxable income − Rebate + Surcharge) × 1.04",
            legend: [
                { symbol: "Taxable income", meaning: "Gross income minus the standard deduction and any eligible deductions" },
                { symbol: "Slab tax", meaning: "Each slice of income taxed at its own slab rate" },
                { symbol: "Rebate", meaning: "Section 87A rebate for resident individuals below the income limit" },
                { symbol: "× 1.04", meaning: "4% health and education cess on tax plus surcharge" },
            ],
            explanation: [
                "New regime slabs: up to ₹4 lakh nil, ₹4 to 8 lakh 5%, ₹8 to 12 lakh 10%, ₹12 to 16 lakh 15%, ₹16 to 20 lakh 20%, ₹20 to 24 lakh 25% and above ₹24 lakh 30%. Salaried people get a ₹75,000 standard deduction, and the rebate makes tax nil when taxable income is ₹12 lakh or less. Just above ₹12 lakh, marginal relief caps your tax at the amount by which income crosses ₹12 lakh.",
                "Old regime slabs: nil up to ₹2.5 lakh (₹3 lakh for ages 60 to 80, ₹5 lakh for 80+), 5% up to ₹5 lakh, 20% from ₹5 to 10 lakh and 30% above ₹10 lakh. The standard deduction is ₹50,000 and the rebate applies up to ₹5 lakh of taxable income. Deductions like 80C (₹1.5 lakh), 80D, HRA and home loan interest (₹2 lakh) are allowed.",
                "Surcharge applies above ₹50 lakh (10%), ₹1 crore (15%) and ₹2 crore (25%). The old regime has a further 37% band above ₹5 crore. Marginal relief is applied automatically at each threshold.",
            ],
        },
        example: {
            heading: "Worked example: ₹15 lakh salary",
            steps: [
                "New regime: ₹15,00,000 minus ₹75,000 standard deduction gives taxable income of ₹14,25,000.",
                "Slab tax: ₹20,000 (4 to 8 lakh) + ₹40,000 (8 to 12 lakh) + ₹33,750 (15% on ₹2,25,000) = ₹93,750. Add 4% cess of ₹3,750 for a total of ₹97,500.",
                "Old regime with ₹1.5 lakh 80C and ₹25,000 80D: taxable income is ₹12,75,000, slab tax is ₹1,95,000 and with cess the total is ₹2,02,800.",
            ],
            conclusion: "The new regime saves ₹1,05,300 here. With heavier deductions (for example ₹2.4 lakh HRA plus ₹2 lakh home loan interest on an ₹18 lakh salary) the old regime can come out ahead, so always compare.",
        },
        sections: [
            {
                heading: "Old or new regime: which should you choose?",
                paragraphs: [
                    "A quick rule of thumb: if your total deductions (other than the standard deduction) are below roughly ₹4 to 5 lakh, the new regime is usually cheaper at most income levels. Above that, run the numbers, because the answer depends on your exact income and mix of deductions.",
                    "Salaried employees can switch regimes every year when filing their return. People with business or professional income can switch back from the new regime only once, so the choice matters more for freelancers and business owners.",
                ],
                bullets: [
                    "New regime suits people with few deductions and those who value simplicity.",
                    "Old regime suits people paying rent in a metro, repaying a home loan and maxing out 80C and 80D.",
                    "Employer NPS contributions and the standard deduction are the main deductions still allowed in the new regime.",
                ],
            },
        ],
        faqs: [
            { question: `What are the new regime tax slabs for ${TAX_YEAR_LABEL}?`, answer: "Up to ₹4 lakh: nil. ₹4 to 8 lakh: 5%. ₹8 to 12 lakh: 10%. ₹12 to 16 lakh: 15%. ₹16 to 20 lakh: 20%. ₹20 to 24 lakh: 25%. Above ₹24 lakh: 30%. Budget 2026 kept these slabs unchanged from the previous year." },
            { question: "Is income up to ₹12 lakh tax free in the new regime?", answer: "Yes, for resident individuals. The Section 87A rebate of up to ₹60,000 wipes out the tax when taxable income is ₹12 lakh or less. Salaried people also get the ₹75,000 standard deduction, so a salary of up to ₹12.75 lakh effectively pays no tax." },
            { question: "What happens if my income is slightly above ₹12 lakh?", answer: "Marginal relief applies. Your tax cannot be more than the amount by which your taxable income exceeds ₹12 lakh. For example, at ₹12.25 lakh taxable income the tax is capped at ₹25,000 plus cess, not the full slab tax." },
            { question: "Which deductions are allowed in the new tax regime?", answer: "Very few. The main ones are the ₹75,000 standard deduction for salaried people and pensioners, employer contributions to NPS, and family pension deduction. 80C, 80D, HRA and home loan interest on a self-occupied house are not allowed." },
            { question: "Can I switch between the old and new regime?", answer: "Salaried individuals without business income can choose either regime every year at the time of filing. Taxpayers with business or professional income can opt out of the new regime and return to it only once in their lifetime." },
            { question: "Does this calculator include surcharge and cess?", answer: "Yes. It applies surcharge above ₹50 lakh, ₹1 crore, ₹2 crore (and ₹5 crore in the old regime) with marginal relief, then adds 4% health and education cess on the total." },
            { question: "Is the result final for filing my return?", answer: "It is an accurate estimate for salary and regular income, but it does not cover capital gains taxed at special rates, agricultural income or losses carried forward. For a filing-ready computation, a StartupKaro tax expert can prepare and file your ITR." },
        ],
        related: ["gst-calculator", "sip-calculator", "home-loan-emi-calculator"],
        serviceCta: {
            eyebrow: "File with an expert",
            title: "Get your ITR filed right, first time",
            description: "Our CA team picks the better regime for you, claims every deduction you are entitled to and files your return on time.",
            href: "/services/income-tax-returns",
            label: "Explore ITR Filing",
        },
        lastReviewed: REVIEWED,
        assumptions: [
            `Rates for ${TAX_YEAR_LABEL} (${ASSESSMENT_YEAR_LABEL}) as per Budget 2026.`,
            "Resident individual taxpayer. Special-rate income such as capital gains is not included.",
            "80D is capped at ₹1 lakh and home loan interest at ₹2 lakh (self-occupied).",
        ],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "sip-calculator",
        name: "SIP Calculator",
        category: "Investment",
        shortDescription: "SIP returns with step-up and inflation adjustment",
        h1: "SIP Calculator: Estimate Your Mutual Fund SIP Returns",
        metaTitle: "SIP Calculator with Step-up and Inflation, Mutual Fund SIP Returns",
        metaDescription: "Free SIP calculator to estimate the maturity value of your monthly mutual fund SIP for up to 60 years. See total invested, returns, year-by-year growth and what your corpus is worth after inflation, with an optional annual step-up.",
        ogTitle: "SIP Calculator: See What Your Monthly SIP Can Grow To",
        keywords: ["sip calculator", "mutual fund sip calculator", "sip return calculator", "step up sip calculator", "sip calculator with inflation", "sip calculator india", "monthly sip calculator"],
        intro: [
            "A Systematic Investment Plan (SIP) lets you invest a fixed amount in a mutual fund every month. This SIP calculator shows what that habit can grow to: enter your monthly amount, the return you expect and how many years you plan to stay invested.",
            "Add an annual step-up to see the effect of raising your SIP as your income grows, and set your expected inflation to see what the final corpus is really worth in today's money. Plan for up to 60 years, so you can model a SIP started in your early twenties all the way to retirement.",
        ],
        formula: {
            heading: "How SIP returns are calculated",
            expression: "FV = P × [((1 + i)ⁿ − 1) ÷ i] × (1 + i)",
            legend: [
                { symbol: "FV", meaning: "Future value (maturity amount)" },
                { symbol: "P", meaning: "Monthly SIP amount" },
                { symbol: "i", meaning: "Monthly rate of return, i.e. annual rate ÷ 12 ÷ 100" },
                { symbol: "n", meaning: "Number of monthly instalments" },
                { symbol: "Real value", meaning: "FV ÷ (1 + inflation)^years, the corpus in today's money" },
            ],
            explanation: [
                "Each instalment is assumed to be invested at the start of the month and compounds monthly until the end of the period. This is the convention used by most Indian fund houses.",
                "With a step-up, the monthly amount rises by your chosen percentage after every 12 instalments, and the calculator simulates each month individually.",
                "Mutual fund returns are market-linked and not guaranteed. Use a conservative rate (for example 10 to 12% for diversified equity over the long term) for planning.",
            ],
        },
        example: {
            heading: "Worked example: ₹5,000 a month for 15 years",
            steps: [
                "Monthly SIP of ₹5,000 at an expected 12% annual return for 15 years means 180 instalments and a total investment of ₹9,00,000.",
                "The estimated maturity value is about ₹25.23 lakh, of which roughly ₹16.23 lakh is returns.",
                "Add a 10% annual step-up and you invest ₹19.06 lakh in total, but the corpus grows to about ₹43.42 lakh.",
                "At 6% inflation, that ₹43.42 lakh would buy what about ₹18.12 lakh buys today, which is why a goal-based plan should always be checked in today's money.",
            ],
            conclusion: "Time in the market does most of the work: in the later years, returns earned each year exceed the amount you invest.",
        },
        sections: [
            {
                heading: "Tips to get more from your SIP",
                paragraphs: ["Small changes in behaviour have a bigger impact than chasing the highest returning fund."],
                bullets: [
                    "Start early. Ten extra years of compounding can matter more than a higher monthly amount.",
                    "Step up your SIP every year in line with salary hikes.",
                    "Stay invested through market falls; SIPs buy more units when prices are low.",
                    "Equity fund gains above ₹1.25 lakh a year are taxed at 12.5% as long-term capital gains when held over a year.",
                ],
            },
        ],
        faqs: [
            { question: "How accurate is a SIP calculator?", answer: "The maths is exact for the return you enter, but actual mutual fund returns vary year to year. Treat the result as an estimate for planning, not a guaranteed amount." },
            { question: "What is a good expected return to use?", answer: "For long-term diversified equity funds many planners use 10 to 12% a year. Debt funds are typically 6 to 8%. Using a slightly lower rate keeps your plan conservative." },
            { question: "Why should I adjust SIP returns for inflation?", answer: "Prices rise every year, so a corpus that looks large in 20 or 30 years buys much less than the same amount today. At 6% inflation, money loses roughly half its value every 12 years. The inflation setting shows your result in today's money so you can plan real goals such as retirement or a child's education." },
            { question: "What is a step-up SIP?", answer: "A step-up (or top-up) SIP increases your monthly investment by a fixed percentage every year. It helps your investments keep pace with income growth and inflation." },
            { question: "Can I stop or pause a SIP?", answer: "Yes. Most fund houses let you pause, modify or stop a SIP at any time without penalty, although exit loads may apply if you redeem units within a short period." },
            { question: "How are SIP returns taxed?", answer: "For equity funds, gains on units held over 12 months are long-term and taxed at 12.5% above ₹1.25 lakh a year; shorter holdings are taxed at 20%. Each SIP instalment has its own holding period." },
            { question: "Is SIP better than a lump sum investment?", answer: "SIP spreads your purchases over time, which reduces the risk of investing everything at a market peak and builds discipline. A lump sum can earn more if markets rise steadily after you invest." },
        ],
        related: ["income-tax-calculator", "emi-calculator", "home-loan-emi-calculator"],
        serviceCta: {
            eyebrow: "Plan your taxes",
            title: "Make your investments work harder after tax",
            description: "Our tax planning experts help you structure investments, capital gains and deductions so more of your returns stay with you.",
            href: "/services/tax-planning",
            label: "Explore Tax Planning",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Instalments invested at the start of each month.", "Monthly compounding at the annual rate ÷ 12.", "Returns shown before tax and expense ratio."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "emi-calculator",
        name: "EMI Calculator",
        category: "Loans",
        shortDescription: "Monthly EMI, total interest and repayment schedule",
        h1: "EMI Calculator: Calculate Your Loan EMI Instantly",
        metaTitle: "EMI Calculator, Loan EMI Calculator with Amortisation Schedule",
        metaDescription: "Free EMI calculator for personal, business and education loans. Find your monthly EMI, total interest and total payment, with a year-wise amortisation schedule.",
        ogTitle: "EMI Calculator: Know Your Monthly Loan EMI",
        keywords: ["emi calculator", "loan emi calculator", "personal loan emi calculator", "business loan emi calculator", "emi calculation formula", "amortisation schedule"],
        intro: [
            "Planning to take a personal loan, business loan or education loan? This EMI calculator tells you exactly how much you will pay each month, how much of that goes towards interest and what the loan costs you in total.",
            "Move the sliders for loan amount, interest rate and tenure to compare offers from different lenders. The year-wise schedule shows how your outstanding balance falls over time.",
        ],
        formula: {
            heading: "EMI calculation formula",
            expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
            legend: [
                { symbol: "P", meaning: "Loan principal" },
                { symbol: "r", meaning: "Monthly interest rate, i.e. annual rate ÷ 12 ÷ 100" },
                { symbol: "n", meaning: "Tenure in months" },
            ],
            explanation: [
                "Indian lenders use the reducing balance method: interest each month is charged only on the outstanding principal. Early EMIs are mostly interest; later EMIs are mostly principal.",
                "A longer tenure lowers the EMI but increases the total interest you pay. A shorter tenure does the opposite.",
            ],
        },
        example: {
            heading: "Worked example: ₹5 lakh at 11% for 3 years",
            steps: [
                "P = ₹5,00,000, annual rate 11% so r = 0.009167, and n = 36 months.",
                "EMI comes to ₹16,369 per month.",
                "Over 36 months you pay ₹5,89,297 in total, of which ₹89,297 is interest.",
            ],
            conclusion: "Stretching the same loan to 5 years drops the EMI to about ₹10,871 but raises total interest to roughly ₹1.52 lakh.",
        },
        sections: [
            {
                heading: "Ways to reduce your EMI burden",
                paragraphs: ["Before you sign a loan agreement, compare the full cost, not just the EMI."],
                bullets: [
                    "Negotiate the interest rate; even 0.5% makes a noticeable difference on large loans.",
                    "Check processing fees and prepayment charges along with the rate.",
                    "Keep total EMIs under about 40% of your monthly take-home pay.",
                    "Prepay whenever you have surplus funds to cut interest and tenure.",
                ],
            },
        ],
        faqs: [
            { question: "What is an EMI?", answer: "An Equated Monthly Instalment is a fixed amount you pay the lender every month until the loan is repaid. Each EMI includes part interest and part principal." },
            { question: "Does a longer tenure reduce my total cost?", answer: "No. A longer tenure reduces each EMI, but you pay interest for more months, so the total interest goes up." },
            { question: "Are EMIs the same for flat rate and reducing rate loans?", answer: "No. A flat rate charges interest on the original principal for the whole tenure, so it is much costlier than the same headline reducing rate. This calculator uses the reducing balance method that banks use." },
            { question: "Can I prepay my loan?", answer: "Yes. For floating rate loans taken by individuals, RBI rules do not allow banks to charge foreclosure penalties. Fixed rate and business loans may carry prepayment charges, so check your agreement." },
            { question: "Is EMI calculated on a daily or monthly basis?", answer: "Most lenders compute EMI on a monthly reducing balance. Some calculate interest daily, which can make the actual EMI differ by a few rupees." },
        ],
        related: ["home-loan-emi-calculator", "car-loan-emi-calculator", "sip-calculator"],
        serviceCta: {
            eyebrow: "Funding for your business",
            title: "Need a business loan or working capital?",
            description: "Our finance team helps you prepare projections and documents and connects you with the right lenders.",
            href: "/services/fund-raising-loans",
            label: "Explore Loan Support",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Reducing balance method with monthly rests.", "Excludes processing fees, insurance and GST on charges."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "gst-calculator",
        name: "GST Calculator",
        category: "Tax",
        shortDescription: "Add or remove GST with CGST, SGST and IGST split",
        h1: "GST Calculator: Add or Remove GST Instantly",
        metaTitle: "GST Calculator India, Inclusive and Exclusive GST with CGST SGST IGST",
        metaDescription: "Free GST calculator for India. Add GST to a price or extract GST from an inclusive amount at 5%, 18% or 40%, with an instant CGST, SGST and IGST breakup.",
        ogTitle: "GST Calculator: Inclusive and Exclusive GST in Seconds",
        keywords: ["gst calculator", "gst calculator india", "inclusive gst calculator", "reverse gst calculator", "cgst sgst calculator", "igst calculator", "gst 18 percent calculator"],
        intro: [
            "Whether you are raising an invoice or checking a bill, this GST calculator gives you the taxable value, the GST amount and the final price in one step. Choose whether your amount is before tax (exclusive) or already includes tax (inclusive).",
            "Pick intra-state to split GST equally into CGST and SGST, or inter-state to see IGST. The calculator uses the simplified GST 2.0 rate structure of 5%, 18% and 40%, along with the special 3% and 0.25% rates.",
        ],
        formula: {
            heading: "GST calculation formulas",
            expression: "GST = Value × Rate ÷ 100   |   Base = Inclusive amount × 100 ÷ (100 + Rate)",
            legend: [
                { symbol: "Exclusive", meaning: "Final price = Value + GST" },
                { symbol: "Inclusive", meaning: "GST = Inclusive amount − Base" },
                { symbol: "Intra-state", meaning: "CGST = SGST = GST ÷ 2" },
                { symbol: "Inter-state", meaning: "IGST = full GST" },
            ],
            explanation: [
                "When the supplier and the place of supply are in the same state, the tax is shared equally between the Centre (CGST) and the State (SGST or UTGST). For supplies across states, and for exports and SEZ supplies, IGST applies.",
                "Since 22 September 2025, most goods and services fall into the 5% merit rate or the 18% standard rate, with 40% reserved for sin and luxury goods. Gold and silver attract 3% and rough diamonds 0.25%.",
            ],
        },
        example: {
            heading: "Worked example: ₹10,000 at 18%",
            steps: [
                "Exclusive: GST = ₹10,000 × 18 ÷ 100 = ₹1,800, so the invoice total is ₹11,800. Intra-state this is ₹900 CGST plus ₹900 SGST.",
                "Inclusive: for a bill of ₹11,800 including 18% GST, the base is ₹11,800 × 100 ÷ 118 = ₹10,000 and GST is ₹1,800.",
            ],
            conclusion: "Never calculate inclusive GST as 18% of the total; that overstates the tax. Always divide by (100 + rate).",
        },
        sections: [
            {
                heading: "Do you need GST registration?",
                paragraphs: [
                    "Registration is mandatory once your aggregate turnover crosses ₹40 lakh for goods (₹20 lakh in special category states) or ₹20 lakh for services (₹10 lakh in special category states). Inter-state suppliers of goods and most e-commerce sellers must register regardless of turnover.",
                    "Registering voluntarily can also help, since it lets you claim input tax credit and work with larger business customers who prefer GST-compliant vendors.",
                ],
            },
        ],
        faqs: [
            { question: "How do I calculate GST from an inclusive price?", answer: "Divide the inclusive price by (100 + GST rate) and multiply by 100 to get the base value. The difference between the inclusive price and the base is the GST. For ₹1,180 at 18%, the base is ₹1,000 and GST is ₹180." },
            { question: "What are the current GST rates?", answer: "After GST 2.0 (effective 22 September 2025) the main slabs are 5% and 18%, with 40% for sin and luxury goods. Special rates of 3% (gold, silver) and 0.25% (rough diamonds) continue, and many essentials are exempt." },
            { question: "When is CGST and SGST charged instead of IGST?", answer: "CGST plus SGST is charged on intra-state supplies, where the supplier and place of supply are in the same state. IGST is charged on inter-state supplies, imports and supplies to SEZs." },
            { question: "Is the 12% and 28% GST slab still applicable?", answer: "Most items earlier taxed at 12% moved to 5% and most items at 28% moved to 18% under GST 2.0. A few items moved to the new 40% rate. Check the latest rate notification for your HSN or SAC code." },
            { question: "Who needs to register for GST?", answer: "Businesses supplying goods with turnover above ₹40 lakh, service providers above ₹20 lakh (lower limits in special category states), inter-state suppliers of goods and most online sellers must register." },
        ],
        related: ["income-tax-calculator", "emi-calculator", "sip-calculator"],
        serviceCta: {
            eyebrow: "Get GST ready",
            title: "Register for GST in a few working days",
            description: "Our experts handle your GST application, documents and follow-ups so you can start billing with a valid GSTIN.",
            href: "/services/gst-registration",
            label: "Explore GST Registration",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Rates as per GST 2.0, effective 22 September 2025.", "Cess on specific goods is not included."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "home-loan-emi-calculator",
        name: "Home Loan EMI Calculator",
        category: "Loans",
        shortDescription: "Home loan EMI with yearly prepayment savings",
        h1: "Home Loan EMI Calculator with Prepayment",
        metaTitle: "Home Loan EMI Calculator with Prepayment, Interest Saved and Schedule",
        metaDescription: "Free home loan EMI calculator. Find your monthly EMI and total interest, and see how much interest and tenure you save with a yearly prepayment. Includes a year-wise schedule.",
        ogTitle: "Home Loan EMI Calculator: See What Prepaying Saves You",
        keywords: ["home loan emi calculator", "housing loan emi calculator", "home loan prepayment calculator", "home loan interest calculator", "home loan calculator india"],
        intro: [
            "A home loan is usually the largest loan you will ever take, and small changes in rate or tenure can change the total cost by lakhs. Use this home loan EMI calculator to see your monthly EMI, the total interest over the loan and a year-by-year repayment schedule.",
            "Add a yearly prepayment to see how much interest you save and how many years earlier you could become debt free. Paying even one extra EMI a year can shorten a 20 year loan significantly.",
        ],
        formula: {
            heading: "How home loan EMI and prepayment are calculated",
            expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
            legend: [
                { symbol: "P", meaning: "Loan amount" },
                { symbol: "r", meaning: "Monthly interest rate (annual rate ÷ 12 ÷ 100)" },
                { symbol: "n", meaning: "Tenure in months" },
                { symbol: "Prepayment", meaning: "Extra amount paid at the end of every loan year" },
            ],
            explanation: [
                "Each month, interest is charged on the outstanding balance and the rest of the EMI reduces the principal. A prepayment goes straight to principal.",
                "The calculator keeps your EMI unchanged and reduces the tenure, which is how most banks treat prepayments by default and which saves the most interest.",
            ],
        },
        example: {
            heading: "Worked example: ₹50 lakh at 8.5% for 20 years",
            steps: [
                "The EMI is ₹43,391 a month and total interest over 20 years is about ₹54.14 lakh, more than the loan itself.",
                "Prepay ₹1 lakh at the end of every year and the loan closes in 14 years instead of 20.",
                "Total interest falls to about ₹35.58 lakh, a saving of roughly ₹18.55 lakh.",
            ],
            conclusion: "Prepayments made in the early years save the most, because that is when the outstanding balance and interest are highest.",
        },
        sections: [
            {
                heading: "Home loan tax benefits",
                paragraphs: ["Under the old tax regime, home loan borrowers can claim two key deductions. Use our income tax calculator to see whether they make the old regime better for you."],
                bullets: [
                    "Up to ₹2 lakh a year on interest for a self-occupied property under Section 24(b).",
                    "Up to ₹1.5 lakh on principal repayment within the Section 80C limit.",
                    "Joint borrowers who are co-owners can each claim these limits.",
                ],
            },
        ],
        faqs: [
            { question: "Is it better to reduce EMI or tenure after a prepayment?", answer: "Reducing the tenure saves more interest. Reducing the EMI improves monthly cash flow. If you can comfortably afford the current EMI, choose a shorter tenure." },
            { question: "Are there charges for prepaying a home loan?", answer: "For floating rate home loans taken by individuals, RBI rules prohibit banks and NBFCs from charging prepayment or foreclosure penalties. Fixed rate loans may carry charges." },
            { question: "How much home loan can I get on my salary?", answer: "Lenders usually cap total EMIs at about 40 to 50% of your net monthly income. Use the EMI result here to check what fits that limit." },
            { question: "Does the interest rate stay the same for the whole tenure?", answer: "Most home loans in India are floating rate and linked to an external benchmark such as the repo rate, so the rate and EMI or tenure can change when the benchmark moves." },
            { question: "Can I claim home loan tax benefits in the new regime?", answer: "Not for a self-occupied house. Interest deduction under Section 24(b) and principal under 80C are available only in the old regime. For a let-out property, interest can be set off against rental income in both regimes." },
        ],
        related: ["emi-calculator", "income-tax-calculator", "car-loan-emi-calculator"],
        serviceCta: {
            eyebrow: "Save more on tax",
            title: "Claim your home loan benefits the right way",
            description: "Our tax experts work out whether the old or new regime saves you more and file your return with every eligible deduction.",
            href: "/services/tax-planning",
            label: "Explore Tax Planning",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Reducing balance with monthly rests.", "Prepayment applied at the end of each 12th month; EMI kept constant.", "Rate assumed fixed for the whole tenure."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "car-loan-emi-calculator",
        name: "Car Loan EMI Calculator",
        category: "Loans",
        shortDescription: "EMI on your new or used car after down payment",
        h1: "Car Loan EMI Calculator",
        metaTitle: "Car Loan EMI Calculator, Monthly EMI with Down Payment",
        metaDescription: "Free car loan EMI calculator. Enter the on-road price, down payment, interest rate and tenure to see your monthly EMI, total interest and the true cost of your car.",
        ogTitle: "Car Loan EMI Calculator: Know Your EMI Before You Buy",
        keywords: ["car loan emi calculator", "car loan calculator", "vehicle loan emi calculator", "auto loan emi calculator", "car emi calculator india"],
        intro: [
            "Buying a new or used car? Enter the on-road price and how much you can pay upfront, and this car loan EMI calculator works out the loan amount, your monthly EMI and the total interest you will pay.",
            "Compare tenures from 1 to 8 years to find the right balance between an affordable EMI and the overall cost of the car. A bigger down payment and shorter tenure keep interest costs low.",
        ],
        formula: {
            heading: "How car loan EMI is calculated",
            expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1),  where P = On-road price − Down payment",
            legend: [
                { symbol: "P", meaning: "Loan amount after down payment" },
                { symbol: "r", meaning: "Monthly interest rate (annual rate ÷ 12 ÷ 100)" },
                { symbol: "n", meaning: "Tenure in months" },
            ],
            explanation: [
                "Car loans in India usually finance 80 to 90% of the on-road price, which includes ex-showroom price, registration and insurance. The rest is your down payment.",
                "Rates for new cars are generally lower than for used cars, and many lenders offer up to 7 or 8 years for new vehicles.",
            ],
        },
        example: {
            heading: "Worked example: ₹10 lakh car with ₹2 lakh down",
            steps: [
                "Loan amount = ₹10,00,000 − ₹2,00,000 = ₹8,00,000.",
                "At 9% for 5 years, the EMI is ₹16,607 a month.",
                "Total interest is about ₹1.96 lakh, so the car effectively costs ₹11.96 lakh including your down payment.",
            ],
            conclusion: "Raising the down payment to ₹3 lakh drops the EMI to about ₹14,531 and saves around ₹24,500 in interest.",
        },
        sections: [
            {
                heading: "Buying a car through your business",
                paragraphs: [
                    "If the car is used for business, a company, LLP or proprietorship can claim depreciation and the interest on the car loan as business expenses, which reduces taxable profit. Input tax credit on motor vehicles is generally restricted under GST, so plan the purchase with your accountant.",
                ],
            },
        ],
        faqs: [
            { question: "How much down payment should I make on a car loan?", answer: "Aim for at least 20% of the on-road price. A larger down payment reduces the EMI and the total interest, and can help you get a better rate." },
            { question: "What is the maximum tenure for a car loan?", answer: "Most lenders offer up to 7 years for new cars, and some go to 8 years. Used car loans are usually shorter, often 3 to 5 years." },
            { question: "Is a longer car loan tenure a good idea?", answer: "A longer tenure lowers your EMI but increases total interest, and cars lose value quickly. Many experts suggest keeping car loans to 5 years or less." },
            { question: "Can I prepay my car loan?", answer: "Usually yes, but car loans are often fixed rate, so lenders may charge a foreclosure fee of 2 to 5% of the outstanding amount. Check your loan agreement." },
            { question: "Can a business claim tax benefits on a car loan?", answer: "Yes. When the car is used for business, the interest on the loan and depreciation on the car can be claimed as business expenses. Salaried individuals cannot claim car loan interest." },
        ],
        related: ["emi-calculator", "home-loan-emi-calculator", "sip-calculator"],
        serviceCta: {
            eyebrow: "Run your books right",
            title: "Claim business vehicle costs correctly",
            description: "Our bookkeeping team records loans, depreciation and expenses properly so your business pays only the tax it owes.",
            href: "/services/bookkeeping",
            label: "Explore Bookkeeping",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Reducing balance method with monthly rests.", "Excludes processing fee, insurance and foreclosure charges."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "salary-calculator",
        name: "Salary Calculator",
        category: "Payroll",
        shortDescription: "CTC to in-hand salary after PF, tax and deductions",
        h1: `Salary Calculator ${TAX_YEAR_LABEL}: CTC to In-hand Salary`,
        metaTitle: `Salary Calculator ${TAX_YEAR_LABEL}, CTC to In-hand Take Home Salary`,
        metaDescription: `Free in-hand salary calculator for India. Convert your CTC to monthly take-home pay after PF, gratuity, professional tax and income tax under the new or old regime for ${TAX_YEAR_LABEL}.`,
        ogTitle: "Salary Calculator: What Your CTC Really Pays You Each Month",
        keywords: ["salary calculator", "in hand salary calculator", "ctc to in hand calculator", "take home salary calculator", "salary calculator india", "net salary calculator"],
        intro: [
            "Your offer letter shows a CTC, but your bank account sees something smaller. This salary calculator converts your annual CTC into the monthly in-hand salary you actually receive, after employer and employee PF, gratuity, professional tax and income tax.",
            "Adjust the basic pay percentage, choose how your employer pays PF and pick the old or new tax regime to see the exact difference each choice makes. It is the fastest way to compare two job offers on what really matters: take-home pay.",
        ],
        formula: {
            heading: "How in-hand salary is calculated",
            expression: "In-hand = CTC − Employer PF − Gratuity − Employee PF − Professional tax − Income tax",
            legend: [
                { symbol: "Basic", meaning: "A % of CTC, usually 40 to 50%" },
                { symbol: "PF", meaning: "12% of basic, often capped at a ₹15,000 monthly wage" },
                { symbol: "Gratuity", meaning: "About 4.81% of basic, paid only when you leave after 5 years" },
                { symbol: "Income tax", meaning: `Slab tax for ${TAX_YEAR_LABEL} with standard deduction, rebate and cess` },
            ],
            explanation: [
                "CTC includes the employer's PF contribution and, at many companies, a gratuity provision. Neither reaches your bank account each month, so they are removed first to arrive at gross salary.",
                "From gross salary, your own 12% PF contribution, the professional tax charged by your state and your income tax are deducted. Under the old regime the calculator counts your PF towards Section 80C and allows the professional tax deduction.",
            ],
        },
        example: {
            heading: "Worked example: ₹12 lakh CTC",
            steps: [
                "Basic at 50% is ₹6,00,000. Employer PF on the ₹15,000 wage ceiling is ₹21,600 and the gratuity provision is ₹28,846, so gross salary is ₹11,49,554.",
                "Under the new regime, taxable income after the ₹75,000 standard deduction is ₹10,74,554, which is fully covered by the rebate. Income tax is nil.",
                "After ₹21,600 employee PF and ₹2,400 professional tax, take-home is ₹11,25,554 a year, or about ₹93,796 a month.",
            ],
            conclusion: "The same CTC under the old regime with no other deductions leaves about ₹82,082 a month, which is why choosing the regime matters.",
        },
        sections: [
            {
                heading: "Ways to increase your take-home salary",
                paragraphs: ["Structure matters as much as the headline number. Ask HR whether these options are available."],
                bullets: [
                    "Opt for PF on the ₹15,000 wage ceiling instead of full basic if you want more cash today.",
                    "Use employer NPS contributions, which are deductible even in the new regime.",
                    "Claim meal cards, fuel reimbursement or HRA if you choose the old regime.",
                    "Compare offers on in-hand pay and benefits, not CTC alone.",
                ],
            },
        ],
        faqs: [
            { question: "What is the difference between CTC and in-hand salary?", answer: "CTC is the total cost to the company, including employer PF, gratuity and sometimes insurance. In-hand salary is what you receive each month after employee PF, professional tax and income tax are deducted." },
            { question: "How much PF is deducted from salary?", answer: "Employees contribute 12% of basic salary to EPF, and the employer contributes a matching 12%. Many employers calculate this on a capped wage of ₹15,000 a month, which means ₹1,800 each per month." },
            { question: "Is gratuity part of my monthly salary?", answer: "No. Gratuity is shown in CTC by many companies but paid only when you leave after at least 5 years of service (1 year for fixed-term employees under the new labour codes)." },
            { question: "What is professional tax?", answer: "A state tax on employment, deducted by your employer. It is up to ₹2,500 a year in states that levy it, such as Maharashtra, Karnataka and West Bengal. Some states do not charge it." },
            { question: "Which tax regime gives higher in-hand salary?", answer: "For most salaried people with few deductions the new regime gives higher take-home pay, especially up to ₹12.75 lakh of salary where tax is nil. If you claim large HRA, home loan interest and 80C deductions, compare both using this tool." },
            { question: "Does basic salary have to be 50% of CTC?", answer: "Under the new labour codes, wages (basic plus DA) are generally expected to be at least 50% of total remuneration. A higher basic raises PF and gratuity, which lowers monthly take-home but increases retirement savings." },
        ],
        related: ["income-tax-calculator", "hra-calculator", "gratuity-calculator"],
        serviceCta: {
            eyebrow: "Plan your taxes",
            title: "Keep more of every salary credit",
            description: "Our tax experts help you choose the right regime, structure allowances and claim every deduction you are entitled to.",
            href: "/services/tax-planning",
            label: "Explore Tax Planning",
        },
        lastReviewed: REVIEWED,
        assumptions: [`Income tax for ${TAX_YEAR_LABEL}, resident individual below 60.`, "No other income or deductions beyond PF and professional tax.", "Gratuity provision at 15/26 of monthly basic per year."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "lumpsum-calculator",
        name: "Lumpsum Calculator",
        category: "Investment",
        shortDescription: "Growth of a one-time investment, adjusted for inflation",
        h1: "Lumpsum Calculator: One-time Investment Returns",
        metaTitle: "Lumpsum Calculator, Mutual Fund One-time Investment Return Calculator",
        metaDescription: "Free lumpsum calculator to estimate how a one-time mutual fund investment grows. See maturity value, returns and what the corpus is worth in today's money after inflation.",
        ogTitle: "Lumpsum Calculator: Watch a One-time Investment Grow",
        keywords: ["lumpsum calculator", "lump sum investment calculator", "mutual fund lumpsum calculator", "one time investment calculator", "compound interest calculator india"],
        intro: [
            "Received a bonus, an inheritance or the proceeds of a sale? This lumpsum calculator shows what a one-time investment can grow to over time at the return you expect.",
            "Set an expected inflation rate to see what the final amount is really worth in today's money, and plan for horizons of up to 60 years.",
        ],
        formula: {
            heading: "How lumpsum returns are calculated",
            expression: "FV = P × (1 + r)ⁿ   |   Real value = FV ÷ (1 + inflation)ⁿ",
            legend: [
                { symbol: "P", meaning: "Amount invested once" },
                { symbol: "r", meaning: "Expected annual return" },
                { symbol: "n", meaning: "Number of years" },
                { symbol: "Real value", meaning: "Maturity value in today's money" },
            ],
            explanation: [
                "Returns are compounded once a year. Actual mutual fund returns vary from year to year, so treat the result as a planning estimate.",
                "Investing a lump sum all at once can earn more than a SIP when markets rise steadily, but carries more timing risk. Many investors split a large amount across a few months through a systematic transfer plan.",
            ],
        },
        example: {
            heading: "Worked example: ₹5 lakh for 15 years",
            steps: [
                "₹5,00,000 invested once at an expected 12% a year for 15 years grows to about ₹27.37 lakh.",
                "Returns make up about ₹22.37 lakh of that amount.",
                "At 6% inflation, ₹27.37 lakh in 15 years buys what about ₹11.42 lakh buys today.",
            ],
            conclusion: "Your money still more than doubles in real terms, which is the outcome that matters for long-term goals.",
        },
        sections: [
            {
                heading: "Lumpsum or SIP?",
                paragraphs: ["Both are good ways to invest; the right choice depends on how you receive money and your comfort with volatility."],
                bullets: [
                    "Lumpsum suits windfalls and long horizons when you can stay invested through falls.",
                    "SIP suits regular monthly income and spreads out your entry price.",
                    "A systematic transfer plan (STP) from a liquid fund combines both approaches.",
                ],
            },
        ],
        faqs: [
            { question: "What is a lumpsum investment?", answer: "Investing the entire amount in one go, rather than in instalments. It is common for bonuses, maturity proceeds or sale proceeds." },
            { question: "What return should I assume?", answer: "Diversified equity funds have historically delivered 10 to 12% a year over long periods, though not every year. Debt funds are closer to 6 to 8%. A conservative assumption keeps your plan safe." },
            { question: "Why adjust for inflation?", answer: "Rising prices reduce what money can buy. At 6% inflation, prices roughly double every 12 years, so a large future amount is worth much less in today's terms." },
            { question: "How are lumpsum mutual fund gains taxed?", answer: "For equity funds held over 12 months, gains above ₹1.25 lakh a year are taxed at 12.5%. Shorter holdings are taxed at 20%. Debt fund gains are taxed at your slab rate." },
            { question: "Is lumpsum better than SIP?", answer: "If markets rise steadily after you invest, a lumpsum earns more because more money is invested for longer. If markets fall soon after, a SIP does better. Over long periods the difference narrows." },
        ],
        related: ["sip-calculator", "fd-calculator", "ppf-calculator"],
        serviceCta: {
            eyebrow: "Plan your taxes",
            title: "Invest windfalls the tax-smart way",
            description: "Our tax planning team helps you time and structure large investments so you keep more of the returns.",
            href: "/services/tax-planning",
            label: "Explore Tax Planning",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Annual compounding.", "Returns shown before tax and expense ratio.", "Inflation applied annually."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "fd-calculator",
        name: "FD Calculator",
        category: "Investment",
        shortDescription: "Fixed deposit maturity with compounding and inflation",
        h1: "FD Calculator: Fixed Deposit Maturity and Interest",
        metaTitle: "FD Calculator, Fixed Deposit Interest and Maturity Calculator",
        metaDescription: "Free FD calculator for bank and post office fixed deposits. Find your maturity amount, interest earned and effective yield with monthly, quarterly, half-yearly or yearly compounding.",
        ogTitle: "FD Calculator: Know Your Fixed Deposit Maturity Amount",
        keywords: ["fd calculator", "fixed deposit calculator", "fd interest calculator", "fd maturity calculator", "bank fd calculator", "cumulative fd calculator"],
        intro: [
            "Fixed deposits are India's favourite safe investment. Enter the deposit amount, interest rate and tenure to see exactly what your FD will pay at maturity, and how much of that is interest.",
            "Choose how often interest is compounded (most banks compound quarterly) and add an inflation rate to see whether your FD is really growing your money in today's terms.",
        ],
        formula: {
            heading: "How FD maturity is calculated",
            expression: "A = P × (1 + r ÷ n)^(n × t)",
            legend: [
                { symbol: "A", meaning: "Maturity amount" },
                { symbol: "P", meaning: "Deposit amount" },
                { symbol: "r", meaning: "Annual interest rate" },
                { symbol: "n", meaning: "Compounding periods a year (4 for quarterly)" },
                { symbol: "t", meaning: "Tenure in years" },
            ],
            explanation: [
                "This is a cumulative (reinvestment) FD where interest is added back to the deposit and earns interest itself. Payout FDs that pay interest monthly or quarterly earn slightly less.",
                "FD interest is fully taxable at your slab rate, and banks deduct TDS when interest exceeds the yearly threshold. Senior citizens usually get 0.25 to 0.50% higher rates.",
            ],
        },
        example: {
            heading: "Worked example: ₹5 lakh at 7% for 3 years",
            steps: [
                "With quarterly compounding, the effective annual yield is 7.19%.",
                "The deposit matures to ₹6,15,720, earning ₹1,15,720 in interest.",
                "At 6% inflation, that maturity amount is worth about ₹5,16,970 in today's money.",
            ],
            conclusion: "After inflation (and tax on interest), FDs mostly preserve value rather than grow it, which is why they suit safety and short-term goals.",
        },
        sections: [
            {
                heading: "Getting more from fixed deposits",
                paragraphs: ["A few simple choices can lift FD returns without adding risk."],
                bullets: [
                    "Compare rates across banks and small finance banks; deposits are insured up to ₹5 lakh per bank.",
                    "Ladder deposits across tenures so some money matures every year.",
                    "Submit Form 15G or 15H if your total income is below the taxable limit to avoid TDS.",
                    "Consider a 5-year tax saver FD for the 80C deduction under the old regime.",
                ],
            },
        ],
        faqs: [
            { question: "How is FD interest calculated?", answer: "Most banks compound interest quarterly. The maturity amount is P × (1 + r/4)^(4 × years). This calculator also supports monthly, half-yearly and yearly compounding." },
            { question: "Is FD interest taxable?", answer: "Yes. FD interest is added to your income and taxed at your slab rate. Banks deduct TDS when interest crosses the yearly threshold, which you can adjust when filing your return." },
            { question: "What is the effective yield of an FD?", answer: "The annualised return after compounding. At 7% compounded quarterly, the effective yield is about 7.19% a year." },
            { question: "Are fixed deposits safe?", answer: "Bank FDs are insured by DICGC up to ₹5 lakh per depositor per bank, covering principal and interest. Corporate FDs are not insured and carry credit risk." },
            { question: "Can I break an FD early?", answer: "Yes, but banks usually charge a penalty of 0.5 to 1% on the interest rate for premature withdrawal. Tax saver FDs cannot be broken before 5 years." },
        ],
        related: ["ppf-calculator", "lumpsum-calculator", "sip-calculator"],
        serviceCta: {
            eyebrow: "File with an expert",
            title: "Report interest income correctly",
            description: "FD interest and TDS often cause mismatch notices. Our CA team files your ITR with every income source reconciled.",
            href: "/services/income-tax-returns",
            label: "Explore ITR Filing",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Cumulative FD; interest reinvested.", "Interest shown before tax.", "Inflation applied annually."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "ppf-calculator",
        name: "PPF Calculator",
        category: "Investment",
        shortDescription: "Tax-free PPF maturity over 15 years and beyond",
        h1: "PPF Calculator: Public Provident Fund Maturity",
        metaTitle: "PPF Calculator 2026, Public Provident Fund Maturity at 7.1%",
        metaDescription: "Free PPF calculator at the current 7.1% rate. See your tax-free maturity amount for 15 years or with 5-year extensions, total interest and the value in today's money.",
        ogTitle: "PPF Calculator: Your Tax-free Corpus at 7.1%",
        keywords: ["ppf calculator", "public provident fund calculator", "ppf maturity calculator", "ppf interest calculator", "ppf calculator 7.1"],
        intro: [
            "The Public Provident Fund is a government-backed, tax-free savings scheme with a 15-year lock-in. This PPF calculator shows your maturity amount based on how much you deposit each year and the current interest rate.",
            "Extend your account in blocks of 5 years to see how the corpus snowballs, and set an inflation rate to understand its value in today's money.",
        ],
        formula: {
            heading: "How PPF maturity is calculated",
            expression: "F = P × [((1 + i)ⁿ − 1) ÷ i] × (1 + i)",
            legend: [
                { symbol: "F", meaning: "Maturity amount" },
                { symbol: "P", meaning: "Yearly deposit (₹500 to ₹1,50,000)" },
                { symbol: "i", meaning: "Annual interest rate (currently 7.1%)" },
                { symbol: "n", meaning: "Number of years (15, 20, 25 and so on)" },
            ],
            explanation: [
                "Interest is calculated monthly on the lowest balance between the 5th and the last day of the month, and credited once a year. Depositing before 5 April each year earns interest for the full year, which is what this calculator assumes.",
                "PPF has EEE tax status: deposits qualify for 80C under the old regime, and both interest and maturity are fully tax free.",
            ],
        },
        example: {
            heading: "Worked example: ₹1.5 lakh a year",
            steps: [
                "Depositing the maximum ₹1,50,000 every year for 15 years means ₹22.5 lakh invested.",
                "At 7.1%, the account matures to about ₹40.68 lakh, entirely tax free.",
                "Extending twice to 25 years grows it to about ₹1.03 crore on ₹37.5 lakh invested.",
            ],
            conclusion: "The extra 10 years more than doubles the corpus, which shows how compounding rewards patience.",
        },
        sections: [
            {
                heading: "PPF rules to know",
                paragraphs: ["A few rules decide how much you can get out of a PPF account."],
                bullets: [
                    "Minimum deposit ₹500 and maximum ₹1,50,000 per financial year.",
                    "Partial withdrawals are allowed from the 7th financial year.",
                    "Loans against PPF are available from the 3rd to the 6th year.",
                    "After 15 years you can extend in blocks of 5 years, with or without fresh deposits.",
                ],
            },
        ],
        faqs: [
            { question: "What is the current PPF interest rate?", answer: "7.1% a year for October to December 2026. The government reviews small savings rates every quarter, and the PPF rate has stayed at 7.1% since April 2020." },
            { question: "Is PPF interest tax free?", answer: "Yes. PPF has EEE status: deposits are deductible under 80C (old regime), and the interest and maturity amount are completely tax free under both regimes." },
            { question: "What is the maximum I can invest in PPF?", answer: "₹1,50,000 per financial year across all your PPF accounts, including accounts opened for minor children." },
            { question: "Can I withdraw from PPF before 15 years?", answer: "Partial withdrawals are allowed from the 7th financial year, and premature closure is allowed after 5 years for specific reasons such as medical treatment or higher education, with a 1% interest penalty." },
            { question: "What happens after PPF matures?", answer: "You can withdraw the full amount, or extend the account in blocks of 5 years with or without further deposits. The balance keeps earning tax-free interest." },
        ],
        related: ["fd-calculator", "sip-calculator", "income-tax-calculator"],
        serviceCta: {
            eyebrow: "Plan your taxes",
            title: "Build a tax-free retirement plan",
            description: "Our tax planning experts combine PPF, NPS and other options into a plan that suits your regime and goals.",
            href: "/services/tax-planning",
            label: "Explore Tax Planning",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Deposit made before 5 April each year.", "Rate assumed constant for the whole period.", "Inflation applied annually."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "hra-calculator",
        name: "HRA Calculator",
        category: "Payroll",
        shortDescription: `HRA tax exemption with the new 8-city metro rule`,
        h1: `HRA Calculator ${TAX_YEAR_LABEL}: House Rent Allowance Exemption`,
        metaTitle: `HRA Calculator ${TAX_YEAR_LABEL}, HRA Exemption with 8 Metro Cities`,
        metaDescription: `Free HRA exemption calculator for ${TAX_YEAR_LABEL}. Find the tax-free part of your house rent allowance, now with the 50% limit for Bengaluru, Hyderabad, Pune and Ahmedabad.`,
        ogTitle: "HRA Calculator: How Much of Your Rent Allowance Is Tax Free",
        keywords: ["hra calculator", "hra exemption calculator", "house rent allowance calculator", "hra exemption 2026", "hra metro cities"],
        intro: [
            "If you pay rent and receive HRA, part of that allowance can be tax free under the old tax regime. This HRA calculator works out the exempt and taxable portions using the three-way test in the Income-tax Rules.",
            `From ${TAX_YEAR_LABEL}, the 50% limit applies to eight cities: Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune and Ahmedabad. Everywhere else, the limit is 40% of salary.`,
        ],
        formula: {
            heading: "How HRA exemption is calculated",
            expression: "Exempt HRA = lowest of (Actual HRA, Rent − 10% of salary, 50% or 40% of salary)",
            legend: [
                { symbol: "Salary", meaning: "Basic pay plus dearness allowance (DA)" },
                { symbol: "Actual HRA", meaning: "HRA received from your employer" },
                { symbol: "Rent − 10%", meaning: "Rent paid minus 10% of salary" },
                { symbol: "50% / 40%", meaning: "50% in the 8 metro cities, 40% elsewhere" },
            ],
            explanation: [
                "All three amounts are worked out for the period you received HRA and paid rent. The lowest one is exempt; the rest of your HRA is taxed as salary.",
                "HRA exemption is available only in the old regime. Under the new regime, the full HRA is taxable. If you pay rent but receive no HRA, you may claim a separate, smaller deduction under the old regime.",
            ],
        },
        example: {
            heading: "Worked example: Bengaluru tenant",
            steps: [
                "Basic plus DA is ₹6,00,000 a year, HRA received is ₹3,00,000 and rent paid is ₹3,00,000.",
                "The three limits are ₹3,00,000 (actual HRA), ₹2,40,000 (rent minus 10% of salary) and ₹3,00,000 (50% of salary, since Bengaluru is now a metro).",
                "The lowest is ₹2,40,000, so that much is exempt and ₹60,000 is taxable.",
            ],
            conclusion: "Here the binding limit is rent, so paying more rent would raise the exemption until it hits ₹3,00,000.",
        },
        sections: [
            {
                heading: "Documents you need to claim HRA",
                paragraphs: ["Employers ask for proof before giving the exemption through payroll. Keep these ready."],
                bullets: [
                    "Rent receipts or a rent agreement for the period claimed.",
                    "Landlord's PAN if annual rent exceeds ₹1 lakh.",
                    "Details of your relationship with the landlord, now required under the new rules.",
                    "Rent paid to parents is allowed if they own the house and declare the rent as income.",
                ],
            },
        ],
        faqs: [
            { question: `Which cities count as metro for HRA in ${TAX_YEAR_LABEL}?`, answer: "Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune and Ahmedabad. Rule 279 of the Income-tax Rules, 2026 added the last four, so they now get the 50% limit instead of 40%." },
            { question: "Is HRA exemption available in the new tax regime?", answer: "No. HRA exemption can be claimed only under the old tax regime. In the new regime, the full HRA is added to taxable salary." },
            { question: "What counts as salary for HRA?", answer: "Basic salary plus dearness allowance (if it forms part of retirement benefits) plus commission based on a fixed percentage of turnover. Other allowances are excluded." },
            { question: "Can I claim HRA if I pay rent to my parents?", answer: "Yes, if your parents own the property, you actually pay the rent and they report it as income in their tax return. Keep bank transfer records and a rent agreement." },
            { question: "Can I claim HRA and home loan benefits together?", answer: "Yes, if you live in a rented house in one city and own a house elsewhere, or if your own house is far from your workplace. You need valid reasons and documents." },
        ],
        related: ["salary-calculator", "income-tax-calculator", "home-loan-emi-calculator"],
        serviceCta: {
            eyebrow: "File with an expert",
            title: "Claim HRA without the paperwork stress",
            description: "Our CA team checks your rent proofs, compares both regimes and files your return with the maximum eligible exemption.",
            href: "/services/income-tax-returns",
            label: "Explore ITR Filing",
        },
        lastReviewed: REVIEWED,
        assumptions: [`Rules for ${TAX_YEAR_LABEL} under the Income-tax Rules, 2026.`, "HRA received and rent paid for the same full year.", "Old tax regime."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "gratuity-calculator",
        name: "Gratuity Calculator",
        category: "Payroll",
        shortDescription: "Gratuity payable on exit and its tax-free limit",
        h1: "Gratuity Calculator: How Much Gratuity Will You Get?",
        metaTitle: "Gratuity Calculator India, Gratuity Amount and Tax Free Limit",
        metaDescription: "Free gratuity calculator for private sector employees. Find your gratuity amount from last drawn basic and years of service, with the ₹20 lakh tax-free limit and eligibility rules.",
        ogTitle: "Gratuity Calculator: Your Payout for Years of Service",
        keywords: ["gratuity calculator", "gratuity calculation formula", "gratuity calculator india", "gratuity eligibility", "gratuity tax exemption"],
        intro: [
            "Gratuity is a lump sum your employer pays when you leave after long service. This gratuity calculator works out the amount from your last drawn basic salary plus DA and your years of service.",
            "It also shows how much is tax free (up to ₹20 lakh for private sector employees) and whether you have completed the service needed to be eligible.",
        ],
        formula: {
            heading: "Gratuity calculation formula",
            expression: "Gratuity = 15 × Last drawn salary × Years of service ÷ 26",
            legend: [
                { symbol: "Salary", meaning: "Last drawn monthly basic plus DA" },
                { symbol: "15", meaning: "15 days' wages for each year of service" },
                { symbol: "26", meaning: "Working days in a month" },
                { symbol: "Not covered", meaning: "Divide by 30 and count only completed years" },
            ],
            explanation: [
                "For employers covered by the gratuity law (10 or more employees), a final part-year of 6 months or more counts as a full year. For employers not covered, gratuity is optional and usually uses 30 days and completed years only.",
                "Permanent employees need 5 years of continuous service. Under the Code on Social Security, fixed-term employees become eligible after 1 year. The 5-year condition does not apply on death or disablement.",
            ],
        },
        example: {
            heading: "Worked example: 10 years on ₹50,000 basic",
            steps: [
                "Last drawn basic plus DA is ₹50,000 a month and service is 10 years.",
                "Gratuity = 15 × ₹50,000 × 10 ÷ 26 = ₹2,88,462.",
                "The whole amount is tax free since it is below the ₹20 lakh limit.",
            ],
            conclusion: "Leaving at 4 years 8 months still counts as 5 years for a covered employer, giving ₹1,44,231.",
        },
        sections: [
            {
                heading: "Gratuity rules for employers",
                paragraphs: ["For startups and SMEs, gratuity is a real liability that grows every year. Plan for it early."],
                bullets: [
                    "The law applies once you have 10 or more employees on any day in the previous 12 months.",
                    "Gratuity must be paid within 30 days of it becoming payable.",
                    "Many companies fund the liability through a group gratuity scheme with an insurer.",
                    "Gratuity provision should be recorded in your books every year, not only on payout.",
                ],
            },
        ],
        faqs: [
            { question: "Who is eligible for gratuity?", answer: "Permanent employees who complete 5 years of continuous service with the same employer, and fixed-term employees after 1 year under the Code on Social Security. The service condition does not apply on death or disablement." },
            { question: "What salary is used to calculate gratuity?", answer: "Last drawn basic salary plus dearness allowance. Under the new labour codes, if allowances exceed 50% of total pay, the excess is added back to wages for gratuity." },
            { question: "Is gratuity taxable?", answer: "For private sector employees, gratuity up to ₹20 lakh in a lifetime is tax free. Any amount above that is taxed as salary. Government employees' gratuity is fully exempt." },
            { question: "Does 4 years and 8 months count as 5 years?", answer: "Courts have held that 4 years and 240 days of work counts as 5 years of continuous service for covered employers, and a final part-year of 6 months or more is rounded up." },
            { question: "Can my employer refuse to pay gratuity?", answer: "Only in limited cases, such as termination for misconduct causing damage or loss, to the extent of that loss. Otherwise unpaid gratuity can be claimed from the controlling authority with interest." },
        ],
        related: ["salary-calculator", "income-tax-calculator", "ppf-calculator"],
        serviceCta: {
            eyebrow: "Stay compliant",
            title: "Get your payroll and gratuity provisions right",
            description: "Our team keeps your books, provisions and labour compliance in order as your startup grows past 10 employees.",
            href: "/services/compliances",
            label: "Explore Compliance",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Private sector employee.", "Tax-free limit of ₹20 lakh per lifetime.", "Salary means basic plus DA."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "tds-calculator",
        name: "TDS Calculator",
        category: "Tax",
        shortDescription: "TDS on fees, rent, contracts and commission",
        h1: `TDS Calculator ${TAX_YEAR_LABEL}: Rates and Thresholds`,
        metaTitle: `TDS Calculator ${TAX_YEAR_LABEL}, TDS on Professional Fees, Rent, Contractor`,
        metaDescription: `Free TDS calculator for ${TAX_YEAR_LABEL}. Check whether TDS applies and how much to deduct on professional fees, technical services, contractor payments, commission and rent, with the latest thresholds.`,
        ogTitle: "TDS Calculator: How Much TDS to Deduct on a Payment",
        keywords: ["tds calculator", "tds on professional fees", "tds on rent calculator", "tds on contractor 194c", "tds rate chart 2026-27", "section 393 tds"],
        intro: [
            "Paying a freelancer, a contractor or your office landlord? This TDS calculator tells you whether tax must be deducted at source, at what rate and how much to pay the vendor after deduction.",
            `It uses the ${TAX_YEAR_LABEL} thresholds, including ₹50,000 a year for professional fees, ₹20,000 for commission and ₹50,000 a month for rent. Under the Income-tax Act, 2025 these provisions sit in section 393; the familiar old section numbers are shown for clarity.`,
        ],
        formula: {
            heading: "How TDS is calculated",
            expression: "TDS = Payment × Rate   (only when the threshold is crossed)",
            legend: [
                { symbol: "194J", meaning: "Professional fees 10%, technical services 2%, above ₹50,000 a year" },
                { symbol: "194C", meaning: "Contractors 1% (individual) or 2% (others), above ₹30,000 single or ₹1 lakh a year" },
                { symbol: "194H", meaning: "Commission 2%, above ₹20,000 a year" },
                { symbol: "194I", meaning: "Rent 10% (building) or 2% (machinery), above ₹50,000 a month" },
            ],
            explanation: [
                "TDS is deducted on the amount excluding GST when GST is shown separately on the invoice. Once the yearly threshold is crossed, TDS applies to the payment that crosses it and later payments.",
                "If the payee does not provide a valid PAN, TDS is deducted at 20% or the normal rate, whichever is higher. TDS must be deposited by the 7th of the following month (30 April for March) and reported in quarterly returns.",
            ],
        },
        example: {
            heading: "Worked example: ₹75,000 consultant fee",
            steps: [
                "You pay a consultant ₹75,000 in the year, above the ₹50,000 threshold for professional fees.",
                "TDS at 10% is ₹7,500, and you pay the consultant ₹67,500.",
                "If the consultant has no PAN, TDS rises to 20%, or ₹15,000.",
            ],
            conclusion: "Office rent of ₹60,000 a month attracts 10% TDS of ₹6,000 every month, since it crosses the ₹50,000 monthly limit.",
        },
        sections: [
            {
                heading: "TDS compliance checklist for small businesses",
                paragraphs: ["Missing TDS can disallow 30% of the expense and attract interest and penalties."],
                bullets: [
                    "Get a TAN before you make your first TDS deduction.",
                    "Collect PAN from every vendor at onboarding.",
                    "Deposit TDS monthly and file quarterly returns (Form 26Q) on time.",
                    "Issue TDS certificates to vendors after each quarter.",
                ],
            },
        ],
        faqs: [
            { question: "What is the TDS threshold for professional fees?", answer: `₹50,000 in a financial year per payee for ${TAX_YEAR_LABEL}. The rate is 10% for professional services and 2% for technical services, royalty for films and call centres.` },
            { question: "What is the TDS on rent?", answer: "10% for land, building or furniture and 2% for plant and machinery, when rent exceeds ₹50,000 in any month. The earlier test was ₹2.4 lakh a year." },
            { question: "When does TDS apply to contractors?", answer: "When a single payment exceeds ₹30,000 or total payments to the contractor exceed ₹1 lakh in the year. The rate is 1% for individuals and HUFs, and 2% for companies and firms." },
            { question: "Is TDS deducted on GST?", answer: "No, if the GST amount is shown separately on the invoice. TDS is then deducted only on the value excluding GST." },
            { question: "What happens if I don't deduct TDS?", answer: "You pay interest of 1% a month for not deducting and 1.5% a month for late deposit, 30% of the expense may be disallowed, and penalties can apply for late returns." },
            { question: "What changed with the Income-tax Act, 2025?", answer: "From 1 April 2026, most non-salary TDS provisions were consolidated into section 393 with new payment codes. The rates and thresholds for these common payments stayed the same." },
        ],
        related: ["gst-calculator", "income-tax-calculator", "break-even-calculator"],
        serviceCta: {
            eyebrow: "Stay compliant",
            title: "Let experts handle your TDS returns",
            description: "Our team deducts, deposits and files your TDS returns on time and issues certificates to your vendors.",
            href: "/services/tds-compliances",
            label: "Explore TDS Compliance",
        },
        lastReviewed: REVIEWED,
        assumptions: [`Thresholds and rates for ${TAX_YEAR_LABEL}.`, "Payee is a resident.", "Amounts exclude GST."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "break-even-calculator",
        name: "Break-even Calculator",
        category: "Business",
        shortDescription: "Units and revenue you need to cover your costs",
        h1: "Break-even Calculator: When Will Your Business Turn a Profit?",
        metaTitle: "Break-even Calculator, Break-even Point for Startups and Small Businesses",
        metaDescription: "Free break-even calculator for startups and SMEs. Find how many units and how much revenue you need each month to cover fixed and variable costs, with contribution margin and margin of safety.",
        ogTitle: "Break-even Calculator: Know Your Break-even Point",
        keywords: ["break even calculator", "break even point calculator", "break even analysis", "contribution margin calculator", "startup break even"],
        intro: [
            "Every founder needs one number: how much do we need to sell to stop losing money? This break-even calculator works it out from your monthly fixed costs, selling price and variable cost per unit.",
            "Add your expected monthly sales to see your profit or loss and your margin of safety, so you can test pricing and cost changes before you make them.",
        ],
        formula: {
            heading: "Break-even formula",
            expression: "Break-even units = Fixed costs ÷ (Price − Variable cost per unit)",
            legend: [
                { symbol: "Fixed costs", meaning: "Rent, salaries, software and other costs that don't change with sales" },
                { symbol: "Variable cost", meaning: "Materials, packaging, delivery and fees per unit" },
                { symbol: "Contribution", meaning: "Price minus variable cost: what each sale adds towards fixed costs" },
                { symbol: "Margin of safety", meaning: "How far sales can fall before you make a loss" },
            ],
            explanation: [
                "Below the break-even point you make a loss; above it, every extra unit adds its full contribution to profit.",
                "For service businesses, treat one billable hour, project or subscription as a unit, and count only costs that rise with each sale as variable.",
            ],
        },
        example: {
            heading: "Worked example: D2C product brand",
            steps: [
                "Fixed costs are ₹3,00,000 a month. Each unit sells for ₹1,000 and costs ₹600 to make and deliver.",
                "Contribution is ₹400 per unit, a 40% margin, so break-even is 3,00,000 ÷ 400 = 750 units a month (₹7.5 lakh revenue).",
                "At 1,000 units a month, profit is ₹1,00,000 and the margin of safety is 25%.",
            ],
            conclusion: "Raising the price by just ₹100 cuts break-even to 600 units, which shows how sensitive profit is to pricing.",
        },
        sections: [
            {
                heading: "How to lower your break-even point",
                paragraphs: ["There are only three levers, and small moves on each add up."],
                bullets: [
                    "Raise prices or move customers to higher-margin products.",
                    "Cut variable costs through better sourcing, packaging or logistics.",
                    "Keep fixed costs flexible early with shared offices and contract staff.",
                    "Track contribution margin monthly, not just revenue.",
                ],
            },
        ],
        faqs: [
            { question: "What is a break-even point?", answer: "The level of sales at which total revenue equals total costs, so you make neither a profit nor a loss." },
            { question: "What is contribution margin?", answer: "Selling price minus variable cost per unit. It is the amount each sale contributes towards fixed costs and, after break-even, towards profit." },
            { question: "How do I calculate break-even for a service business?", answer: "Define a unit such as an hour, a project or a monthly subscription. Use the price per unit and only the costs that increase with each unit as variable costs." },
            { question: "What is margin of safety?", answer: "The percentage by which expected sales exceed break-even sales. A 25% margin of safety means sales can fall by a quarter before you start losing money." },
            { question: "Should I include my own salary in fixed costs?", answer: "Yes. Including a fair founder salary gives a realistic picture of whether the business is truly sustainable." },
        ],
        related: ["gst-calculator", "equity-dilution-calculator", "emi-calculator"],
        serviceCta: {
            eyebrow: "Plan with numbers",
            title: "Build a financial model investors trust",
            description: "Our finance team builds projections, unit economics and break-even analysis for your pitch deck or bank loan.",
            href: "/services/financial-modelling",
            label: "Explore Financial Modelling",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Costs and prices in a single month.", "Variable cost constant per unit.", "Excludes taxes."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "equity-dilution-calculator",
        name: "Equity Dilution Calculator",
        category: "Business",
        shortDescription: "Founder ownership after a funding round and ESOP pool",
        h1: "Equity Dilution Calculator for Startup Fundraising",
        metaTitle: "Equity Dilution Calculator, Founder Ownership After Funding and ESOP",
        metaDescription: "Free startup equity dilution calculator. See how much founders own after raising a round, with pre-money and post-money valuation, investor stake and ESOP pool.",
        ogTitle: "Equity Dilution Calculator: What You Keep After Raising",
        keywords: ["equity dilution calculator", "startup dilution calculator", "post money valuation calculator", "esop pool calculator", "cap table calculator"],
        intro: [
            "Raising money means giving up part of your company. This equity dilution calculator shows exactly how much the founders will own after a priced round, based on the pre-money valuation, the amount raised and the ESOP pool investors ask for.",
            "Use it to compare term sheets, plan how much to raise and understand the real cost of a bigger option pool before you negotiate.",
        ],
        formula: {
            heading: "How dilution is calculated",
            expression: "Investor % = Investment ÷ (Pre-money + Investment)",
            legend: [
                { symbol: "Pre-money", meaning: "Company value agreed before the new money" },
                { symbol: "Post-money", meaning: "Pre-money plus the amount raised" },
                { symbol: "ESOP pool", meaning: "Shares reserved for employees, as a % of post-money" },
                { symbol: "Founders after", meaning: "Founders before × (100% − investor % − ESOP %)" },
            ],
            explanation: [
                "Investors usually require the ESOP pool to be created before their money comes in (the option pool shuffle), so the pool dilutes existing shareholders but not the new investor. This calculator follows that convention.",
                "A higher valuation or a smaller round reduces dilution. Negotiating the pool size down is often as valuable as negotiating the valuation up.",
            ],
        },
        example: {
            heading: "Worked example: ₹2 crore seed round",
            steps: [
                "Founders own 100% and raise ₹2 crore at a ₹8 crore pre-money valuation, so post-money is ₹10 crore.",
                "The investor gets 20%, and a 10% ESOP pool is created before the round.",
                "Founders end up with 70%, worth ₹7 crore on paper.",
            ],
            conclusion: "At a Series A raising ₹10 crore on ₹40 crore pre-money with a 5% pool top-up, founders holding 70% would drop to 52.5%.",
        },
        sections: [
            {
                heading: "Before you sign a term sheet",
                paragraphs: ["Dilution is only one part of a funding deal. Check these terms with your advisors too."],
                bullets: [
                    "Liquidation preference and whether it is participating.",
                    "Anti-dilution protection and how it is calculated.",
                    "Board seats, vetoes and founder vesting.",
                    "Whether valuation is on a fully diluted basis.",
                ],
            },
        ],
        faqs: [
            { question: "What is equity dilution?", answer: "The reduction in your percentage ownership when a company issues new shares to investors or employees. You own a smaller slice of a bigger company." },
            { question: "What is the difference between pre-money and post-money valuation?", answer: "Pre-money is the company's value before the investment; post-money is pre-money plus the new money. The investor's stake is the investment divided by post-money." },
            { question: "How big should the ESOP pool be?", answer: "Seed and Series A investors in India commonly ask for 10 to 15% of post-money. Size it to your actual hiring plan for the next 18 to 24 months rather than a round number." },
            { question: "How much dilution is normal in a seed round?", answer: "Founders typically give up 15 to 25% in a seed round, plus the ESOP pool. Raising more than you need increases dilution without improving your odds." },
            { question: "Do I need a valuation report to raise funds in India?", answer: "Yes. Issuing shares to investors requires a valuation report from a registered valuer or merchant banker under the Companies Act and FEMA (for foreign investors)." },
        ],
        related: ["break-even-calculator", "income-tax-calculator", "tds-calculator"],
        serviceCta: {
            eyebrow: "Raise with confidence",
            title: "Get your investor documents right",
            description: "Our legal team drafts and reviews term sheets, shareholder agreements and ESOP plans so you keep control as you grow.",
            href: "/services/investor-agreements",
            label: "Explore Investor Agreements",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Single priced equity round.", "ESOP pool created pre-money as % of post-money.", "No convertible notes or SAFEs converting."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "business-structure-calculator",
        name: "Business Structure Calculator",
        category: "Business",
        shortDescription: "Pvt Ltd vs LLP vs OPC vs Proprietorship: find your fit",
        h1: "Business Structure Calculator: Pvt Ltd vs LLP vs OPC vs Proprietorship",
        metaTitle: "Pvt Ltd vs LLP vs OPC vs Proprietorship, Business Structure Calculator",
        metaDescription: "Free business structure calculator for Indian founders. Answer 5 questions to compare Private Limited, LLP, OPC, Proprietorship and Partnership on liability, compliance, funding and tax.",
        ogTitle: "Pvt Ltd, LLP or Proprietorship? Find Your Best Fit",
        keywords: ["pvt ltd vs llp", "llp vs private limited", "which business structure is best in india", "proprietorship vs private limited", "opc vs pvt ltd", "business structure calculator"],
        intro: [
            "Choosing the right structure is the first big decision for any founder. This calculator scores Private Limited Company, LLP, One Person Company, Proprietorship and Partnership Firm against your plans: how many founders you have, whether you will raise funding or offer ESOPs, how much you need limited liability and what profit you expect.",
            "You get a ranked recommendation with the reasons behind it, the income tax each structure would pay on your profit and a side-by-side comparison of liability, compliance and audit rules.",
        ],
        formula: {
            heading: "How the recommendation is scored",
            expression: "Fit score = Compliance simplicity + Funding fit + ESOP fit + Liability protection + Tax efficiency",
            legend: [
                { symbol: "Funding fit", meaning: "Only companies can issue equity shares to investors" },
                { symbol: "Liability", meaning: "Pvt Ltd, OPC and LLP protect personal assets" },
                { symbol: "Compliance", meaning: "Proprietorships are simplest; companies have the most filings" },
                { symbol: "Tax", meaning: "Tax on your profit compared across structures" },
            ],
            explanation: [
                "Companies pay 25.17% (22% plus surcharge and cess under the concessional regime). LLPs and partnership firms pay 31.2%, or 34.94% above ₹1 crore. Proprietors pay individual slab rates, which are lower on smaller profits but rise to 30%.",
                "Company profits are taxed again as dividends when distributed, while LLP profit shares are tax free for partners. The score is a guide; your exact situation, industry licences and exit plans also matter.",
            ],
        },
        example: {
            heading: "Worked example: two founders planning to raise funds",
            steps: [
                "Two co-founders expect ₹20 lakh profit, want limited liability and plan to raise angel funding.",
                "Private Limited scores 71/100: it is the only structure investors can buy shares in. Tax on ₹20 lakh profit is about ₹5,03,360.",
                "An LLP scores 46/100 and would pay about ₹6,24,000 in tax, but it cannot issue equity to investors.",
            ],
            conclusion: "Without funding plans and as a solo founder with ₹8 lakh profit, a proprietorship comes out on top: simplest to run and no tax at that income under the new regime.",
        },
        sections: [
            {
                heading: "Can you change structure later?",
                paragraphs: ["Yes, but it costs time and money, so it pays to start right."],
                bullets: [
                    "A proprietorship or partnership can be converted into a company or LLP, but contracts, licences and bank accounts must move too.",
                    "An OPC can convert into a Private Limited Company when you add shareholders.",
                    "An LLP can convert into a company if you later decide to raise equity funding.",
                    "Startup India (DPIIT) recognition is available to companies, LLPs and registered partnerships, not proprietorships.",
                ],
            },
        ],
        faqs: [
            { question: "Which is better, Pvt Ltd or LLP?", answer: "A Private Limited Company is better if you plan to raise equity funding or offer ESOPs. An LLP is better for service businesses and professional firms that want limited liability with lower compliance and no plans to raise venture capital." },
            { question: "Can a single founder register a Private Limited Company?", answer: "A Private Limited Company needs at least two shareholders and two directors. A solo founder can choose a One Person Company instead, or add a family member as the second shareholder." },
            { question: "What is the cheapest business structure to run?", answer: "A sole proprietorship has the lowest compliance: there is no separate registration with the MCA, and the owner files a personal income tax return. The trade-off is unlimited personal liability." },
            { question: "Which structure pays the least tax?", answer: "It depends on profit. Below about ₹12 lakh, a proprietor may pay no tax under the new regime. At higher profits, a company's 25.17% rate is lower than the 30% top slab, though dividends are taxed again when profits are distributed." },
            { question: "Do investors invest in LLPs?", answer: "Rarely. Angel investors and VCs invest through equity shares, which only companies can issue. Most funded startups in India are Private Limited Companies." },
            { question: "Is audit mandatory for all companies?", answer: "Yes. Every company, including an OPC, needs a statutory audit each year. An LLP needs an audit only if its turnover exceeds ₹40 lakh or contribution exceeds ₹25 lakh." },
        ],
        related: ["equity-dilution-calculator", "break-even-calculator", "presumptive-tax-calculator"],
        serviceCta: {
            eyebrow: "Start the right way",
            title: "Register your business with experts",
            description: "From Private Limited to LLP and OPC, our CS team handles name approval, documents and incorporation end to end.",
            href: "/services/company-incorporation",
            label: "Explore Company Registration",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Company tax under the 22% concessional regime.", "Proprietor tax under the new regime, no other income.", "Scores are indicative, not legal advice."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "presumptive-tax-calculator",
        name: "Presumptive Tax Calculator",
        category: "Tax",
        shortDescription: "44AD / 44ADA tax for freelancers and small businesses",
        h1: `Presumptive Tax Calculator ${TAX_YEAR_LABEL}: 44AD and 44ADA`,
        metaTitle: `Presumptive Tax Calculator ${TAX_YEAR_LABEL}, 44AD and 44ADA for Freelancers`,
        metaDescription: `Free presumptive tax calculator for freelancers, consultants and small businesses. Work out deemed profit and tax under 44AD (6% or 8%) and 44ADA (50%), now section 58 of the Income-tax Act, 2025.`,
        ogTitle: "Presumptive Tax Calculator for Freelancers and Small Businesses",
        keywords: ["presumptive tax calculator", "44ada calculator", "44ad calculator", "freelancer tax calculator india", "section 58 presumptive taxation", "tax for consultants india"],
        intro: [
            "Freelancers, consultants and small business owners can skip detailed books and pay tax on a fixed share of their receipts. This presumptive tax calculator works out your deemed profit and income tax in seconds.",
            `Professionals pay tax on 50% of gross receipts (old section 44ADA). Businesses pay tax on 6% of digital and 8% of cash turnover (old section 44AD). From ${TAX_YEAR_LABEL}, both are part of section 58 of the Income-tax Act, 2025, with the same rates and limits.`,
        ],
        formula: {
            heading: "How presumptive tax is calculated",
            expression: "Deemed profit = 50% of receipts (professionals)   |   6% digital + 8% cash turnover (businesses)",
            legend: [
                { symbol: "Professionals", meaning: "Doctors, lawyers, CAs, engineers, architects, designers, IT consultants and similar" },
                { symbol: "Limit (profession)", meaning: "₹50 lakh, or ₹75 lakh if cash receipts are 5% or less" },
                { symbol: "Limit (business)", meaning: "₹2 crore, or ₹3 crore if cash receipts are 5% or less" },
                { symbol: "Tax", meaning: "Slab tax on the deemed profit, with rebate and cess" },
            ],
            explanation: [
                "No other expenses are deducted from the deemed profit. In return you don't need to maintain detailed books or get a tax audit, as long as you declare at least the presumptive rate.",
                "The whole year's advance tax is due in a single instalment by 15 March. LLPs and companies cannot use the scheme, and income from commission or brokerage does not qualify.",
            ],
        },
        example: {
            heading: "Worked example: ₹30 lakh freelance income",
            steps: [
                "A designer earns ₹30 lakh in fees, all through bank transfers.",
                "Deemed profit is 50%, or ₹15 lakh.",
                "Tax under the new regime is ₹1,09,200, just 3.64% of total receipts.",
            ],
            conclusion: "A small trader with ₹1.5 crore of fully digital turnover declares ₹9 lakh profit (6%) and, thanks to the rebate, pays no income tax.",
        },
        sections: [
            {
                heading: "Is presumptive tax right for you?",
                paragraphs: ["It works best when your real expenses are lower than the presumed share."],
                bullets: [
                    "Freelancers with few expenses usually save time and tax with the 50% rate.",
                    "If your actual profit is lower than the presumed rate, you can declare it only with books and a tax audit.",
                    "Once you opt out of 44AD, you generally cannot opt back in for five years.",
                    "GST registration is a separate test based on turnover, not on this scheme.",
                ],
            },
        ],
        faqs: [
            { question: "What is presumptive taxation?", answer: "A scheme where small businesses and professionals pay tax on a fixed percentage of their receipts instead of actual profit, without maintaining detailed books or getting a tax audit." },
            { question: "Who can use section 44ADA?", answer: "Resident individuals and partnership firms (not LLPs) in specified professions such as legal, medical, engineering, architecture, accountancy, technical consultancy, interior decoration and film work, with receipts up to ₹50 lakh, or ₹75 lakh if cash receipts are 5% or less." },
            { question: "What changed in the Income-tax Act, 2025?", answer: "From 1 April 2026, sections 44AD, 44ADA and 44AE are consolidated into section 58. The rates, limits and conditions stay the same." },
            { question: "Do I need to pay advance tax under presumptive taxation?", answer: "Yes, if your tax is ₹10,000 or more, but the entire amount can be paid in one instalment by 15 March." },
            { question: "Which ITR form do I file?", answer: "Resident individuals, HUFs and firms (other than LLPs) using the presumptive scheme with total income up to ₹50 lakh generally file ITR-4 (Sugam). Others file ITR-3." },
            { question: "Can I claim expenses under presumptive tax?", answer: "No. The presumed rate is treated as covering all business expenses. You cannot claim further deductions for rent, salaries or depreciation against that income." },
        ],
        related: ["advance-tax-calculator", "income-tax-calculator", "gst-calculator"],
        serviceCta: {
            eyebrow: "File with an expert",
            title: "Freelancer? File your ITR the easy way",
            description: "Our CA team checks whether the presumptive scheme saves you money, files ITR-4 and plans your advance tax.",
            href: "/services/income-tax-returns",
            label: "Explore ITR Filing",
        },
        lastReviewed: REVIEWED,
        assumptions: [`Rates and limits for ${TAX_YEAR_LABEL}.`, "Resident individual with no other income.", "No deductions other than those allowed in the chosen regime."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "advance-tax-calculator",
        name: "Advance Tax Calculator",
        category: "Tax",
        shortDescription: "Instalments, due dates and interest for late payment",
        h1: `Advance Tax Calculator ${TAX_YEAR_LABEL}: Instalments and Due Dates`,
        metaTitle: `Advance Tax Calculator ${TAX_YEAR_LABEL}, Due Dates and Interest 234B 234C`,
        metaDescription: `Free advance tax calculator for ${TAX_YEAR_LABEL}. Find how much advance tax to pay by 15 June, 15 September, 15 December and 15 March, and the interest if you miss an instalment.`,
        ogTitle: "Advance Tax Calculator: What to Pay and When",
        keywords: ["advance tax calculator", "advance tax due dates", "advance tax for freelancers", "234b 234c interest calculator", "advance tax instalments"],
        intro: [
            "If your tax for the year after TDS is ₹10,000 or more, you must pay it in advance instalments instead of all at once when filing. This calculator works out how much is due on each date and how much interest you would pay if you skip them.",
            "It is essential for freelancers, business owners, landlords and investors with capital gains, whose tax is not fully covered by TDS.",
        ],
        formula: {
            heading: "Advance tax instalments",
            expression: "15% by 15 June · 45% by 15 September · 75% by 15 December · 100% by 15 March",
            legend: [
                { symbol: "Net tax", meaning: "Tax on estimated income minus TDS and TCS" },
                { symbol: "Threshold", meaning: "Advance tax applies when net tax is ₹10,000 or more" },
                { symbol: "Presumptive", meaning: "100% in one instalment by 15 March" },
                { symbol: "Interest", meaning: "1% a month on shortfalls (old sections 234B and 234C)" },
            ],
            explanation: [
                "Percentages are cumulative: by 15 September you should have paid 45% of your annual tax in total, including the June instalment.",
                "If you miss instalments, simple interest at 1% a month applies on the shortfall for each period, plus 1% a month from April until you pay if less than 90% was paid by 31 March. Resident senior citizens without business income are exempt.",
            ],
        },
        example: {
            heading: "Worked example: ₹20 lakh consulting income",
            steps: [
                "A consultant expects ₹20 lakh income with ₹50,000 TDS. Tax under the new regime is ₹2,08,000, so advance tax due is ₹1,58,000.",
                "Instalments: ₹23,700 by 15 June, ₹47,400 by 15 September, ₹47,400 by 15 December and ₹39,500 by 15 March.",
                "Skipping all four would add about ₹7,979 of interest for missed instalments and ₹6,320 more by a 31 July filing.",
            ],
            conclusion: "Under the presumptive scheme, the same ₹1,58,000 can be paid in one go by 15 March.",
        },
        sections: [
            {
                heading: "How to pay advance tax",
                paragraphs: ["Advance tax is paid online through the income tax e-filing portal."],
                bullets: [
                    "Use challan ITNS 280 (minor head 100 for advance tax) on the e-pay tax service.",
                    "Keep the challan receipt; it is shown in Form 26AS and your AIS.",
                    "Re-estimate your income before each due date, especially after large gains.",
                    "Capital gains or windfalls after a due date only need tax in the remaining instalments.",
                ],
            },
        ],
        faqs: [
            { question: "Who needs to pay advance tax?", answer: "Anyone whose tax for the year, after TDS and TCS, is ₹10,000 or more. Salaried people usually don't, because TDS covers their tax, unless they have large other income such as rent, capital gains or freelance fees." },
            { question: `What are the advance tax due dates for ${TAX_YEAR_LABEL}?`, answer: "15 June (15%), 15 September (45%), 15 December (75%) and 15 March (100%), with percentages being cumulative. Presumptive taxpayers can pay 100% by 15 March." },
            { question: "What is the interest for late advance tax?", answer: "1% a month simple interest on the shortfall for each missed instalment (old section 234C), and 1% a month from 1 April until payment if less than 90% of tax was paid by 31 March (old section 234B)." },
            { question: "Are senior citizens exempt from advance tax?", answer: "Resident individuals aged 60 or more who have no income from business or profession do not need to pay advance tax. They can pay the full tax as self-assessment tax before filing." },
            { question: "What if I overpay advance tax?", answer: "The excess is refunded with interest after you file your return and it is processed." },
        ],
        related: ["presumptive-tax-calculator", "income-tax-calculator", "capital-gains-tax-calculator"],
        serviceCta: {
            eyebrow: "Never miss a due date",
            title: "Let us plan and pay your advance tax",
            description: "Our tax team estimates your income each quarter, calculates instalments and reminds you before every due date.",
            href: "/services/tax-planning",
            label: "Explore Tax Planning",
        },
        lastReviewed: REVIEWED,
        assumptions: [`Tax slabs for ${TAX_YEAR_LABEL}.`, "Interest assumes nothing was paid in advance and the return is filed by 31 July.", "Surcharge on incomes above ₹50 lakh is included in the slab tax."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "gst-late-fee-calculator",
        name: "GST Late Fee Calculator",
        category: "Tax",
        shortDescription: "Late fee and 18% interest on GSTR-3B and GSTR-1",
        h1: "GST Late Fee Calculator: GSTR-3B and GSTR-1 Penalty",
        metaTitle: "GST Late Fee Calculator 2026, GSTR-3B and GSTR-1 Late Fee and Interest",
        metaDescription: "Free GST late fee calculator. Find the late fee for GSTR-3B and GSTR-1 at ₹50 a day (₹20 for nil returns) with turnover-based caps, plus 18% interest on tax paid late.",
        ogTitle: "GST Late Fee Calculator: What a Late Return Costs",
        keywords: ["gst late fee calculator", "gstr 3b late fee", "gstr 1 late fee", "gst interest calculator", "gst penalty for late filing", "nil return late fee"],
        intro: [
            "Missed a GST return deadline? This GST late fee calculator tells you exactly what you owe: the late fee, split into CGST and SGST, and interest on any tax paid late.",
            "It uses the current rules: ₹50 a day (₹20 for nil returns), capped at ₹500 for nil returns and between ₹2,000 and ₹10,000 for others depending on turnover, plus 18% annual interest on the tax.",
        ],
        formula: {
            heading: "How the GST late fee is calculated",
            expression: "Late fee = min(₹50 × days late, cap)   |   Interest = Tax × 18% × days ÷ 365",
            legend: [
                { symbol: "₹50 a day", meaning: "₹25 CGST plus ₹25 SGST; ₹20 a day for nil returns" },
                { symbol: "Cap", meaning: "₹500 nil, ₹2,000 up to ₹1.5 crore, ₹5,000 up to ₹5 crore, ₹10,000 above" },
                { symbol: "Interest", meaning: "18% a year on net tax paid in cash after the due date" },
                { symbol: "Days late", meaning: "From the day after the due date to the filing date" },
            ],
            explanation: [
                "Turnover means aggregate turnover in the previous financial year. For inter-state supplies, the late fee is charged as IGST.",
                "Interest applies only to the cash portion of tax paid late, after setting off input tax credit, and is not capped. GSTR-1 attracts the late fee but no interest, because tax is paid through GSTR-3B.",
            ],
        },
        example: {
            heading: "Worked example: GSTR-3B filed 15 days late",
            steps: [
                "A business with under ₹1.5 crore turnover files GSTR-3B 15 days late with ₹50,000 tax payable.",
                "Late fee is ₹50 × 15 = ₹750 (₹375 CGST and ₹375 SGST).",
                "Interest is ₹50,000 × 18% × 15 ÷ 365 = ₹370, for a total of ₹1,120.",
            ],
            conclusion: "At 60 days late the fee hits its ₹2,000 cap, but interest keeps growing to ₹1,479, taking the total to ₹3,479.",
        },
        sections: [
            {
                heading: "Why late GST returns hurt more than the fee",
                paragraphs: ["The late fee is the smallest part of the cost."],
                bullets: [
                    "You cannot file the next return until the earlier one is filed.",
                    "Your customers may not get input tax credit, which damages relationships.",
                    "Repeated non-filing can lead to suspension or cancellation of GST registration.",
                    "E-way bill generation can be blocked after two missed returns.",
                ],
            },
        ],
        faqs: [
            { question: "What is the late fee for GSTR-3B?", answer: "₹50 a day (₹25 CGST and ₹25 SGST) for returns with tax payable and ₹20 a day for nil returns, capped at ₹500 for nil returns and ₹2,000, ₹5,000 or ₹10,000 for others depending on previous year turnover." },
            { question: "Is interest charged on late GST payment?", answer: "Yes. Interest at 18% a year is charged on the net tax paid in cash after the due date, calculated per day. It is not capped." },
            { question: "Is there a late fee for nil GST returns?", answer: "Yes. Nil GSTR-3B and GSTR-1 returns attract ₹20 a day (₹10 CGST and ₹10 SGST), capped at ₹500 per return." },
            { question: "Can the GST late fee be waived?", answer: "Only through a government notification, such as past amnesty schemes. Otherwise the late fee must be paid in cash and cannot be paid from input tax credit." },
            { question: "What is the due date for GSTR-3B?", answer: "The 20th of the following month for monthly filers. Quarterly (QRMP) filers have the 22nd or 24th of the month after the quarter, depending on their state." },
        ],
        related: ["gst-calculator", "tds-calculator", "advance-tax-calculator"],
        serviceCta: {
            eyebrow: "Stay compliant",
            title: "Never pay a GST late fee again",
            description: "Our team prepares and files your GSTR-1 and GSTR-3B on time every month, with reconciled input tax credit.",
            href: "/services/gst-compliances",
            label: "Explore GST Compliance",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Late fee caps under Notification 19/2021-CT.", "Interest at 18% a year, per day, on cash tax paid late.", "Intra-state supply (CGST and SGST)."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "capital-gains-tax-calculator",
        name: "Capital Gains Tax Calculator",
        category: "Tax",
        shortDescription: "LTCG and STCG on shares, mutual funds and property",
        h1: `Capital Gains Tax Calculator ${TAX_YEAR_LABEL}: Shares, Mutual Funds and Property`,
        metaTitle: `Capital Gains Tax Calculator ${TAX_YEAR_LABEL}, LTCG STCG with Indexation`,
        metaDescription: `Free capital gains tax calculator for ${TAX_YEAR_LABEL}. Work out LTCG and STCG on shares, equity mutual funds, property and gold, with the ₹1.25 lakh exemption and property indexation at CII 384.`,
        ogTitle: "Capital Gains Tax Calculator: How Much Tax on Your Profit",
        keywords: ["capital gains tax calculator", "ltcg calculator", "stcg calculator", "capital gains on property calculator", "indexation calculator", "cost inflation index 2026-27", "mutual fund capital gains tax"],
        intro: [
            "Sold shares, mutual funds, gold or property at a profit? This capital gains tax calculator works out whether your gain is short or long term and how much tax you owe under the current rules.",
            "For land and buildings bought before 23 July 2024, it compares 12.5% without indexation with 20% with indexation and applies the lower tax, using the FY 2026-27 cost inflation index of 384.",
        ],
        formula: {
            heading: "Capital gains tax rates",
            expression: "Gain = Sale price − Purchase cost   |   Tax = Gain × rate × 1.04",
            legend: [
                { symbol: "Listed equity", meaning: "Long term after 12 months: 12.5% above ₹1.25 lakh. Short term: 20%" },
                { symbol: "Property", meaning: "Long term after 24 months: 12.5%, or 20% with indexation if bought before 23 July 2024" },
                { symbol: "Gold / unlisted", meaning: "Long term after 24 months: 12.5%. Short term: your slab rate" },
                { symbol: "× 1.04", meaning: "4% health and education cess" },
            ],
            explanation: [
                "Indexation raises your purchase cost for inflation: indexed cost = cost × CII of the sale year ÷ CII of the purchase year. It is available only to resident individuals and HUFs selling land or buildings bought before 23 July 2024.",
                "Debt mutual funds bought after 1 April 2023 are always taxed at your slab rate, whatever the holding period. Long-term gains can also be exempted by reinvesting in a house or specified bonds, which this calculator does not include.",
            ],
        },
        example: {
            heading: "Worked example: shares and a flat",
            steps: [
                "Equity mutual funds bought for ₹5 lakh and sold for ₹8 lakh after 18 months: the ₹3 lakh gain is long term. After the ₹1.25 lakh exemption, tax is ₹22,750.",
                "Sold within 8 months instead, the same gain is short term and taxed at 20%: ₹62,400.",
                "A flat bought in FY 2015-16 for ₹40 lakh and sold for ₹90 lakh: indexed cost is ₹60.47 lakh, so tax with indexation is ₹6,14,173 against ₹6,50,000 without.",
            ],
            conclusion: "Holding equity for just over a year cut the tax by almost two-thirds in this example.",
        },
        sections: [
            {
                heading: "Ways to legally reduce capital gains tax",
                paragraphs: ["Timing and reinvestment make a big difference."],
                bullets: [
                    "Hold equity for more than 12 months to move from 20% to 12.5%.",
                    "Use the ₹1.25 lakh yearly LTCG exemption by booking gains every year (tax harvesting).",
                    "Set off capital losses against gains; unused losses carry forward for 8 years.",
                    "Reinvest long-term gains from property in a new house or specified bonds within the time limits.",
                ],
            },
        ],
        faqs: [
            { question: "What is the LTCG tax on shares and equity mutual funds?", answer: "12.5% on long-term gains above ₹1.25 lakh a year, for listed shares and equity funds held more than 12 months. Short-term gains are taxed at 20%." },
            { question: "Is indexation still available on property?", answer: "Only for land or buildings bought before 23 July 2024 by resident individuals and HUFs. They can pay the lower of 12.5% without indexation or 20% with indexation. For later purchases, it is 12.5% without indexation." },
            { question: "What is the cost inflation index for FY 2026-27?", answer: "384, notified by CBDT in Notification 85/2026. The previous year's index was 376." },
            { question: "How is gold taxed?", answer: "Physical gold, gold ETFs and gold funds held more than 24 months are taxed at 12.5% as long-term gains. Shorter holdings are taxed at your slab rate." },
            { question: "Can I set off capital losses?", answer: "Short-term losses can be set off against both short and long-term gains. Long-term losses can be set off only against long-term gains. Unused losses carry forward for 8 years if you file your return on time." },
            { question: "Do I need to pay advance tax on capital gains?", answer: "Yes, if your total tax after TDS crosses ₹10,000. Tax on a gain made mid-year can be paid in the remaining advance tax instalments without interest for the earlier ones." },
        ],
        related: ["advance-tax-calculator", "income-tax-calculator", "cagr-calculator"],
        serviceCta: {
            eyebrow: "File with an expert",
            title: "Report capital gains without errors",
            description: "Our CA team computes your gains, applies indexation and exemptions, and files the right ITR so you pay only what you owe.",
            href: "/services/income-tax-returns",
            label: "Explore ITR Filing",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Rates for transfers on or after 23 July 2024.", "Resident individual; 4% cess included, surcharge excluded.", "Reinvestment exemptions not included."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "nps-calculator",
        name: "NPS Calculator",
        category: "Investment",
        shortDescription: "Retirement corpus, lump sum and monthly pension",
        h1: "NPS Calculator: Retirement Corpus and Monthly Pension",
        metaTitle: "NPS Calculator 2026, National Pension System Corpus and Pension Calculator",
        metaDescription: "Free NPS calculator with the new exit rules. Estimate your retirement corpus, 80% lump sum, monthly pension from a 20% annuity and the value in today's money.",
        ogTitle: "NPS Calculator: Your Retirement Corpus and Pension",
        keywords: ["nps calculator", "national pension system calculator", "nps pension calculator", "nps return calculator", "retirement calculator india", "nps 80% lump sum"],
        intro: [
            "The National Pension System is one of the cheapest ways to build a retirement fund, with tax benefits even under the new regime when your employer contributes. This NPS calculator estimates your corpus at retirement, the lump sum you can withdraw and the monthly pension from the annuity.",
            "It follows the exit rules PFRDA amended in December 2025: non-government subscribers can take up to 80% as a lump sum and must use at least 20% to buy an annuity.",
        ],
        formula: {
            heading: "How NPS corpus and pension are calculated",
            expression: "Corpus = monthly SIP growth to retirement   |   Pension = Corpus × Annuity % × Annuity rate ÷ 12",
            legend: [
                { symbol: "Corpus", meaning: "Value of all contributions at retirement" },
                { symbol: "Lump sum", meaning: "Up to 80% of the corpus for non-government subscribers" },
                { symbol: "Annuity %", meaning: "At least 20% (40% for government employees)" },
                { symbol: "Annuity rate", meaning: "Yearly payout rate offered by insurers, typically 5.5 to 7%" },
            ],
            explanation: [
                "Contributions are assumed monthly with monthly compounding at the expected return. Actual NPS returns depend on your equity, corporate bond and government bond mix.",
                "If your corpus is ₹8 lakh or less, you can withdraw all of it. Generally 60% of the corpus is tax free when withdrawn; check the tax treatment of any amount above that before you exit.",
            ],
        },
        example: {
            heading: "Worked example: ₹5,000 a month from age 30",
            steps: [
                "Investing ₹5,000 a month from 30 to 60 at 10% builds a corpus of about ₹1.14 crore on ₹18 lakh invested.",
                "Withdrawing 80% gives a lump sum of about ₹91.17 lakh.",
                "The 20% annuity (₹22.79 lakh) at 6% pays about ₹11,397 a month for life.",
            ],
            conclusion: "At 6% inflation that pension is worth about ₹1,984 a month in today's money, so plan for more than the minimum annuity or other income.",
        },
        sections: [
            {
                heading: "NPS tax benefits",
                paragraphs: ["NPS is one of the few investments that still helps under the new tax regime."],
                bullets: [
                    "Employer contributions up to 14% of basic plus DA are deductible in the new regime.",
                    "Under the old regime, you can claim up to ₹1.5 lakh under 80C plus an extra ₹50,000 under 80CCD(1B).",
                    "Annuity income is taxed as income in the year you receive it.",
                    "Partial withdrawals for specific needs are allowed after 3 years.",
                ],
            },
        ],
        faqs: [
            { question: "How much can I withdraw from NPS at retirement?", answer: "Non-government subscribers can now withdraw up to 80% of the corpus as a lump sum and must use at least 20% to buy an annuity, under the PFRDA exit rules amended in December 2025. Government subscribers remain at 60% lump sum and 40% annuity." },
            { question: "What if my NPS corpus is small?", answer: "If the corpus is ₹8 lakh or less at normal exit, you can withdraw the entire amount. Between ₹8 lakh and ₹12 lakh, up to ₹6 lakh can be taken as a lump sum." },
            { question: "What return can I expect from NPS?", answer: "Equity-heavy NPS schemes have historically returned around 9 to 12% a year over long periods, and bond schemes around 7 to 9%. Returns are market-linked and not guaranteed." },
            { question: "Is NPS withdrawal tax free?", answer: "60% of the corpus withdrawn as a lump sum is tax free. The pension from the annuity is taxable as income. Check the treatment of any lump sum above 60% before withdrawing." },
            { question: "Can I continue NPS after 60?", answer: "Yes. You can defer exit and continue contributing up to age 75, and defer withdrawal up to 85 under the amended rules." },
        ],
        related: ["ppf-calculator", "sip-calculator", "salary-calculator"],
        serviceCta: {
            eyebrow: "Plan your taxes",
            title: "Use NPS to cut your tax bill",
            description: "Our tax planning experts help you and your employer structure NPS contributions for the maximum benefit under your regime.",
            href: "/services/tax-planning",
            label: "Explore Tax Planning",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Non-government subscriber under the amended exit rules.", "Constant return and annuity rate.", "Monthly contributions, monthly compounding."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "rd-calculator",
        name: "RD Calculator",
        category: "Investment",
        shortDescription: "Recurring deposit maturity with quarterly compounding",
        h1: "RD Calculator: Recurring Deposit Maturity and Interest",
        metaTitle: "RD Calculator, Recurring Deposit Interest and Maturity Calculator",
        metaDescription: "Free RD calculator for bank and post office recurring deposits. Find your maturity amount and interest earned with quarterly compounding, and the value in today's money.",
        ogTitle: "RD Calculator: See Your Recurring Deposit Grow",
        keywords: ["rd calculator", "recurring deposit calculator", "rd interest calculator", "rd maturity calculator", "post office rd calculator", "bank rd calculator"],
        intro: [
            "A recurring deposit lets you save a fixed amount every month and earn fixed deposit style interest on it. This RD calculator shows what your monthly deposits will grow to and how much interest you will earn.",
            "Banks compound RD interest quarterly. Add an inflation rate to see whether your savings are growing in real terms.",
        ],
        formula: {
            heading: "How RD maturity is calculated",
            expression: "Maturity = Σ R × (1 + r ÷ 4)^(months remaining ÷ 3)",
            legend: [
                { symbol: "R", meaning: "Monthly deposit" },
                { symbol: "r", meaning: "Annual interest rate" },
                { symbol: "÷ 4", meaning: "Quarterly compounding used by most banks" },
                { symbol: "Σ", meaning: "Sum over every monthly instalment" },
            ],
            explanation: [
                "Each instalment earns interest only for the months it stays in the account, so the first deposit earns the most and the last earns the least.",
                "RD interest is taxable at your slab rate, and banks deduct TDS when total interest crosses the yearly threshold. Missing instalments can attract a small penalty.",
            ],
        },
        example: {
            heading: "Worked example: ₹5,000 a month for 5 years",
            steps: [
                "Depositing ₹5,000 every month at 7% for 60 months means ₹3,00,000 deposited.",
                "The RD matures to about ₹3,59,664, earning ₹59,664 in interest.",
                "At 6% inflation, the maturity amount is worth about ₹2.69 lakh in today's money.",
            ],
            conclusion: "RDs build a savings habit with guaranteed returns, but for goals more than 5 years away, a SIP may grow faster.",
        },
        sections: [
            {
                heading: "RD vs SIP vs FD",
                paragraphs: ["All three suit different needs."],
                bullets: [
                    "RD: fixed, guaranteed returns on monthly savings. Good for short-term goals.",
                    "FD: fixed returns on a lump sum you already have.",
                    "SIP: market-linked, potentially higher returns on monthly savings for long-term goals.",
                ],
            },
        ],
        faqs: [
            { question: "How is RD interest calculated?", answer: "Most banks compound RD interest quarterly. Each monthly instalment earns interest from the month it is deposited until maturity, and the calculator adds them all up." },
            { question: "Is RD interest taxable?", answer: "Yes. RD interest is taxed at your slab rate as income from other sources. Banks deduct TDS when interest crosses the yearly threshold." },
            { question: "What happens if I miss an RD instalment?", answer: "Banks usually charge a small penalty per missed instalment, and several missed instalments can lead to premature closure." },
            { question: "Can I break an RD early?", answer: "Yes, most banks allow premature closure with a lower interest rate, typically 0.5 to 1% less than the contracted rate." },
            { question: "Which is better, RD or SIP?", answer: "RD gives guaranteed returns and suits short-term goals. SIPs in equity funds can earn more over 5 or more years but their returns are not guaranteed." },
        ],
        related: ["fd-calculator", "sip-calculator", "ppf-calculator"],
        serviceCta: {
            eyebrow: "Plan your taxes",
            title: "Keep more of the interest you earn",
            description: "Our tax experts help you plan deposits, submit Form 15G or 15H when eligible and avoid unnecessary TDS.",
            href: "/services/tax-planning",
            label: "Explore Tax Planning",
        },
        lastReviewed: REVIEWED,
        assumptions: ["Quarterly compounding.", "Deposits at the start of each month.", "Interest shown before tax."],
    },
    // ─────────────────────────────────────────────────────────────────────
    {
        slug: "cagr-calculator",
        name: "CAGR Calculator",
        category: "Investment",
        shortDescription: "CAGR for one-time investments and XIRR for SIPs",
        h1: "CAGR Calculator and SIP XIRR Calculator",
        metaTitle: "CAGR Calculator and XIRR Calculator for SIP Returns",
        metaDescription: "Free CAGR calculator to find the annual growth rate of any investment or business metric, plus an XIRR calculator for the true annualised return on your monthly SIP.",
        ogTitle: "CAGR and XIRR Calculator: Your Real Annual Return",
        keywords: ["cagr calculator", "xirr calculator", "sip xirr calculator", "compound annual growth rate", "annualised return calculator", "cagr formula"],
        intro: [
            "Absolute returns can mislead. A 150% gain sounds great, but over how many years? This CAGR calculator turns any start and end value into a compound annual growth rate, so you can compare investments, revenue or user growth fairly.",
            "Investing through a SIP? Switch to XIRR mode to find the true annualised return on your monthly instalments, which accounts for when each rupee was invested.",
        ],
        formula: {
            heading: "CAGR and XIRR formulas",
            expression: "CAGR = (End value ÷ Start value)^(1 ÷ years) − 1",
            legend: [
                { symbol: "CAGR", meaning: "Single annual rate that takes the start value to the end value" },
                { symbol: "XIRR", meaning: "Annual rate at which all SIP instalments grow to the current value" },
                { symbol: "Absolute return", meaning: "Total gain as a % of total invested, ignoring time" },
            ],
            explanation: [
                "CAGR suits one-time investments and business metrics measured at two points in time. It smooths out ups and downs in between.",
                "For SIPs, simple CAGR understates returns because later instalments were invested for less time. XIRR solves for the rate that makes the growth of every instalment equal to today's value.",
            ],
        },
        example: {
            heading: "Worked example: CAGR and XIRR",
            steps: [
                "An investment that grows from ₹1 lakh to ₹2.5 lakh in 5 years has a CAGR of 20.11%, although the absolute return is 150%.",
                "A SIP of ₹10,000 a month for 60 months (₹6 lakh invested) now worth ₹8 lakh has an XIRR of about 11.45%.",
                "The absolute return on that SIP is only 33.33%, which hides how well it actually performed.",
            ],
            conclusion: "Always compare investments on CAGR or XIRR, never on absolute return alone.",
        },
        sections: [
            {
                heading: "Using CAGR for your business",
                paragraphs: ["CAGR is the standard way investors read growth in a pitch deck."],
                bullets: [
                    "Report revenue, users or GMV growth as CAGR over 2 to 5 years.",
                    "Compare your growth with industry benchmarks on the same basis.",
                    "Be careful with very short periods; one strong quarter can inflate CAGR.",
                ],
            },
        ],
        faqs: [
            { question: "What is CAGR?", answer: "Compound annual growth rate is the steady yearly rate at which an investment would have grown from its starting value to its ending value over a period, assuming profits were reinvested." },
            { question: "What is the difference between CAGR and XIRR?", answer: "CAGR works for a single investment with one start and end value. XIRR handles multiple investments made at different times, such as SIP instalments, and gives one annualised return." },
            { question: "What is a good CAGR?", answer: "For long-term equity investments in India, 10 to 12% is generally considered good. For business revenue, early-stage startups often target 50% or more, while mature companies grow in single or low double digits." },
            { question: "Why is my SIP XIRR higher than its absolute return suggests?", answer: "Because many instalments were invested recently and have had little time to grow. XIRR accounts for this timing; absolute return does not." },
            { question: "Can CAGR be negative?", answer: "Yes. If the ending value is lower than the starting value, CAGR is negative, showing the average yearly decline." },
        ],
        related: ["sip-calculator", "lumpsum-calculator", "capital-gains-tax-calculator"],
        serviceCta: {
            eyebrow: "Plan with numbers",
            title: "Present your growth the way investors expect",
            description: "Our finance team builds financial models and pitch-ready metrics, from CAGR to unit economics.",
            href: "/services/financial-modelling",
            label: "Explore Financial Modelling",
        },
        lastReviewed: REVIEWED,
        assumptions: ["XIRR mode assumes equal monthly SIP instalments at the start of each month.", "Returns shown before tax."],
    },
];

export function getTool(slug: string): ToolDefinition | undefined {
    return TOOLS.find((tool) => tool.slug === slug);
}

export function getAllToolSlugs(): string[] {
    return TOOLS.map((tool) => tool.slug);
}

/** Featured in the header Company menu, in this order. */
export const FEATURED_TOOL_SLUGS = ["income-tax-calculator", "sip-calculator", "emi-calculator", "gst-calculator"];
