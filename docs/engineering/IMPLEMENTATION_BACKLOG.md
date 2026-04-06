# PrepHatch Implementation Backlog

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Convert the blueprint into a practical build backlog for AI-assisted development.

## How to Use This File

This is the only active execution plan below `docs/MASTER_BLUEPRINT.md`.

Rules:
- keep tasks small enough for one focused coding session
- do not start payment or AI work until the free-exam flow works end to end
- do not implement scope that is marked post-launch or deferred
- treat missing spec dependencies as blockers, not as invitations to improvise

Status values:
- TODO
- IN_PROGRESS
- BLOCKED
- DONE

Priority values:
- P0 = launch-critical
- P1 = important but can follow the core loop
- P2 = post-launch

## Spec Dependencies

Build-blocking specs now resolved in:
- `docs/architecture/data-model.md`
- `docs/architecture/exam-engine.md`
- `docs/product/pricing-and-access.md`
- `docs/engineering/api-spec.md`

## Sprint 1 Target Slice

Goal:
- user can sign up
- user can log in
- user can open the AWS package page
- user can start the free mock
- user can answer and submit
- user can see stable results with base explanations

Out of sprint:
- payments
- premium mocks
- admin UI
- AI endpoint
- notes and cheatsheets
- richer analytics

---

# Phase 0 - Repo and Delivery Foundation

## PH0-01 Initialize app scaffold
Status: TODO  
Priority: P0

Definition of Done:
- Next.js app initialized
- TypeScript strict mode enabled
- Tailwind configured
- repo layout matches `docs/engineering/repo-structure.md`
- `dev`, `build`, `lint`, `test`, `typecheck` scripts exist

## PH0-02 Environment and CI baseline
Status: TODO  
Priority: P0

Definition of Done:
- `.env.example` exists
- env validation fails fast in development
- GitHub Actions runs install, lint, typecheck, test, and build
- preview deploys are enabled for pull requests

---

# Phase 1 - Auth and User Bootstrap

## PH1-01 Supabase auth wiring
Status: TODO  
Priority: P0

Depends on:
- `architecture/auth-and-roles.md`

Definition of Done:
- email/password sign-up and sign-in work
- Google sign-in works
- auth callback works in local and preview

## PH1-02 Profiles and roles
Status: TODO  
Priority: P0

Depends on:
- `architecture/data-model.md`

Definition of Done:
- `profiles` and `user_roles` exist
- new users get a profile row
- default role is learner

## PH1-03 Protected routes
Status: TODO  
Priority: P0

Definition of Done:
- unauthenticated users cannot start exams
- non-admin users cannot open admin routes
- authenticated users can access dashboard and package routes

---

# Phase 2 - Catalog and Free Exam Entry

## PH2-01 Catalog schema and seeds
Status: TODO  
Priority: P0

Definition of Done:
- certifications and exam packages tables exist
- AWS SAA-C03 package seed exists
- package can be queried by slug

## PH2-02 Homepage, dashboard, and package page
Status: TODO  
Priority: P0

Depends on:
- `product/user-flows.md`

Definition of Done:
- homepage links to the package
- dashboard shows package access state
- package detail page renders from database data

## PH2-03 Free mock discoverability
Status: TODO  
Priority: P0

Definition of Done:
- logged-in user can start the free mock from the package page
- unauthenticated start attempts redirect to auth and back

---

# Phase 3 - Question Bank and Attempt Schema

## PH3-01 Question bank schema
Status: TODO  
Priority: P0

Definition of Done:
- topics, questions, question_options, and question_topics exist
- one reviewed question with options can be stored and queried

## PH3-02 Mock composition schema
Status: TODO  
Priority: P0

Definition of Done:
- mock_exams and mock_exam_questions exist
- one free mock and 2 to 3 premium mocks can be modeled in data

## PH3-03 Attempt schema
Status: TODO  
Priority: P0

Definition of Done:
- attempts, attempt_answers, attempt_question_snapshots, and attempt_topic_scores exist
- attempt history is immutable after submit

---

# Phase 4 - Free Exam Engine

## PH4-01 Start attempt flow
Status: TODO  
Priority: P0

Depends on:
- `architecture/exam-engine.md`
- `engineering/api-spec.md`

Definition of Done:
- start attempt action creates attempt and snapshots
- active attempt can be safely reused when appropriate

## PH4-02 Practice and timed exam UI
Status: TODO  
Priority: P0

Definition of Done:
- practice mode supports check-answer flow
- timed mode supports timer, palette, navigation, and flagging
- timed mode reveals no explanation before submit

## PH4-03 Autosave and resume
Status: TODO  
Priority: P0

Definition of Done:
- answer selections autosave
- reload restores progress
- timed attempts never gain extra time

## PH4-04 Submit, score, and results
Status: TODO  
Priority: P0

Definition of Done:
- submit is idempotent
- score summary includes correct, incorrect, unanswered, percentage, scaled score, and readiness label
- results page shows per-question review, base explanation, and wrong-answer reasoning

---

# Phase 5 - Premium Access and Payments

## PH5-01 Commerce schema
Status: TODO  
Priority: P1

Definition of Done:
- orders, payments, and entitlements tables exist
- active entitlement can be queried by user and package

## PH5-02 Stripe checkout
Status: TODO  
Priority: P1

Definition of Done:
- checkout session only created for authenticated users
- package and user are validated server-side

## PH5-03 Webhook and entitlement creation
Status: TODO  
Priority: P1

Definition of Done:
- successful payment creates exactly one entitlement
- duplicate webhook delivery does not create duplicate unlocks

## PH5-04 Premium route guards and workspace
Status: TODO  
Priority: P1

Definition of Done:
- non-entitled users cannot open premium workspace
- paid users can access 2 to 3 premium mocks
- expired users see locked state and renewal CTA

---

# Phase 6 - Minimal Admin and Content Ops

## PH6-01 Admin route protection
Status: TODO  
Priority: P1

Definition of Done:
- admin route group exists
- non-admin access is blocked server-side

## PH6-02 Question CRUD and publish flow
Status: TODO  
Priority: P1

Depends on:
- `operations/content-ops.md`

Definition of Done:
- admin can create and edit draft questions
- publish requires base explanation, wrong-answer reasoning, topic tags, and review metadata

## PH6-03 Mock composition
Status: TODO  
Priority: P1

Definition of Done:
- admin can assemble one free mock and 2 to 3 premium mocks
- ordering is stable and editable

---

# Phase 7 - AI Layer

## PH7-01 AI explanation endpoint
Status: TODO  
Priority: P1

Depends on:
- `architecture/ai-strategy.md`
- `engineering/api-spec.md`

Definition of Done:
- endpoint requires authenticated reviewed-question context
- AI output is optional and never replaces base explanation

## PH7-02 Cache, limits, and fallback
Status: TODO  
Priority: P1

Definition of Done:
- cache is keyed correctly
- per-user throttling exists
- AI failure leaves results page usable

---

# Phase 8 - Launch Hardening

## PH8-01 Automated tests for critical flows
Status: TODO  
Priority: P0

Definition of Done:
- unit coverage for scoring and entitlement logic
- integration coverage for auth bootstrap and attempt creation
- E2E coverage for signup to free mock to result

## PH8-02 Manual QA and release readiness
Status: TODO  
Priority: P0

Definition of Done:
- release checklist is executable
- QA checklist has reproducible scenarios
- preview passes launch-critical smoke paths

## Launchable When

- auth works in local and preview
- homepage, dashboard, and package page are live
- user can complete the free exam loop end to end
- payments unlock premium access correctly
- premium routes are server-protected
- minimal admin content ops work
- AI deep explanation is optional and safe
- tests and preview deployment cover critical flows
