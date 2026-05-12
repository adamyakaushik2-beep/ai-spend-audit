# AI Spend Audit
A tool for startup founders to identify waste in their AI stack.

## Decisions & Trade-offs
1. **Next.js vs Python**: Chose Next.js for the entire stack to ensure high Lighthouse scores and easier deployment on Vercel, meeting the "Product Hunt ready" requirement.
2. **Hardcoded Logic vs LLM**: Used hardcoded TypeScript rules for the audit math to ensure "defensible" finance-grade accuracy, using LLMs only for the summary.
3. **LocalStorage**: Used LocalStorage for form persistence to ensure a "no-login" friction-less user experience while keeping data private.
4. **Tailwind CSS**: Used Tailwind instead of a component library to keep the bundle size small and Performance scores > 90.
5. **Manual Pricing Data**: Decided against an automated scraper to ensure every pricing number traces back to a verified URL, as accuracy was a priority.

## Quick Start
1. `npm install`
2. `npm run dev`
3. Deploy to Vercel.