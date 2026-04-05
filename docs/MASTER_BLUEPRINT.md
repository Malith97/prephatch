# PrepHatch Master Blueprint v2

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Primary Use: Product, engineering, AI-assisted implementation, deployment, and operations.  
Scope: MVP through early scaling.

## 1. Purpose

This document is the control tower for PrepHatch. It defines what the product is, what the MVP includes, which principles cannot be violated, and where detailed rules live.

This file should stay strategic. Detailed implementation belongs in section files referenced below.

## 2. Product Summary

PrepHatch is a focused certification exam-readiness platform. It helps learners practice in realistic exam conditions, understand mistakes, and decide whether they are ready to pass.

Initial certification focus:
- AWS Certified Solutions Architect – Associate (SAA-C03)

Core promise:
- realistic mocks
- strong base explanations
- optional AI deep explanations
- clear readiness signals
- trusted and maintainable content

## 3. Strategic Principles

- Build a modular monolith first.
- Keep the real MVP small.
- Cost is a primary business constraint.
- AI is an accelerator, not the source of truth.
- Payment, entitlement, timer, and submission logic must be server-authoritative.
- Preserve attempt history for trust and future analytics.
- Prefer boring, maintainable systems over clever complexity.

## 4. Real MVP

Launch-critical:
- email/password auth
- Google login
- package discovery page
- one free mock exam after login
- 2 to 3 premium mock exams
- practice mode
- timed mode
- result and review screen
- one-time purchase per package
- 365-day entitlement
- minimal admin content operations
- on-demand AI deep explanation with strict cost controls

Launch-soon-after:
- richer progress analytics
- coupons
- improved admin workflows
- renewal campaigns
- broader notes and cheatsheets library

Deferred:
- Facebook login
- live AI tutor chat
- subscriptions
- team features
- mobile app
- complex proctoring
- enterprise workflows

## 5. Primary Product Loop

Primary acquisition and conversion loop:
1. Visitor lands on homepage or package page.
2. User signs up or logs in.
3. User starts the free mock exam.
4. User completes the exam.
5. User sees results, explanations, and upgrade CTA.
6. User purchases premium access.
7. User enters purchased exam workspace.

## 6. Commercial Rules

- Business model: one-time purchase per certification package.
- Access duration: 365 days.
- Repurchase rule for MVP: block repurchase while active.
- Renewal rule: same package; later special pricing may be added.
- Expired users can still see limited history summaries, but cannot access premium mocks or premium resources.

Detailed rules: `product/pricing-and-access.md`, `architecture/payments-and-entitlements.md`

## 7. AI Policy

AI is allowed for:
- planning
- code generation
- debugging
- tests
- content cleanup
- learner-facing deep explanation on demand

AI is not trusted as source of truth for:
- correct answers
- scoring
- access control
- payment confirmation
- publish approval

Cost rules:
- default to stored base explanations
- deep explanation is optional and on-demand
- cache outputs aggressively
- enforce per-user and per-day limits
- set daily budget caps and alerts

Detailed rules: `architecture/ai-strategy.md`, `operations/cost-control.md`

## 8. Quality and Reliability Rules

Must be highly reliable in these areas:
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
- migrations are source of truth
- CI blocks merge on failed checks
- AI failure must never block core user flow

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
1. proving one exam works
2. deepening value for that exam
3. adding more certifications
4. improving automation and analytics
5. splitting services only when justified by real bottlenecks

Do not prematurely optimize into microservices.

Detailed rules: `architecture/scaling-strategy.md`

## 11. Documentation Governance

- Keep this file strategic.
- Put detailed rules in section files.
- Record decisions in `DECISIONS.md`.
- Record major updates in `CHANGELOG.md`.
- Keep docs structured so AI tools can work on one area at a time.

## 12. Section Map

### Product
- `product/vision.md`
- `product/mvp-scope.md`
- `product/user-personas.md`
- `product/user-flows.md`
- `product/pricing-and-access.md`
- `product/launch-plan.md`

### Architecture
- `architecture/system-architecture.md`
- `architecture/tech-stack.md`
- `architecture/data-model.md`
- `architecture/exam-engine.md`
- `architecture/auth-and-roles.md`
- `architecture/payments-and-entitlements.md`
- `architecture/ai-strategy.md`
- `architecture/security.md`
- `architecture/scaling-strategy.md`

### Engineering
- `engineering/implementation-plan.md`
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
