
## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Color Scheme

- #FF9933 (saffron/orange)
- #000080 (navy/indigo)
- #138808 (green)

### Project Structure

```.tree
startupkaro-frontend/
├─ app/
│  ├─ (auth-admin)/
│  │  └─ admin/
│  │     └─ login/
│  ├─ (auth-customer)/
│  │  └─ customer/
│  │     ├─ login/
│  │     ├─ register/
│  │     └─ reset-password/
│  ├─ (auth-employee)/
│  │  └─ employee/
│  │     └─ login/
│  ├─ admin/
│  │  ├─ analytics/
│  │  ├─ customers/
│  │  │  └─ [id]/
│  │  │     └─ orders/
│  │  ├─ employees/
│  │  │  ├─ [id]/
│  │  │  └─ new/
│  │  ├─ inquiries/
│  │  │  └─ [id]/
│  │  ├─ orders/
│  │  │  ├─ [id]/
│  │  │  │  └─ edit/
│  │  │  └─ new/
│  │  └─ payments/
│  │     └─ [id]/
│  ├─ customer/
│  │  ├─ checkout/
│  │  │  ├─ failure/
│  │  │  └─ success/
│  │  ├─ profile/
│  │  │  └─ change-password/
│  │  ├─ purchases/
│  │  │  └─ [id]/
│  │  └─ services/
│  │     └─ [id]/
│  └─ employee/
├─ components/
│  ├─ layouts/
│  └─ ui/
├─ features/
│  ├─ analytics/
│  │  ├─ components/
│  │  └─ hooks/
│  ├─ auth/
│  │  ├─ admin/
│  │  │  ├─ components/
│  │  │  └─ hooks/
│  │  ├─ customer/
│  │  │  ├─ components/
│  │  │  └─ hooks/
│  │  ├─ employee/
│  │  │  ├─ components/
│  │  │  └─ hooks/
│  │  └─ shared/
│  │     ├─ components/
│  │     └─ hooks/
│  ├─ checkout/
│  │  ├─ components/
│  │  └─ hooks/
│  ├─ customers/
│  │  ├─ components/
│  │  └─ hooks/
│  ├─ employees/
│  │  ├─ components/
│  │  └─ hooks/
│  ├─ orders/
│  │  ├─ components/
│  │  └─ hooks/
│  ├─ payments/
│  │  ├─ components/
│  │  └─ hooks/
│  ├─ profile/
│  │  ├─ components/
│  │  └─ hooks/
│  ├─ purchases/
│  │  ├─ components/
│  │  └─ hooks/
│  └─ services-catalog/
│     ├─ components/
│     └─ hooks/
├─ lib/
│  ├─ rbac/
│  ├─ utils/
│  └─ validations/
├─ public/
├─ services/
└─ types/

```