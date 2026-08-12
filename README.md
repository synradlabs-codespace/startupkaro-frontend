# StartupKaro — Frontend

StartupKaro is a digital platform that helps **startups and SMEs** start, manage, and stay compliant with business regulations in India. The platform provides fixed-price services delivered by human experts (CA/CS/legal professionals) for end-to-end business services — from company registration through ongoing compliance, tax, accounting, and payroll.

## Business Model

- **One-time fees** for registrations (company incorporation, GST, trademarks, etc.)
- **Recurring subscriptions** for compliance, tax, accounting, and payroll services
- Customer acquisition typically starts with company registration and transitions into long-term retention via ongoing services

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.2 — App Router, TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + custom components |
| HTTP Client | Axios (`services/api-client.ts`) |
| Server State | TanStack React Query v5 |
| Animations | Framer Motion, Lenis (ScrollStack smoothing) |
| CMS | Sanity v5 (articles, services, careers) |
| Icons | Lucide React, React Icons |
| Auth | JWT in `localStorage` + cookies (client-side) |
| Backend | Node.js API on AWS (separate team) — `https://server.startupkaro.in/api/v1` |

---

## Integrations

| Integration | Purpose |
|---|---|
| **Sanity CMS** | Articles/blog, service pages, job listings — content managed via embedded Studio at `/studio` |
| **Sanity Live** | Real-time content updates via `sanityFetch` + `SanityLive` |
| **Sanity Draft Mode** | Preview unpublished content via `/api/draft-mode/enable` |
| **Sanity Revalidate Webhook** | On-demand ISR cache purge via `/api/revalidate` |
| **Node.js REST API** | All transactional data (customers, orders, payments, inquiries, employees) |

---

## Features

### Marketing / Public

- **Landing page** — Hero, services overview, CTAs
- **Services catalog** (`/services`, `/services/[slug]`) — CMS-backed service detail pages
- **Articles/Blog** (`/article`, `/article/[slug]`) — Sanity-powered blog with categories, authors, read time
- **Careers** (`/careers`, `/careers/[slug]`) — Sanity job listings + application form (Node API)
- **About, Contact** — Static marketing pages
- **Legal pages** — Privacy policy, terms of service, refund policy, cookies policy

### Customer Panel (`/customer/*`)

- **Authentication** — Register, login, forgot/reset password
- **Services** — Browse and view purchased services
- **Checkout** — Purchase flow with success/failure states
- **Purchases** — Order history and purchase detail (`/purchases/[id]`)
- **Profile** — View and update profile, change password

### Employee Panel (`/employee/*`)

- **Authentication** — Login
- **Orders** — View and edit assigned orders (`/orders/[id]`, `/orders/[id]/edit`)
- **Inquiries** — View and manage customer inquiries (`/inquiries/[id]`)
- **Customers** — View assigned customer profiles (`/customers/[id]`)
- **Profile** — View profile, change password

### Admin Panel (`/admin/*`)

- **Authentication** — Login
- **Analytics** — Business metrics dashboard
- **Customers** — Full customer list and detail with order history
- **Employees** — Employee list, create new employee, detail view
- **Orders** — Full order management: list, detail, create, edit
- **Inquiries** — Inquiry list and detail management
- **Payments** — Payment list and payment detail
- **Services** — Service management with Sanity draft creation

---

## Architecture

### Route Structure

Three separate panels with isolated auth flows:

```
/admin/*       → Admin panel   (login: /admin/login)
/employee/*    → Employee panel (login: /employee/login)
/customer/*    → Customer panel (login: /customer/login, /customer/register)
```

### Feature-Based Code Organization

```
features/<domain>/
  components/   ← page-level and domain UI components
  hooks/        ← data-fetching and state hooks
  api/          ← service functions
  types/        ← TypeScript types
```

`app/` routes are thin shells that import from the matching `features/` folder.

### Auth Pattern

`useAuth()` at `features/auth/shared/hooks/useAuth.ts` manages session state. On login, `saveSession()` persists JWT and role to both `localStorage` and cookies. On 401, the Axios interceptor in `api-client.ts` clears the session and redirects to the appropriate login page.

RBAC roles (`ADMIN`, `EMPLOYEE`, `CUSTOMER`) and redirect routes are defined in `lib/rbac/roles.ts`.

### API Response Shape

```ts
// Standard
{ data: T; message: string; success: boolean }

// Paginated
{ data: T[]; message: string; success: boolean; pagination: { ... } }
```

---

## Project Structure

```
startupkaro-frontend/
├─ app/
│  ├─ (articles)/          # Blog/article routes
│  ├─ (auth-admin)/        # Admin login
│  ├─ (auth-customer)/     # Customer login, register, reset-password
│  ├─ (auth-employee)/     # Employee login
│  ├─ (marketing)/         # Public marketing pages
│  ├─ admin/               # Admin panel routes
│  ├─ customer/            # Customer panel routes
│  ├─ employee/            # Employee panel routes
│  ├─ api/                 # API routes (Sanity webhooks, draft mode)
│  └─ studio/              # Embedded Sanity Studio
├─ features/               # Business logic by domain
│  ├─ admin/
│  ├─ analytics/
│  ├─ articles/
│  ├─ auth/
│  ├─ careers/
│  ├─ customers/
│  ├─ employee/
│  ├─ marketing/
│  ├─ services/
│  └─ services-catalog/
├─ components/
│  ├─ layouts/
│  └─ ui/                  # shadcn/ui + custom components
├─ sanity/                 # Sanity client, queries, schema types
├─ lib/
│  ├─ rbac/
│  ├─ utils/
│  └─ validations/
├─ services/               # Axios client and shared service helpers
├─ types/                  # Global TypeScript types
└─ public/
```

---

## Design System

HP-inspired white-paper design system. Key tokens:

| Token | Hex | Role |
|---|---|---|
| `bg-primary-brand` | `#296ef9` | HP Bright Blue — primary CTAs and active accents |
| `text-ink` | `#1a1a1a` | Primary headlines and body text |
| `text-slate` / `text-graphite` | `#636363` | Secondary text and metadata |
| `border-hairline` | `#e8e8e8` | Default card/divider border |
| `bg-surface` / `bg-cloud` | `#f7f7f7` | Light section surfaces |
| `bg-canvas` / `bg-paper` | `#ffffff` | Page and card surfaces |
| `bg-bloom-coral` | `#ff5050` | Sale/emphasis accent (used sparingly) |

Fonts: **Gilroy** (`font-display`) for headings, **Quicksand** (`font-sans`) for body and UI text.

---

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## Environment Variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | public | Backend API base URL |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | public | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | public | Sanity dataset (default: `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | public | Sanity API version |
| `SANITY_API_TOKEN` | server-only | Read token for draft mode + Live API |
| `SANITY_PREVIEW_SECRET` | server-only | Secret for Studio preview link |
| `SANITY_REVALIDATE_SECRET` | server-only | Webhook signature secret for `/api/revalidate` |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | public | PostHog project API key — browser sends pageview events |
| `NEXT_PUBLIC_POSTHOG_HOST` | public | PostHog ingest host, e.g. `https://us.i.posthog.com` |
| `POSTHOG_PERSONAL_API_KEY` | server-only | Personal API key with query scope — reads visitor stats back for `/admin/analytics` |
| `POSTHOG_PROJECT_ID` | server-only | Numeric PostHog project ID to query against |
