// features/articles/data/articles.data.ts

import type { Article, ArticleAuthor } from "./types";

const priya: ArticleAuthor = {
    name: "Priya Sharma",
    role: "Chartered Accountant",
    bio: "Priya is a practising CA with over 12 years of experience in startup taxation, GST advisory, and financial compliance. She has worked with more than 200 early-stage companies across India.",
};

const rahul: ArticleAuthor = {
    name: "Rahul Gupta",
    role: "Tax Analyst",
    bio: "Rahul specialises in direct and indirect tax planning for SMEs and startups. He holds a master's degree in taxation and has been a consultant for several high-growth companies.",
};

const meera: ArticleAuthor = {
    name: "Meera Nair",
    role: "Corporate Lawyer",
    bio: "Meera is a corporate and commercial lawyer with expertise in company law, startup structuring, and venture transactions. She has advised founders and investors across seed to Series B rounds.",
};

const arun: ArticleAuthor = {
    name: "Arun Singh",
    role: "Business Consultant",
    bio: "Arun brings 15 years of experience helping Indian SMEs scale operations, improve governance, and raise institutional capital. He has mentored over 300 founders through accelerator programmes.",
};

const kavita: ArticleAuthor = {
    name: "Kavita Patel",
    role: "Finance Expert",
    bio: "Kavita is a financial strategist specialising in startup economics, fundraising readiness, and cash-flow management. She is a CFA charterholder and advises growth-stage companies on financial modelling.",
};

const dev: ArticleAuthor = {
    name: "Dev Malhotra",
    role: "Startup Advisor",
    bio: "Dev has co-founded three startups and advises early-stage founders on DPIIT recognition, government schemes, and go-to-market strategy in the Indian regulatory environment.",
};

export const MOCK_ARTICLES: Article[] = [
    // --- TAX (3) ---
    {
        slug: "gst-filing-guide-for-startups",
        title: "Understanding GST Filing for Startups in India",
        excerpt: "GST compliance can feel overwhelming for first-time founders. This guide breaks down filing frequencies, deadlines, and common mistakes startups make in their first year.",
        category: "Tax",
        author: rahul,
        publishedAt: "2026-03-10T00:00:00.000Z",
        readTimeMinutes: 7,
        tags: ["GST", "Filing", "Startups"],
        body: [
            { type: "paragraph", text: "The Goods and Services Tax regime unified India's indirect tax structure, but for startups, it introduced a new layer of monthly or quarterly compliance. Getting this wrong in year one can lead to notices, penalties, and blocked input tax credits." },
            { type: "heading", level: 2, text: "Which return do you need to file?" },
            { type: "list", style: "bullet", items: ["GSTR-1: Outward supply details — monthly if turnover > ₹5 crore, quarterly otherwise", "GSTR-3B: Summary return with tax payment — linked to GSTR-1 frequency", "GSTR-9: Annual return — mandatory above ₹2 crore turnover"] },
            { type: "quote", text: "More than 60% of GST notices sent to startups are for mismatches between GSTR-1 and GSTR-3B. A monthly reconciliation prevents almost all of them.", cite: "Rahul Gupta, Tax Analyst" },
            { type: "heading", level: 2, text: "The input tax credit trap" },
            { type: "paragraph", text: "ITC can only be claimed if your vendor has filed GSTR-1 and it reflects in your GSTR-2B. Many startups discover mismatches at year-end. Reconcile with your vendors quarterly, not annually." },
        ],
    },
    {
        slug: "income-tax-benefits-small-business",
        title: "Income Tax Benefits Every Small Business Owner Should Know",
        excerpt: "From presumptive taxation to Section 80-IC deductions, Indian tax law offers significant relief to small businesses — most of which go unclaimed due to lack of awareness.",
        category: "Tax",
        author: priya,
        publishedAt: "2026-02-18T00:00:00.000Z",
        readTimeMinutes: 6,
        tags: ["Income Tax", "Deductions", "SME"],
        body: [
            { type: "paragraph", text: "Indian income tax law is layered with provisions designed to reduce the burden on small businesses. The challenge is that most founders only discover them during an audit, not at the planning stage." },
            { type: "heading", level: 2, text: "Presumptive taxation under Section 44AD" },
            { type: "paragraph", text: "If your business turnover is below ₹3 crore (and digital receipts exceed 95%), you can declare 8% of turnover as profit without maintaining detailed books. This dramatically reduces compliance costs for early-stage businesses." },
            { type: "heading", level: 2, text: "Key deductions you're likely missing" },
            { type: "list", style: "bullet", items: ["Section 32: Accelerated depreciation on plant and machinery at 15%–40%", "Section 35D: Amortise preliminary expenses (incorporation costs) over 5 years", "Section 80JJAA: 30% additional deduction on wages paid to new employees for 3 years", "Section 43B: Payments to MSME vendors deductible only on actual payment (not accrual)"] },
        ],
    },
    {
        slug: "tds-compliance-guide-for-founders",
        title: "TDS Compliance: A Practical Guide for Founders",
        excerpt: "TDS is one of the most common pain points for early-stage companies. Missing a deduction or a deposit deadline invites interest, penalties, and sometimes disallowance of the expense entirely.",
        category: "Tax",
        author: rahul,
        publishedAt: "2026-01-22T00:00:00.000Z",
        readTimeMinutes: 8,
        tags: ["TDS", "Compliance", "Founders"],
        body: [
            { type: "paragraph", text: "Tax Deducted at Source is a withholding mechanism — you deduct tax when making certain payments and deposit it with the government. Fail to deduct, and the entire expense can be disallowed. Deduct but forget to deposit, and you owe 1.5% interest per month." },
            { type: "heading", level: 2, text: "The payments that trigger TDS" },
            { type: "list", style: "bullet", items: ["Salary (Section 192) — deduct at applicable slab rates", "Professional fees > ₹30,000/year (Section 194J) — 10%", "Rent > ₹2.4 lakh/year (Section 194I) — 10% for land/building", "Contractor payments > ₹30,000 per transaction (Section 194C) — 1–2%"] },
            { type: "quote", text: "The most common mistake I see is founders not deducting TDS on consultant invoices because the amount 'seems small'. The threshold is per vendor, per year — not per invoice.", cite: "Rahul Gupta" },
            { type: "heading", level: 2, text: "Deposit and filing deadlines" },
            { type: "paragraph", text: "TDS deducted must be deposited by the 7th of the following month (except March, where the deadline extends to April 30). Quarterly TDS returns (Form 24Q for salary, 26Q for others) are due within 31 days after each quarter ends." },
        ],
    },

    // --- LEGAL (2) ---
    {
        slug: "choosing-business-structure-india",
        title: "Choosing the Right Business Structure: Pvt Ltd vs LLP vs OPC",
        excerpt: "The entity you choose at incorporation shapes everything from how you raise money to how much tax you pay. Here's a plain-English comparison of the three most popular structures for Indian startups.",
        category: "Legal",
        author: meera,
        publishedAt: "2026-03-05T00:00:00.000Z",
        readTimeMinutes: 9,
        tags: ["Incorporation", "Structure", "Legal"],
        body: [
            { type: "paragraph", text: "Founders often spend weeks choosing a name and a logo, then register the first entity type someone suggests. The structure decision is far more consequential — it affects your liability, ability to raise equity, compliance burden, and exit options." },
            { type: "heading", level: 2, text: "Private Limited Company" },
            { type: "paragraph", text: "Pvt Ltd is the default for startups that intend to raise external capital. Equity can be issued to angel investors and VCs. Directors have limited liability. Compliance is heavier: statutory audits, ROC filings, board meetings, and minutes are mandatory." },
            { type: "heading", level: 2, text: "Limited Liability Partnership" },
            { type: "paragraph", text: "LLPs are ideal for professional service firms and partnerships that do not intend to raise institutional equity. Profits are taxed in the hands of partners (no dividend distribution tax), but you cannot issue equity — only profit-sharing rights." },
            { type: "heading", level: 2, text: "One Person Company" },
            { type: "paragraph", text: "OPC allows a single founder to have limited liability without a co-founder. However, once turnover exceeds ₹2 crore or paid-up capital exceeds ₹50 lakh, mandatory conversion to Pvt Ltd is required. Not suitable for investor-backed businesses." },
            { type: "quote", text: "If you're building to raise a seed round in the next 18 months, start as Pvt Ltd. Converting from LLP or OPC mid-fundraise is expensive and delays closings.", cite: "Meera Nair, Corporate Lawyer" },
        ],
    },
    {
        slug: "shareholders-agreement-founders-guide",
        title: "Shareholders' Agreements: What Every Founder Must Know",
        excerpt: "A shareholders' agreement is the contract that governs how co-founders and investors relate to each other. Neglecting it is one of the most expensive mistakes early-stage founders make.",
        category: "Legal",
        author: meera,
        publishedAt: "2026-02-03T00:00:00.000Z",
        readTimeMinutes: 10,
        tags: ["SHA", "Founders", "Investors"],
        body: [
            { type: "paragraph", text: "A shareholders' agreement (SHA) sits alongside the articles of association and governs the relationship between shareholders. Unlike the AoA, it is a private contract — it doesn't need to be filed with the Registrar. But its provisions can significantly override what the articles say." },
            { type: "heading", level: 2, text: "Key provisions every SHA must address" },
            { type: "list", style: "bullet", items: ["Vesting schedule for founder shares (typically 4 years with a 1-year cliff)", "Reserved matters requiring investor approval (acquisitions, new share issuances, key hires)", "Anti-dilution rights (broad-based weighted average is standard; full-ratchet is founder-unfriendly)", "Drag-along and tag-along rights on a sale", "Right of first refusal on secondary share transfers"] },
            { type: "quote", text: "I've seen co-founder disputes where one founder holds 50% shares with no vesting cliff. The company had to buy them out at a premium when they left 6 months in. The SHA would have prevented this entirely.", cite: "Meera Nair" },
            { type: "heading", level: 2, text: "Timing matters" },
            { type: "paragraph", text: "Execute the SHA before any external investor comes in. Once a VC is at the table, they will insist on their standard terms. Negotiating co-founder provisions alongside investor terms creates conflict and delay." },
        ],
    },

    // --- COMPLIANCE (3) ---
    {
        slug: "annual-compliance-checklist-private-limited",
        title: "Annual Compliance Checklist for Private Limited Companies",
        excerpt: "Missing a single ROC deadline can result in penalties of ₹100 per day per form. This checklist covers every filing a private limited company must complete each financial year.",
        category: "Compliance",
        author: priya,
        publishedAt: "2026-03-20T00:00:00.000Z",
        readTimeMinutes: 8,
        tags: ["ROC", "Annual Filing", "Pvt Ltd"],
        body: [
            { type: "paragraph", text: "Private limited companies in India operate under the Companies Act 2013, which prescribes a calendar of mandatory filings. Missing these isn't just a fine risk — it can flag your company as non-compliant and affect your ability to raise funds or open bank accounts." },
            { type: "heading", level: 2, text: "Board and shareholder meeting requirements" },
            { type: "list", style: "number", items: ["Hold at least 4 board meetings per year, not more than 120 days apart", "Hold Annual General Meeting (AGM) within 6 months of financial year end (by 30 September)", "Maintain minutes of all board and general meetings"] },
            { type: "heading", level: 2, text: "Key annual ROC filings" },
            { type: "list", style: "bullet", items: ["MGT-7A: Annual Return — due within 60 days of AGM", "AOC-4: Financial Statements — due within 30 days of AGM", "ADT-1: Auditor Appointment — due within 15 days of AGM", "DIR-3 KYC: Director KYC — due by 30 September each year"] },
            { type: "quote", text: "The penalty for late filing has no ceiling — it compounds daily. I've seen companies face ₹15+ lakh in penalties for forms that should have cost ₹500 to file on time.", cite: "Priya Sharma, CA" },
        ],
    },
    {
        slug: "roc-filings-deadlines-guide",
        title: "ROC Filings Explained: Deadlines You Cannot Miss",
        excerpt: "The Registrar of Companies requires specific forms at specific times throughout the year. This guide demystifies the most critical event-based and annual filings for Indian companies.",
        category: "Compliance",
        author: arun,
        publishedAt: "2026-01-15T00:00:00.000Z",
        readTimeMinutes: 7,
        tags: ["ROC", "MCA", "Filing Deadlines"],
        body: [
            { type: "paragraph", text: "ROC filings broadly fall into two categories: event-based (triggered by a specific corporate action) and annual (due at the same time each year regardless of activity). Both carry late fees and, in serious cases, prosecution." },
            { type: "heading", level: 2, text: "Event-based filings to track" },
            { type: "list", style: "bullet", items: ["INC-22: Change of registered office — within 30 days", "DIR-12: Change of directors — within 30 days", "SH-7: Change in authorised share capital — within 30 days", "PAS-3: Allotment of shares — within 30 days of allotment", "MGT-14: Special resolutions — within 30 days of passing"] },
            { type: "paragraph", text: "Event-based filings are the ones that catch founders off guard. You raise a round, issue ESOP shares, or change a director — and then realise 45 days later that the window has closed. Build a reminder system or work with a company secretary on retainer." },
        ],
    },
    {
        slug: "mca21-portal-guide-startups",
        title: "MCA21 Portal: Everything Startups Need to Know",
        excerpt: "The Ministry of Corporate Affairs' MCA21 portal is the single gateway for all company law filings. Navigating it can be confusing — here's a practical orientation for founders.",
        category: "Compliance",
        author: arun,
        publishedAt: "2025-12-10T00:00:00.000Z",
        readTimeMinutes: 5,
        tags: ["MCA21", "Portal", "Filing"],
        body: [
            { type: "paragraph", text: "MCA21 Version 3.0 rolled out in 2022 and changed how forms are filed. Most forms are now web-based (not downloadable PDFs), and the signing mechanism uses DSCs linked to the company's directors. Understanding the portal structure saves hours of confusion." },
            { type: "heading", level: 2, text: "First steps after incorporation" },
            { type: "list", style: "number", items: ["Create an MCA account with your director's PAN", "Link your DSC (Digital Signature Certificate) to the director's DIN", "Register as an authorised user for your CIN", "Verify your registered office address via INC-22"] },
            { type: "heading", level: 2, text: "DSC is non-negotiable" },
            { type: "paragraph", text: "Every director named in a form must sign with their DSC. DSCs expire every 2–3 years. Renew early — a lapsed DSC at a critical filing deadline is a common cause of late-filing penalties." },
        ],
    },

    // --- STARTUP (3) ---
    {
        slug: "dpiit-registration-step-by-step",
        title: "How to Register Your Startup Under DPIIT: A Step-by-Step Guide",
        excerpt: "DPIIT recognition unlocks tax exemptions, self-certification for labour laws, easier public procurement, and a fast-track patent process. Here's exactly how to apply.",
        category: "Startup",
        author: dev,
        publishedAt: "2026-03-01T00:00:00.000Z",
        readTimeMinutes: 7,
        tags: ["DPIIT", "Startup India", "Recognition"],
        body: [
            { type: "paragraph", text: "The Department for Promotion of Industry and Internal Trade (DPIIT) recognises startups through the Startup India portal. Recognition is free, takes 2–7 working days, and is the gateway to a stack of government benefits." },
            { type: "heading", level: 2, text: "Eligibility criteria" },
            { type: "list", style: "bullet", items: ["Incorporated as Pvt Ltd, LLP, or Partnership Firm", "Not more than 10 years old from date of incorporation", "Annual turnover not exceeding ₹100 crore in any previous year", "Working towards innovation, development, or improvement of products or processes"] },
            { type: "heading", level: 2, text: "Documents required" },
            { type: "list", style: "bullet", items: ["Certificate of Incorporation / Registration", "PAN of the entity", "Brief description of the innovative nature of the business (500–1000 words)", "Award or recognition letter (if any) — optional but strengthens the application"] },
            { type: "quote", text: "The 'innovation description' is where most applications get rejected or delayed. Be specific — describe what existing problem you're solving and how your approach is different from what's currently available.", cite: "Dev Malhotra, Startup Advisor" },
        ],
    },
    {
        slug: "startup-india-tax-exemptions",
        title: "Startup India Scheme: Tax Exemptions You're Leaving on the Table",
        excerpt: "DPIIT-recognised startups are eligible for a three-year income tax holiday and angel tax exemptions. Most founders don't claim these benefits because they don't know they exist.",
        category: "Startup",
        author: dev,
        publishedAt: "2026-02-12T00:00:00.000Z",
        readTimeMinutes: 6,
        tags: ["Tax Exemption", "Startup India", "DPIIT"],
        body: [
            { type: "paragraph", text: "Getting DPIIT recognition is step one. But recognition alone doesn't grant the tax exemptions — you need to apply separately for each benefit, and eligibility criteria differ between them." },
            { type: "heading", level: 2, text: "Section 80-IAC: Three-year income tax exemption" },
            { type: "paragraph", text: "DPIIT-recognised startups incorporated between April 2016 and April 2025 can claim 100% deduction on profits for any 3 consecutive years out of their first 10. The startup must be certified by the Inter-Ministerial Board (IMB). Apply via the Startup India portal — processing takes 45–90 days." },
            { type: "heading", level: 2, text: "Section 56(2)(viib): Angel tax exemption" },
            { type: "paragraph", text: "DPIIT-recognised startups are exempt from angel tax (the provision that treats investment above fair market value as 'income from other sources'). This was a significant burden before the exemption — angel investors would balk at investing in companies exposed to it." },
            { type: "list", style: "bullet", items: ["File Form-2 on the Startup India portal to claim angel tax exemption", "Exemption applies to equity issued to residents and, since 2024, non-residents", "Investments from VCFs registered with SEBI were always exempt — this covers angels"] },
        ],
    },
    {
        slug: "angel-investment-legal-tax-india",
        title: "Raising Angel Investment in India: Legal and Tax Considerations",
        excerpt: "Angel rounds are milestone moments — but without the right paperwork, they create tax liabilities, regulatory issues, and complications for your next round. Here's what to sort out before signing the term sheet.",
        category: "Startup",
        author: dev,
        publishedAt: "2025-11-28T00:00:00.000Z",
        readTimeMinutes: 9,
        tags: ["Angel Investment", "Fundraising", "Legal"],
        body: [
            { type: "paragraph", text: "Raising money from angel investors is exciting, but the paperwork matters as much as the cheque. Skipping steps creates problems that surface during due diligence for your next round — often at the worst possible time." },
            { type: "heading", level: 2, text: "FEMA compliance for foreign angels" },
            { type: "paragraph", text: "If your angel is an NRI or foreign national, the investment falls under FEMA's FDI rules. You must report the investment to the RBI within 30 days of receiving the funds. Missing this requires compounding, which is expensive and time-consuming." },
            { type: "heading", level: 2, text: "Paperwork checklist for a clean angel round" },
            { type: "list", style: "number", items: ["Execute a Term Sheet (non-binding, but sets expectations)", "Conduct a board meeting to approve the allotment and authorise directors to issue shares", "File PAS-3 (Allotment of Shares) with the ROC within 30 days", "Update the Register of Members", "Report to RBI (Form FC-GPR) if funds are from foreign investors within 30 days", "Issue share certificates to the investors within 2 months"] },
            { type: "quote", text: "The most common post-round cleanup I do is fixing PAS-3 late filings and missing share certificates. Both are easily avoided — just set a reminder on the day you receive the wire.", cite: "Dev Malhotra" },
        ],
    },

    // --- FINANCE (3) ---
    {
        slug: "working-capital-management-startups",
        title: "Working Capital Management for Early-Stage Startups",
        excerpt: "Running out of working capital is the #1 operational cause of startup failure in India. Understanding the cash conversion cycle and how to manage it can be the difference between scaling and shutting down.",
        category: "Finance",
        author: kavita,
        publishedAt: "2026-03-15T00:00:00.000Z",
        readTimeMinutes: 8,
        tags: ["Working Capital", "Cash Flow", "Operations"],
        body: [
            { type: "paragraph", text: "Working capital is the difference between your current assets (cash, receivables, inventory) and current liabilities (payables, short-term debt). A negative working capital cycle — where you pay vendors before customers pay you — is a slow drain that kills otherwise healthy businesses." },
            { type: "heading", level: 2, text: "The cash conversion cycle" },
            { type: "paragraph", text: "CCC = Days Inventory Outstanding + Days Sales Outstanding − Days Payable Outstanding. A shorter CCC means your cash is tied up for less time. Early-stage startups should target a CCC below 45 days; above 90 days signals a structural cash-flow problem." },
            { type: "heading", level: 2, text: "Levers to pull" },
            { type: "list", style: "bullet", items: ["Invoice immediately upon delivery — every day's delay adds to DSO", "Offer early-payment discounts (2/10 net 30 terms) to high-value clients", "Negotiate 45–60 day payment terms with vendors while you're in a strong bargaining position", "Use receivables financing (invoice discounting) for large B2B invoices stuck in client approval cycles"] },
        ],
    },
    {
        slug: "cash-flow-vs-profit-startup",
        title: "Cash Flow vs Profit: Why Your Startup Can Be Profitable but Still Run Out of Money",
        excerpt: "Your P&L says you're profitable. Your bank account says otherwise. This disconnect — common among growth-stage startups — comes down to timing and non-cash accounting adjustments.",
        category: "Finance",
        author: kavita,
        publishedAt: "2026-01-30T00:00:00.000Z",
        readTimeMinutes: 7,
        tags: ["Cash Flow", "Profitability", "Finance"],
        body: [
            { type: "paragraph", text: "Profit is an accounting concept. Cash is a physical reality. A company can be EBITDA-positive and still miss payroll. This happens because revenue is recognised when earned, not when received — and expenses are recorded when incurred, not when paid." },
            { type: "heading", level: 2, text: "The most common culprits" },
            { type: "list", style: "bullet", items: ["Long collection cycles: you've recognised revenue but the customer hasn't paid yet", "Advance payments to vendors: cash out before the expense hits the P&L", "Inventory build-up: cash is tied up in stock that hasn't been sold or recognised as COGS", "Loan repayments: principal payments don't appear on the P&L but drain cash"] },
            { type: "quote", text: "I review a 13-week cash flow forecast with every founder I advise. The P&L tells you if the business model works. The cash flow forecast tells you if you'll survive long enough to prove it.", cite: "Kavita Patel, Finance Expert" },
            { type: "heading", level: 2, text: "Build a 13-week rolling cash forecast" },
            { type: "paragraph", text: "A 13-week (one quarter) rolling cash forecast maps every expected inflow and outflow to its actual payment date — not accrual date. Update it weekly. If the forecast dips below 8 weeks of runway, trigger your fundraising process immediately — do not wait." },
        ],
    },
    {
        slug: "startup-valuations-india",
        title: "Understanding Startup Valuations in India: Methods and Benchmarks",
        excerpt: "How do investors arrive at a pre-money valuation? And how do you negotiate without leaving money on the table or scaring away good investors? A finance-first perspective.",
        category: "Finance",
        author: kavita,
        publishedAt: "2025-12-20T00:00:00.000Z",
        readTimeMinutes: 10,
        tags: ["Valuation", "Fundraising", "Benchmarks"],
        body: [
            { type: "paragraph", text: "Startup valuations at the pre-seed and seed stage are as much art as science. There are no discounted cash flows on a 3-month-old company. But that doesn't mean valuations are arbitrary — investors use frameworks, benchmarks, and comparables to anchor their offers." },
            { type: "heading", level: 2, text: "Common valuation methods" },
            { type: "list", style: "bullet", items: ["Comparable transactions: what have similar Indian startups raised at, at your stage?", "Scorecard method: adjust a baseline by scoring team, market, product, and traction", "VC method: work backwards from a target exit multiple and expected ownership dilution", "Revenue multiples: at growth stage, ARR × industry multiple (SaaS companies typically 4–8x ARR)"] },
            { type: "heading", level: 2, text: "Indian seed-stage benchmarks (2025–26)" },
            { type: "paragraph", text: "Pre-seed rounds in India typically range from ₹50L–₹2Cr at valuations of ₹3Cr–₹15Cr. Seed rounds range from ₹2Cr–₹8Cr at ₹15Cr–₹60Cr post-money. These are wide ranges because traction, team pedigree, and market size matter enormously. A founder with a prior exit commands a 2–3x premium on comparable metrics." },
        ],
    },

    // --- BUSINESS (2) ---
    {
        slug: "business-plan-indian-investors",
        title: "Building a Business Plan That Actually Works for Indian Investors",
        excerpt: "Most business plans written by Indian founders are either too detailed (a 60-page Word document) or too sparse (a 10-slide pitch deck). Here's what sophisticated Indian investors actually want to see.",
        category: "Business",
        author: arun,
        publishedAt: "2026-02-25T00:00:00.000Z",
        readTimeMinutes: 9,
        tags: ["Business Plan", "Investors", "Fundraising"],
        body: [
            { type: "paragraph", text: "Indian investor expectations have evolved significantly since 2015. Institutional angels and micro-VCs now expect the same rigour from seed-stage decks that US investors expect from Series A. The bar has risen — but the format hasn't changed as much as you'd think." },
            { type: "heading", level: 2, text: "The structure that works" },
            { type: "list", style: "number", items: ["Problem & Market: quantify the pain and the total addressable market (TAM/SAM/SOM)", "Solution: what you do and the mechanism of value creation", "Business model: how you make money, unit economics (CAC, LTV, payback period)", "Traction: GMV, ARR, retention, growth rate — prioritise quality over quantity", "Team: why you and why now", "The ask: how much, what it buys you (milestones), and use of funds breakdown"] },
            { type: "quote", text: "The most common mistake is founders presenting GMV as revenue or conflating 'sign-ups' with 'paying customers'. Indian investors are very sensitive to metric integrity now — one inconsistency and you lose credibility for the entire pitch.", cite: "Arun Singh, Business Consultant" },
        ],
    },
    {
        slug: "why-indian-startups-fail-year-three",
        title: "Why Most Indian Startups Fail in Year 3: Lessons from 500 Founders",
        excerpt: "Year 1 is survival. Year 2 is product-market fit. Year 3 is where the organisational cracks appear — and most Indian startups aren't prepared for the transition from founder-led to process-led growth.",
        category: "Business",
        author: arun,
        publishedAt: "2025-11-05T00:00:00.000Z",
        readTimeMinutes: 11,
        tags: ["Failure", "Scaling", "Organisation"],
        body: [
            { type: "paragraph", text: "After working with over 500 founders across accelerators and independent engagements, a pattern emerges: the challenges that kill startups in year three are almost never about the product or the market. They're about the organisation." },
            { type: "heading", level: 2, text: "The three failure modes" },
            { type: "list", style: "number", items: ["Founder bottleneck: everything still flows through the founders; the team can't execute without them", "Premature scaling: hiring ahead of revenue, burning runway on headcount before unit economics are proven", "Compliance collapse: ignoring GST, TDS, ROC, and labour law while focused on growth — then facing a reckoning before Series A due diligence"] },
            { type: "quote", text: "The founders who survive year three all have one thing in common: they hired their first head of operations before they felt they needed one. By the time you feel the need, it's already a crisis.", cite: "Arun Singh" },
            { type: "heading", level: 2, text: "What year-three survivors do differently" },
            { type: "paragraph", text: "They document processes before hiring for them. They build a compliance calendar and assign ownership — not to a CA they see once a year, but to an internal champion. They review unit economics monthly, not quarterly. And critically, they know their runway to the day, not the month." },
        ],
    },
];
