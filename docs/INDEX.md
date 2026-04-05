# Documentation Index

Status: Active  
Owner: Founder  
Purpose: Master map of all documentation for PrepHatch.  
Audience: Founder, future collaborators, AI coding agents, reviewers.

---

## How to Use This Index

Use this file as the entry point for all project documentation.

Recommended reading order for new contributors or AI agents:

1. `docs/MASTER_BLUEPRINT.md`
2. `docs/DECISIONS.md`
3. `docs/product/mvp-scope.md`
4. `docs/architecture/system-architecture.md`
5. `docs/engineering/implementation-plan.md`
6. `docs/engineering/IMPLEMENTATION_BACKLOG.md`
7. `docs/engineering/FIRST_SPRINT_CHECKLIST.md`

If a document becomes too large or mixes concerns, split it into smaller files and update this index.

---

## Core Control Documents

### `docs/MASTER_BLUEPRINT.md`
Top-level source of truth.  
Contains:
- product vision
- MVP definition
- architecture summary
- cost, quality, and scaling principles
- execution direction

### `docs/DECISIONS.md`
Decision log for major product, engineering, architecture, and operational choices.  
Each entry should include:
- decision
- status
- rationale
- alternatives considered
- date

### `docs/CHANGELOG.md`
High-level record of meaningful documentation, product, and architecture changes.

---

## Product Documentation

### `docs/product/vision.md`
Long-term product vision and positioning.

### `docs/product/mvp-scope.md`
Defines what is included in launch MVP and what is excluded.

### `docs/product/user-personas.md`
Primary user groups, goals, and pain points.

### `docs/product/user-flows.md`
Core user journeys:
- visitor to signup
- free exam flow
- paid package flow
- purchased workspace flow

### `docs/product/pricing-and-access.md`
Commercial model and access rules:
- free vs paid
- entitlement duration
- expiry behavior
- renewal direction

### `docs/product/launch-plan.md`
Launch goals, readiness criteria, and staged rollout assumptions.

---

## Architecture Documentation

### `docs/architecture/system-architecture.md`
System boundaries and architectural pattern.  
Defines:
- modular monolith approach
- core modules
- reliability approach
- scaling constraints

### `docs/architecture/tech-stack.md`
Chosen technologies and why they were selected.

### `docs/architecture/data-model.md`
Core entities, relationships, schema direction, and data rules.

### `docs/architecture/exam-engine.md`
Exam runtime rules and edge cases:
- practice mode
- timed mode
- autosave
- deadline behavior
- scoring inputs and outputs

### `docs/architecture/auth-and-roles.md`
Authentication, authorization, user roles, and route protection rules.

### `docs/architecture/payments-and-entitlements.md`
Checkout, webhook, entitlement creation, expiry, and access gating logic.

### `docs/architecture/ai-strategy.md`
AI use policy across build-time and runtime use cases.  
Must define:
- allowed AI use
- forbidden AI use
- fallback rules
- caching rules
- API cost controls

### `docs/architecture/security.md`
Security rules and protection boundaries:
- secrets
- access checks
- server authority
- admin protection
- payment/webhook verification

### `docs/architecture/scaling-strategy.md`
How PrepHatch should scale over time without premature complexity.

---

## Engineering Documentation

### `docs/engineering/implementation-plan.md`
Primary implementation guide.  
Defines:
- build order
- engineering priorities
- development phases
- dependencies between modules

### `docs/engineering/IMPLEMENTATION_BACKLOG.md`
Execution backlog derived from the blueprint.  
Use this as the main working list for:
- phase-by-phase delivery
- task prioritization
- definitions of done
- feature sequencing

### `docs/engineering/FIRST_SPRINT_CHECKLIST.md`
Narrow, launch-critical checklist for sprint 1.  
Focus:
- app scaffold
- auth
- schema foundation
- free exam flow
- results and review
- CI and preview safety

### `docs/engineering/repo-structure.md`
Folder and module organization for the codebase.

### `docs/engineering/coding-standards.md`
Code quality rules:
- strict typing
- thin handlers
- service boundaries
- validation rules
- test expectations

### `docs/engineering/api-spec.md`
Application API contracts and request/response rules.

### `docs/engineering/testing-strategy.md`
Testing plan across:
- unit tests
- integration tests
- end-to-end tests
- release smoke tests

### `docs/engineering/devops.md`
Deployment flow, preview strategy, CI/CD rules, and environment controls.

### `docs/engineering/migrations.md`
Migration workflow and schema-change safety rules.

---

## Operations Documentation

### `docs/operations/content-ops.md`
Content management workflow for questions, explanations, notes, cheatsheets, and review status.

### `docs/operations/support-runbook.md`
Support process for common issues:
- login
- access
- payment
- content
- exam problems

### `docs/operations/incident-runbook.md`
Incident handling process:
- identify
- assess
- contain
- fix
- verify
- record prevention step

### `docs/operations/release-checklist.md`
Pre-release and post-deploy release checklist.

### `docs/operations/qa-checklist.md`
Manual QA checklist for launch-critical flows.

### `docs/operations/cost-control.md`
Operational rules for minimizing spend:
- API cost monitoring
- AI cache policy
- infrastructure constraints
- avoided tools/services

---

## Prompt Libraries

### `docs/prompts/product-planning-prompts.md`
Prompt templates for product planning and scoping work.

### `docs/prompts/architecture-prompts.md`
Prompt templates for architecture decisions, data modeling, and system review.

### `docs/prompts/coding-prompts.md`
Prompt templates for generating or updating code safely.

### `docs/prompts/testing-prompts.md`
Prompt templates for test generation and QA scenarios.

### `docs/prompts/bugfix-prompts.md`
Prompt templates for debugging and incident analysis.

### `docs/prompts/deployment-prompts.md`
Prompt templates for deployment, release checks, and production hardening.

---

## Reading Paths

### For strategy work
1. `docs/MASTER_BLUEPRINT.md`
2. `docs/DECISIONS.md`
3. `docs/product/vision.md`
4. `docs/product/mvp-scope.md`

### For architecture work
1. `docs/MASTER_BLUEPRINT.md`
2. `docs/architecture/system-architecture.md`
3. `docs/architecture/data-model.md`
4. `docs/architecture/exam-engine.md`
5. `docs/architecture/payments-and-entitlements.md`
6. `docs/architecture/ai-strategy.md`

### For implementation work
1. `docs/MASTER_BLUEPRINT.md`
2. `docs/engineering/implementation-plan.md`
3. `docs/engineering/IMPLEMENTATION_BACKLOG.md`
4. `docs/engineering/FIRST_SPRINT_CHECKLIST.md`
5. `docs/engineering/repo-structure.md`
6. `docs/engineering/coding-standards.md`

### For launch readiness
1. `docs/engineering/testing-strategy.md`
2. `docs/engineering/devops.md`
3. `docs/operations/qa-checklist.md`
4. `docs/operations/release-checklist.md`
5. `docs/operations/cost-control.md`

---

## Documentation Rules

- Keep `MASTER_BLUEPRINT.md` strategic, not overloaded.
- Put detailed rules in section files.
- Update `DECISIONS.md` when a meaningful decision changes.
- Update `CHANGELOG.md` when documentation or major implementation direction changes.
- Prefer clarity over completeness in any single file.
- Write docs so both humans and AI agents can follow them safely.

---

## Current Priority Files

These files should stay most up to date during active development:

1. `docs/MASTER_BLUEPRINT.md`
2. `docs/DECISIONS.md`
3. `docs/engineering/implementation-plan.md`
4. `docs/engineering/IMPLEMENTATION_BACKLOG.md`
5. `docs/engineering/FIRST_SPRINT_CHECKLIST.md`
6. `docs/architecture/system-architecture.md`
7. `docs/architecture/data-model.md`
8. `docs/architecture/exam-engine.md`
9. `docs/architecture/payments-and-entitlements.md`
10. `docs/architecture/ai-strategy.md`

---

## Maintenance Note

Whenever a new documentation file is created, add it here immediately.
This index must remain the fastest way to understand the repo.