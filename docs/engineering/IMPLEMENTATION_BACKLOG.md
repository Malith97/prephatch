# PrepHatch Implementation Backlog

Status: Active
Owner: Founder
Purpose: Convert the master blueprint into a practical build backlog for AI-assisted development.
Last Updated: 2026-04-06

## How to Use This File

Use this backlog as the execution layer below `docs/MASTER_BLUEPRINT.md`.

Rules:
- Keep tasks small enough for one focused coding session.
- Each task must have a clear definition of done.
- Do not start payment or AI tasks until the free-exam flow works end-to-end.
- Prefer fewer, fully tested features over a wide but fragile MVP.
- Update status after each completed task.

Status values:
- TODO
- IN_PROGRESS
- BLOCKED
- DONE

Priority values:
- P0 = launch-critical
- P1 = important but can wait until after the core loop works
- P2 = post-core or polish

---

# Phase 0 — Repo and Delivery Foundation

## PH0-01 Initialize app scaffold
Status: TODO  
Priority: P0

Goal:
Create the production app shell and repo conventions.

Deliverables:
- Next.js app initialized
- TypeScript strict mode enabled
- ESLint and Prettier configured
- basic folder structure created
- root scripts added for dev, build, lint, test, typecheck

Definition of Done:
- `npm run build` passes
- `npm run lint` passes
- `npm run typecheck` passes
- folder layout matches `docs/engineering/repo-structure.md`

## PH0-02 Add UI foundation
Status: TODO  
Priority: P0

Goal:
Set up a minimal but clean UI system.

Deliverables:
- Tailwind configured
- basic design tokens
- app shell layout
- public layout
- authenticated layout
- admin layout placeholder

Definition of Done:
- homepage renders
- dashboard placeholder renders
- admin placeholder route protected by stub logic

## PH0-03 Environment and secret management
Status: TODO  
Priority: P0

Goal:
Make environments safe and predictable.

Deliverables:
- `.env.example` completed
- `.env.local` strategy documented
- server-only vs client-exposed env variables documented
- env validation on app boot

Definition of Done:
- missing required env variables fail fast in development
- secrets are not referenced directly in UI components

## PH0-04 CI baseline
Status: TODO  
Priority: P0

Goal:
Prevent low-quality code from reaching main.

Deliverables:
- GitHub Actions workflow
- install, lint, typecheck, test, build steps
- PR check status required

Definition of Done:
- pipeline runs on pull requests
- failed checks block merge

---

# Phase 1 — Auth and User Bootstrap

## PH1-01 Supabase connection and auth wiring
Status: TODO  
Priority: P0

Goal:
Connect app to Supabase and enable the minimum auth system.

Deliverables:
- Supabase project connected
- email/password auth enabled
- Google auth enabled
- callback route implemented
- session handling added

Definition of Done:
- user can sign up with email
- user can sign in with email
- user can sign in with Google
- auth callback works in local and preview

## PH1-02 Profiles and roles schema
Status: TODO  
Priority: P0

Goal:
Create the identity base tables.

Deliverables:
- `profiles` table
- `user_roles` table
- auto-bootstrap profile on first login
- helper to detect admin vs learner

Definition of Done:
- new auth user gets a profile record
- default role is learner
- admin role can be set manually

## PH1-03 Protected routes and route groups
Status: TODO  
Priority: P0

Goal:
Enforce access at the routing layer.

Deliverables:
- public routes
- authenticated user routes
- admin routes
- middleware or server guard policy

Definition of Done:
- unauthenticated user cannot open dashboard
- non-admin cannot open admin routes
- authenticated user can access dashboard

---

# Phase 2 — Catalog and Free Exam Entry Loop

## PH2-01 Catalog schema
Status: TODO  
Priority: P0

Goal:
Create the minimum package catalog.

Deliverables:
- `certifications`
- `exam_packages`
- initial AWS SAA-C03 seed

Definition of Done:
- one package appears in UI from database data
- package can be queried by slug/code

## PH2-02 Dashboard marketplace
Status: TODO  
Priority: P0

Goal:
Build the logged-in home for users.

Deliverables:
- dashboard route
- package card UI
- package state badge
- purchased section placeholder

Definition of Done:
- logged-in user sees AWS package card
- package state shows free or locked correctly for learner

## PH2-03 Package detail page
Status: TODO  
Priority: P0

Goal:
Build the main conversion page.

Deliverables:
- package header
- package summary
- included resources summary
- price placeholder
- free exam CTA
- buy CTA placeholder

Definition of Done:
- package detail page renders from seeded data
- free exam CTA routes correctly

---

# Phase 3 — Question Bank and Attempt Schema

## PH3-01 Question schema
Status: TODO  
Priority: P0

Goal:
Create reusable question-bank tables.

Deliverables:
- `topics`
- `questions`
- `question_options`
- `question_topics`
- publish state fields

Definition of Done:
- one question with four options can be stored and queried
- one question can have one or more topics

## PH3-02 Mock exam schema
Status: TODO  
Priority: P0

Goal:
Create mock composition tables.

Deliverables:
- `mock_exams`
- `mock_exam_questions`
- support fixed ordering
- support free vs premium exam flags

Definition of Done:
- free mock can be defined in data
- one mock can be loaded with ordered questions

## PH3-03 Attempt schema
Status: TODO  
Priority: P0

Goal:
Create exam runtime tables with historical integrity.

Deliverables:
- `attempts`
- `attempt_answers`
- `attempt_question_snapshots`
- `attempt_topic_scores`

Definition of Done:
- attempt can be created
- answer can be autosaved
- submitted attempt cannot be mutated except by explicit system rules

---

# Phase 4 — Free Exam Engine

## PH4-01 Start attempt flow
Status: TODO  
Priority: P0

Goal:
Allow a logged-in user to start the free mock exam.

Deliverables:
- start attempt action
- attempt record creation
- question snapshot generation at start
- route to attempt screen

Definition of Done:
- user can start free mock from package page
- attempt contains the correct number of snapshotted questions

## PH4-02 Practice mode UI
Status: TODO  
Priority: P0

Goal:
Implement practice-mode interaction.

Deliverables:
- question card
- answer selection
- check answer action
- locked-answer behavior
- explanation panel

Definition of Done:
- user can answer one question
- answer locks after check
- explanation and wrong-answer reasoning appear

## PH4-03 Timed mode UI
Status: TODO  
Priority: P0

Goal:
Implement timed-mode interaction with server authority.

Deliverables:
- timer display
- palette/grid
- flagging
- next/previous navigation
- unanswered warning before submit

Definition of Done:
- deadline is stored server-side
- timer resumes correctly on refresh before deadline
- user cannot submit new answers after deadline

## PH4-04 Autosave and resume
Status: TODO  
Priority: P0

Goal:
Prevent accidental answer loss.

Deliverables:
- debounced autosave
- restore attempt state on reload
- practice resume
- timed resume before deadline only

Definition of Done:
- refresh restores current progress
- timed attempt never gains extra time

## PH4-05 Submit and score
Status: TODO  
Priority: P0

Goal:
Complete the first full learning loop.

Deliverables:
- final submit action
- auto-submit on timeout
- scoring engine
- readiness label
- topic breakdown

Definition of Done:
- user can complete free exam and reach results
- system computes correct, incorrect, unanswered, percentage, and scaled score

## PH4-06 Results and review page
Status: TODO  
Priority: P0

Goal:
Show credible value after completion.

Deliverables:
- score summary
- readiness label
- topic breakdown
- per-question review
- explanation and wrong-answer reasoning
- premium upgrade CTA

Definition of Done:
- results page is stable without AI
- upgrade CTA is visible and contextual

---

# Phase 5 — Premium Access and Payments

## PH5-01 Commerce schema
Status: TODO  
Priority: P1

Goal:
Create purchase and entitlement models.

Deliverables:
- `orders`
- `payments`
- `entitlements`

Definition of Done:
- active entitlement can be queried by user and package
- expiry is computed from purchase date

## PH5-02 Stripe checkout
Status: TODO  
Priority: P1

Goal:
Allow purchase of the first package.

Deliverables:
- checkout session action
- success/cancel routes
- server-side verification path

Definition of Done:
- checkout session created only for authenticated user
- package id and user id are validated server-side

## PH5-03 Webhook and entitlement creation
Status: TODO  
Priority: P1

Goal:
Unlock premium content reliably.

Deliverables:
- webhook endpoint
- idempotency handling
- order record creation
- entitlement record creation

Definition of Done:
- successful payment creates one valid entitlement
- repeated webhook delivery does not create duplicate entitlements

## PH5-04 Premium route guards
Status: TODO  
Priority: P1

Goal:
Protect paid product surfaces.

Deliverables:
- server-side entitlement checks
- premium mock exam lock
- workspace access guard
- expired state handling

Definition of Done:
- non-entitled user cannot open premium workspace
- entitled user can access premium workspace
- expired user sees clear locked state

---

# Phase 6 — Minimal Admin and Content Ops

## PH6-01 Admin authentication and layout
Status: TODO  
Priority: P1

Goal:
Enable the first admin surface safely.

Deliverables:
- admin route group
- admin navigation
- admin guard enforcement

Definition of Done:
- non-admin blocked
- admin can access admin home

## PH6-02 Question CRUD
Status: TODO  
Priority: P1

Goal:
Create and maintain questions without code edits.

Deliverables:
- create question form
- option management
- topic tagging
- explanation editing
- publish/draft/archive actions

Definition of Done:
- admin can create draft question
- admin can publish only when required fields exist

## PH6-03 Mock composition UI
Status: TODO  
Priority: P1

Goal:
Assemble free and premium mocks from the reusable bank.

Deliverables:
- mock editor
- ordered question mapping
- free vs premium flag

Definition of Done:
- admin can create one free mock and one premium mock from the bank

## PH6-04 Markdown content resources
Status: TODO  
Priority: P1

Goal:
Keep notes and cheatsheets low-cost and low-bug.

Deliverables:
- markdown storage strategy
- notes CRUD
- cheatsheets CRUD
- sanitized rendering

Definition of Done:
- premium notes render safely
- premium cheatsheets render safely

---

# Phase 7 — AI Layer (Strictly Controlled)

## PH7-01 AI explanation endpoint
Status: TODO  
Priority: P1

Goal:
Provide optional deep explanation without making AI the source of truth.

Deliverables:
- server endpoint for explanation generation
- provider adapter
- strict prompt template
- response guardrails

Definition of Done:
- endpoint requires authenticated user
- endpoint requires question id and validated context
- failure does not break results page

## PH7-02 Cache and budget controls
Status: TODO  
Priority: P1

Goal:
Minimize API spend.

Deliverables:
- per-question cache
- usage logging
- request throttling
- prompt-size limits

Definition of Done:
- repeat requests reuse cached explanation where appropriate
- AI requests can be counted per user and per question

## PH7-03 AI quality fallback
Status: TODO  
Priority: P1

Goal:
Preserve trust when AI is slow, expensive, or low quality.

Deliverables:
- base explanation remains default truth
- fallback UI state
- timeout handling
- moderation/error messaging

Definition of Done:
- learner always sees a base explanation even if AI fails

---

# Phase 8 — QA, Preview, and Launch Hardening

## PH8-01 Preview environment
Status: TODO  
Priority: P0

Goal:
Create a safe environment between local and production.

Deliverables:
- preview deploys from pull requests or preview branch
- protected access
- env variables configured separately

Definition of Done:
- auth and callback URLs work in preview
- payment test mode works in preview

## PH8-02 Automated tests for critical flows
Status: TODO  
Priority: P0

Goal:
Reduce regressions in the most dangerous areas.

Deliverables:
- unit tests for scoring and entitlement logic
- integration tests for auth and attempt creation
- e2e tests for free exam loop

Definition of Done:
- CI runs tests automatically
- failures block merge

## PH8-03 Launch checklist
Status: TODO  
Priority: P0

Goal:
Ship with discipline.

Deliverables:
- smoke test checklist
- rollback notes
- support contact path
- basic analytics events

Definition of Done:
- all launch-critical checks pass in preview and production

---

# Recommended Build Order

1. PH0-01 to PH0-04
2. PH1-01 to PH1-03
3. PH2-01 to PH2-03
4. PH3-01 to PH3-03
5. PH4-01 to PH4-06
6. PH8-01 and PH8-02
7. PH5-01 to PH5-04
8. PH6-01 to PH6-04
9. PH7-01 to PH7-03
10. PH8-03

---

# Launch-Critical Scope Only

The product is launchable when all of the following are true:
- user can sign up and sign in
- user can open dashboard and package detail page
- user can start and complete the free exam
- user can see score, review, and explanation
- premium purchase unlocks premium access correctly
- premium routes are protected server-side
- base explanations work without AI
- tests and preview deployment cover core flows

Anything else is optional until this list is stable.
