# Architecture
- **Framework**: Next.js 14 with TypeScript and Tailwind CSS.
- **Logic**: A custom TypeScript engine (`lib/audit-logic.ts`) that evaluates plan efficiency based on seat count and redundancy.
- **Persistence**: Used `localStorage` to ensure form state survives page refreshes.
- **Scalability**: To handle 10k audits/day, I would move the audit logic to a serverless Edge Function and use Redis for caching frequent tool pricing data.