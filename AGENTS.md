# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

[@AGENTS.md](./AGENTS.md)

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

No test runner is configured.

## Stack

- **Next.js 16.2.2** with React 19 — App Router, TypeScript, Tailwind CSS v4
- **UI:** shadcn/ui components in `components/ui/`, plus custom components in `components/custom/`
- **HTTP:** Axios via `services/api-client.ts` (base URL: `NEXT_PUBLIC_API_URL` or `http://localhost:4000/api`)
- **Auth:** JWT stored in `localStorage` + cookies (set client-side); middleware in `proxy.ts` is currently disabled pending backend readiness
- **Backend:** Developed by a separate team on Node.js and deployed via AWS. This repo is frontend-only. All feature API calls go through the shared Axios client in `services/api-client.ts` (base URL: `NEXT_PUBLIC_API_URL`) by appending feature-specific paths (e.g. `/careers/applications`). Do **not** create separate env vars per feature endpoint.

## Architecture

### Marketing/Landing Page/ Business Summary
StartupKaro operates as a digital platform that helps startups and SMEs start, manage, and stay compliant with business regulations in India.
They generate revenue through one-time fees for registrations and recurring subscriptions for compliance, tax, accounting, and payroll services.
Their model provides fixed services at fixed costs with human experts (CA/CS/legal professionals) to deliver end-to-end business services.
Customer acquisition begins with company registration and transitions into long-term retention via ongoing compliance and financial services. But customers can be acquired in many other relevant services or different stage of service. 

### Three-panel app
Routes are split into three panels with separate auth flows:
- `/admin/*` — Admin panel
- `/employee/*` — Employee panel  
- `/customer/*` — Customer panel

Each panel has its own login route under `app/(auth-<panel>)/<panel>/login/`.

### Feature-based structure
Business logic lives in `features/<domain>/`:
- `components/` — page-level and domain components
- `hooks/` — data-fetching and state hooks

`app/` routes are thin shells that import from the matching feature folder.

### Auth pattern
`useAuth()` (`features/auth/shared/hooks/useAuth.ts`) manages session state. On login, auth hooks call `authService`, then `saveSession()` to persist token and role to both `localStorage` and cookies. On 401, `api-client.ts` interceptor clears session and redirects to the role's login page.

RBAC roles (`ADMIN`, `EMPLOYEE`, `CUSTOMER`) and their redirect/login routes are defined in `lib/rbac/roles.ts`.

### API response shape
All API calls return `ApiResponse<T>` (`types/api.types.ts`):
```ts
{ data: T; message: string; success: boolean }
```
Paginated endpoints return `PaginatedResponse<T>` with a `pagination` object.

## Brand colors
- `#FF9933` — saffron/orange
- `#000080` — navy/indigo
- `#6BAE3A` — green

### Note

1) Dont use asChild since the button does not come from radix UI and hence do not have a prop called 'asChild'. React will not recognize it.

## Sanity CMS (Articles)

The Articles section (`/article`, `/article/[slug]`) is fully CMS-driven via Sanity. See `SANITY_GUIDE.md` for editor workflows.

### Where content lives
Article, Author, and Category documents live in Sanity Content Lake. Studio is embedded at `/studio` (only available locally or in deployments with the Studio route).

### Code layout
| Path | Purpose |
|---|---|
| `sanity/env.ts` | Project ID / dataset / API version constants |
| `sanity/client.ts` | Public read-only Sanity client (useCdn: true) |
| `sanity/live.ts` | `defineLive()` → exports `sanityFetch` + `SanityLive` |
| `sanity/image.ts` | `urlFor()` image URL builder |
| `sanity/queries.ts` | All GROQ queries as named `defineQuery()` constants |
| `sanity/schemaTypes/` | All schema definitions (article, author, category, objects) |
| `sanity.config.ts` | Root Studio config (plugins, schema, basePath `/studio`) |
| `features/articles/api/` | Service functions wrapping GROQ queries |
| `features/articles/types/` | TypeScript types for articles, categories, authors |
| `features/articles/lib/` | read-time calculator, icon map, Portable Text components |
| `sanity/schemaTypes/job.ts` | Job Opening schema (department, workType, location, isRemote, requirements, etc.) |
| `features/careers/api/` | `jobs.service.ts` (Sanity) + `applications.service.ts` (Node API via `api-client`) |
| `features/careers/types/` | TypeScript types for jobs and application form |
| `features/careers/components/` | `CareersListPage`, `JobDetailPage`, and `ui/` sub-components |

### Data access rules
- Use `sanityFetch` from `@/sanity/live` in all service functions — it auto-switches between published and draft perspectives based on Next.js draft mode.
- **Never import `sanity/preview-client.ts` from client components** — it holds `SANITY_API_TOKEN`.
- Cache tags used: `article`, `article:<slug>`, `category`, `job`, `job:<slug>`. Use `revalidateTag()` or the `/api/revalidate` webhook to invalidate.

### Env vars
| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | public | Project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | public | Dataset (default: `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | public | API version (default: `2024-01-01`) |
| `SANITY_API_TOKEN` | server-only | Read token for draft mode + Live API |
| `SANITY_PREVIEW_SECRET` | server-only | Secret for Studio "Open preview" link |
| `SANITY_REVALIDATE_SECRET` | server-only | Webhook signature secret for `/api/revalidate` |

### Adding new content types to Sanity
Add a schema file to `sanity/schemaTypes/`, register it in `sanity/schemaTypes/index.ts`, and add corresponding GROQ queries in `sanity/queries.ts`.