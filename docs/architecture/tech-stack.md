# Tech Stack

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines the accepted stack for MVP.

## Mandatory Stack

- Frontend/App: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Database/Auth/Storage: Supabase
- Payments: Stripe
- Hosting/Preview: managed Next.js hosting with per-PR preview deploys
- Runtime AI: OpenAI-first adapter with room for later provider abstraction
- CI: GitHub Actions
- Testing: Vitest + Playwright

## Why This Stack

- Next.js + TypeScript: fast to ship and easy to keep full-stack logic close together
- Tailwind CSS: low-friction UI system for MVP
- Supabase: auth, Postgres, storage, and row-level controls in one low-cost platform
- Stripe: simplest trustworthy path for one-time package purchases
- Managed preview hosting: required preview environment without extra infra work
- GitHub Actions: enough CI for launch scope
- Vitest + Playwright: unit/integration plus a thin E2E layer

## Stack Rule

Do not introduce additional major platforms unless they solve a clear problem that existing tools cannot solve cost-effectively.

## Replaceable vs Fixed

Fixed for MVP:
- Next.js
- TypeScript
- Supabase
- Stripe
- GitHub Actions

Replaceable later if needed:
- hosting provider
- AI provider implementation behind the server adapter
