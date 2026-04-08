# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

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
- **Backend:** Developed by a separate team on Node JS, this repo is only for frotend

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
- `#138808` — green

### Note

1) Dont use asChild since the button does not come from radix UI and hence do not have a prop called 'asChild'. React will not recognize it.

