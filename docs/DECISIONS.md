# Decisions Log

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
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
- Related Files: `architecture/system-architecture.md`, `architecture/scaling-strategy.md`

### DEC-002
- Date: 2026-04-06
- Status: Accepted
- Area: AI Strategy
- Decision: Use runtime AI only for optional deep explanations in MVP.
- Why: Minimizes API cost and risk while preserving user value.
- Alternatives Considered: Live AI tutor, AI weak-area coach in launch MVP.
- Consequences: Lower AI spend, easier QA, better reliability.
- Related Files: `architecture/ai-strategy.md`, `operations/cost-control.md`

### DEC-003
- Date: 2026-04-06
- Status: Accepted
- Area: Commerce
- Decision: One-time purchase per package with 365-day access.
- Why: Simple pricing, low operational complexity, predictable access control.
- Alternatives Considered: Subscription model.
- Consequences: Stronger need for content quality and renewal strategy later.
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
