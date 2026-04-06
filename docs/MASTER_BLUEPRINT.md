# PrepHatch Master Blueprint v3

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Primary Use: Product, engineering, and operational source of truth for MVP decisions.  
Scope: MVP through early scaling.

## 1. Purpose

This document is the control tower for PrepHatch. It defines the product, the launch contract, and the rules that lower-level docs must follow.

Rules:
- Keep this file strategic and decision-oriented.
- Put implementation detail in section docs.
- If a lower-level doc conflicts with this file, update that doc immediately or archive it.
- Git history is the changelog; do not maintain ceremonial duplicate history files.

## 2. Product Summary

PrepHatch is a focused certification exam-readiness platform for learners who want realistic mocks, trusted explanations, and a clear signal of whether they are ready to pass.

Initial certification:
- AWS Certified Solutions Architect - Associate (SAA-C03)

Core promise:
- realistic mock exams
- strong stored base explanations
- optional AI deep explanations on demand
- clear readiness signals
- trusted and maintainable content

## 3. Strategic Principles

- Build a modular monolith first.
- Keep the real MVP small and decision-complete.
- Cost is a primary business constraint.
- AI is an accelerator, not the source of truth.
- Payment, entitlement, timer, scoring, and submission logic must be server-authoritative.
- Preserve attempt history for trust and future analytics.
- Prefer boring, maintainable systems over clever complexity.

## 4. MVP Contract

### Launch Now

| Area | MVP Decision |
| --- | --- |
| Certification scope | One certification only: AWS SAA-C03 |
| Entry surfaces | Public homepage plus one package detail page; logged-in dashboard mirrors package access state |
| Auth | Email/password auth and Google login |
| Free experience | One free mock exam after login |
| Paid experience | 2 to 3 premium mock exams in a purchased workspace |
| Exam modes | Practice mode and timed mode |
| Results | Score summary, readiness label, topic breakdown, per-question review, stored base explanations |
| Commerce | One-time purchase per package |
| Access duration | 365-day entitlement |
| Admin | Minimal question and mock content operations |
| AI | Optional deep explanation after review with strict limits and fallback to base explanation |

### Launch Soon After

| Area | Not In Launch MVP |
| --- | --- |
| Analytics | Richer progress analytics beyond results and topic breakdown |
| Resources | Broader notes and cheatsheets library |
| Commerce | Coupons and renewal campaigns |
| Admin | Better admin workflows and bulk tooling |

### Deferred

| Area | Deferred |
| --- | --- |
| Auth | Facebook login |
| Product | Live AI tutor chat, subscriptions, team features, mobile app |
| Compliance | Complex proctoring, enterprise workflows |

## 5. Canonical User Path

1. Visitor lands on the homepage or package detail page.
2. User signs up or logs in.
3. User opens the single package detail page.
4. User starts the free mock exam.
5. User completes the exam.
6. User sees results, stored explanations, readiness signal, and upgrade CTA.
7. User purchases package access.
8. User enters the purchased workspace containing premium mocks.

The dashboard is a logged-in convenience surface, not a separate product branch.

## 6. Commercial Rules

- Business model: one-time purchase per certification package.
- Access duration: 365 days.
- Repurchase rule for MVP: block repurchase while entitlement is active.
- Renewal rule: allow purchase again after expiry; no subscription behavior in MVP.
- Expired users may keep limited history visibility, but lose premium mocks and other premium surfaces.

Detailed rules: `product/pricing-and-access.md`, `architecture/payments-and-entitlements.md`

## 7. AI Policy

AI is allowed for:
- planning
- code generation
- debugging
- tests
- content cleanup
- learner-facing deep explanation on demand after review

AI is not trusted as the source of truth for:
- correct answers
- scoring
- access control
- payment confirmation
- publish approval

Cost rules:
- stored base explanations are the default answer
- deep explanation is optional and on-demand
- cache outputs aggressively
- enforce per-user and per-day limits
- set daily budget caps and alerts

Detailed rules: `architecture/ai-strategy.md`, `operations/cost-control.md`

## 8. Quality and Reliability Rules

Highest-risk areas:
- auth
- exam timing
- final submission
- scoring
- payments
- entitlement gates
- content publishing

Non-negotiables:
- immutable submitted attempts
- question snapshots for history
- preview environment required
- migrations are the source of truth
- CI blocks merge on failed checks
- AI failure must never block the core learner flow

Detailed rules: `architecture/exam-engine.md`, `engineering/testing-strategy.md`, `engineering/devops.md`

## 9. Architecture Summary

Pattern:
- modular monolith

Core modules:
- auth
- catalog
- exams
- attempts
- progress
- resources
- payments
- entitlements
- admin
- ai

Detailed docs:
- `architecture/system-architecture.md`
- `architecture/data-model.md`
- `engineering/repo-structure.md`

## 10. Scaling Direction

PrepHatch should scale by:
1. proving one certification works
2. deepening trust and content quality
3. adding more certifications
4. improving automation and analytics
5. splitting services only when justified by real bottlenecks

Do not prematurely optimize into microservices.

## 11. Documentation Map

### Core
- `MASTER_BLUEPRINT.md`
- `DECISIONS.md`
- `INDEX.md`

### Product
- `product/vision.md`
- `product/mvp-scope.md`
- `product/user-flows.md`
- `product/pricing-and-access.md`

### Architecture
- `architecture/system-architecture.md`
- `architecture/tech-stack.md`
- `architecture/data-model.md`
- `architecture/exam-engine.md`
- `architecture/auth-and-roles.md`
- `architecture/payments-and-entitlements.md`
- `architecture/ai-strategy.md`
- `architecture/security.md`

### Engineering
- `engineering/IMPLEMENTATION_BACKLOG.md`
- `engineering/repo-structure.md`
- `engineering/coding-standards.md`
- `engineering/api-spec.md`
- `engineering/testing-strategy.md`
- `engineering/devops.md`
- `engineering/migrations.md`

### Operations
- `operations/content-ops.md`
- `operations/support-runbook.md`
- `operations/incident-runbook.md`
- `operations/release-checklist.md`
- `operations/qa-checklist.md`
- `operations/cost-control.md`

### Internal
- `internal/ai-prompts.md`
