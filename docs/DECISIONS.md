# Decisions Log

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Record important decisions so future changes remain consistent.

## Template

### DEC-000
- Date:
- Status: Proposed | Accepted | Superseded | Rejected
- Area:
- Decision:
- Why:
- Alternatives Considered:
- Consequences:
- Related Files:

---

### DEC-001
- Date: 2026-04-06
- Status: Accepted
- Area: Architecture
- Decision: Build PrepHatch as a modular monolith.
- Why: Lowest cost and fastest path to launch with clear internal boundaries and future refactorability.
- Alternatives Considered: Microservices from day one.
- Consequences: Faster development, simpler deployment, fewer operational costs.
- Related Files: `architecture/system-architecture.md`

### DEC-002
- Date: 2026-04-06
- Status: Accepted
- Area: AI Strategy
- Decision: Use runtime AI only for optional deep explanations in MVP.
- Why: Minimizes API cost and risk while preserving user value.
- Alternatives Considered: Live AI tutor or AI weak-area coach in launch MVP.
- Consequences: Lower AI spend, easier QA, better reliability.
- Related Files: `architecture/ai-strategy.md`, `operations/cost-control.md`

### DEC-003
- Date: 2026-04-06
- Status: Accepted
- Area: Commerce
- Decision: One-time purchase per package with 365-day access.
- Why: Simple pricing, low operational complexity, predictable access control.
- Alternatives Considered: Subscription model.
- Consequences: Stronger need for content quality and later renewal strategy.
- Related Files: `product/pricing-and-access.md`, `architecture/payments-and-entitlements.md`

### DEC-004
- Date: 2026-04-06
- Status: Accepted
- Area: Reliability
- Decision: Submitted attempts are immutable and store question snapshots.
- Why: Protects history, scoring integrity, and future audits.
- Alternatives Considered: Referencing live questions only.
- Consequences: More storage, much better trustworthiness.
- Related Files: `architecture/data-model.md`, `architecture/exam-engine.md`

### DEC-005
- Date: 2026-04-07
- Status: Accepted
- Area: Product Scope
- Decision: Launch MVP supports one certification only: AWS SAA-C03.
- Why: Narrow scope keeps content quality, trust, and delivery speed realistic.
- Alternatives Considered: Multiple certifications at launch.
- Consequences: Catalog and admin flows can stay simple in v1.
- Related Files: `MASTER_BLUEPRINT.md`, `product/mvp-scope.md`

### DEC-006
- Date: 2026-04-07
- Status: Accepted
- Area: Product Flow
- Decision: MVP entry path is homepage or dashboard to a single package detail page, then free mock, result, and paid workspace.
- Why: This resolves drift across docs and keeps acquisition and conversion straightforward.
- Alternatives Considered: Dashboard-only or package-discovery-only flow.
- Consequences: Homepage, dashboard, and package page now have distinct but limited roles.
- Related Files: `MASTER_BLUEPRINT.md`, `product/user-flows.md`

### DEC-007
- Date: 2026-04-07
- Status: Accepted
- Area: Tech Stack
- Decision: Use Next.js, TypeScript, Tailwind CSS, Supabase, Stripe, GitHub Actions, Vitest, and Playwright for MVP.
- Why: Low cost, fast setup, strong ecosystem, and good fit for AI-assisted development.
- Alternatives Considered: Separate backend stack or heavier infra from day one.
- Consequences: Repo structure, auth, payments, and testing strategy now assume this stack.
- Related Files: `architecture/tech-stack.md`, `engineering/repo-structure.md`

### DEC-008
- Date: 2026-04-07
- Status: Accepted
- Area: Identity
- Decision: MVP authentication providers are email/password and Google login, with Supabase Auth.
- Why: Covers common sign-in paths without exploding auth complexity.
- Alternatives Considered: Email-only or more social providers at launch.
- Consequences: Facebook login remains deferred.
- Related Files: `architecture/auth-and-roles.md`, `product/mvp-scope.md`

### DEC-009
- Date: 2026-04-07
- Status: Accepted
- Area: Commerce
- Decision: Stripe is the MVP payments provider and entitlement unlock requires verified webhook processing.
- Why: Stripe keeps one-time purchase flow simple and reliable.
- Alternatives Considered: Manual invoicing or multiple providers at launch.
- Consequences: Checkout and entitlement flows are server-owned and idempotent.
- Related Files: `architecture/payments-and-entitlements.md`, `engineering/api-spec.md`

### DEC-010
- Date: 2026-04-07
- Status: Accepted
- Area: MVP Content Scope
- Decision: Notes, cheatsheets, coupons, and richer analytics are not launch MVP.
- Why: They add scope without improving the core exam loop enough to justify launch risk.
- Alternatives Considered: Shipping them inside the paid workspace at launch.
- Consequences: Paid MVP centers on premium mocks, results, review, and entitlement-gated workspace only.
- Related Files: `MASTER_BLUEPRINT.md`, `product/mvp-scope.md`, `product/pricing-and-access.md`

### DEC-011
- Date: 2026-04-07
- Status: Accepted
- Area: AI
- Decision: Optional AI deep explanation remains in launch MVP, but only after review and only with strict limits and fallback to stored explanation.
- Why: It is part of the core value proposition, but it must never become a reliability dependency.
- Alternatives Considered: Deferring all runtime AI or making AI the primary explanation layer.
- Consequences: AI endpoint, caching, throttling, and fallback UX are launch scope.
- Related Files: `MASTER_BLUEPRINT.md`, `architecture/ai-strategy.md`

### DEC-012
- Date: 2026-04-07
- Status: Accepted
- Area: Admin Scope
- Decision: Launch MVP includes only minimal admin tooling to create, edit, publish, archive, and assemble questions and mocks.
- Why: Content operations are launch-critical, but broad admin tooling is not.
- Alternatives Considered: No admin UI at launch or a broader content management suite.
- Consequences: Improved admin workflows stay post-launch.
- Related Files: `MASTER_BLUEPRINT.md`, `operations/content-ops.md`, `engineering/IMPLEMENTATION_BACKLOG.md`

### DEC-013
- Date: 2026-04-07
- Status: Accepted
- Area: Scoring
- Decision: Use percentage correct as the authoritative result, derive an internal normalized scaled score for display, and compute readiness labels from percentage bands.
- Why: Buildable, explainable, and honest without pretending to mirror official vendor scoring.
- Alternatives Considered: Deferring readiness labels or inventing a more complex pseudo-official scoring model.
- Consequences: The product can display readiness without claiming official score accuracy.
- Related Files: `architecture/exam-engine.md`, `architecture/data-model.md`
