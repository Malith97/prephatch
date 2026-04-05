# PrepHatch Master Blueprint v2 — AI-Optimized, Cost-Disciplined, Scale-Ready

> Canonical source of truth for PrepHatch product, architecture, implementation, testing, deployment, and operations.
> This version replaces vague or high-risk decisions with explicit rules optimized for AI-assisted execution, lower cost, higher quality, and future scalability.

---

## 0. Document Control

- **Project:** PrepHatch
- **Version:** v2
- **Status:** Active canonical blueprint
- **Owner:** Founder
- **Product Type:** Certification exam-readiness platform
- **Primary Objective:** Launch a high-quality, low-cost, scalable MVP for one certification, validate demand, and expand safely
- **Primary Constraints:** solo-founder execution, cost sensitivity, AI-assisted development, high reliability, low bug tolerance

### 0.1 Purpose of This Document

This document exists to make planning, building, testing, and operating PrepHatch easier for both:
- human contributors
- AI coding / planning systems

It is intentionally:
- explicit
- low-ambiguity
- modular
- implementation-oriented
- diff-friendly
- optimized for task decomposition

### 0.2 How AI Must Use This Document

Any AI used for planning, coding, refactoring, testing, reviewing, or deployment must follow these rules:

1. Treat this document as the **canonical product and architecture contract**.
2. Do not invent business rules that are not stated here.
3. If a requested change conflicts with this document, surface the conflict explicitly.
4. Optimize for:
   - correctness first
   - low operational cost second
   - delivery speed third
5. Do not introduce new infrastructure, vendors, or abstractions without clear justification.
6. Do not move core logic into runtime AI where deterministic code is safer.
7. Every implementation task should reference relevant section numbers from this blueprint.
8. All code changes must include tests proportionate to risk.
9. Human approval is required for:
   - production deploys
   - payment changes
   - auth changes
   - schema migrations
   - entitlement logic changes
10. When uncertain, prefer the simpler, cheaper, more testable design.

### 0.3 Decision Precedence

When two sources conflict, resolve in this order:
1. this blueprint
2. frozen decisions register
3. approved change log / ADR
4. implementation notes
5. AI suggestions

### 0.4 Change Management Rule

No AI or human contributor should silently change product rules.
Any material change to:
- pricing
- package access
- exam behavior
- scoring rules
- authentication methods
- data model invariants
- deployment strategy

must be recorded in:
- `docs/DECISIONS.md`
- and, if still active, reflected back into this blueprint

---

# 1. Executive Summary

PrepHatch is a focused certification exam-readiness platform.
Its first product is a preparation package for **AWS Certified Solutions Architect – Associate (SAA-C03)**.

PrepHatch is **not** a course marketplace, dumping site, or general education portal.
It is a structured exam simulator and review system designed to help users:
- practice in exam-like conditions
- understand why answers are correct or wrong
- identify weak areas
- build readiness with measurable progress

## 1.1 Strategic Thesis

Users will pay for a prep product that is:
- more structured than scattered free resources
- more trustworthy than dumps
- more exam-like than note collections
- more practical than generic AI tutoring

## 1.2 Core Product Promise

A learner should be able to:
- take a realistic mock exam
- review detailed explanations
- understand weak areas
- improve over multiple attempts
- feel more confident before the real exam

## 1.3 Launch Principle

PrepHatch v1 must ship as a **tight vertical slice**, not as a broad feature platform.
The launch product must optimize for:
- validation speed
- content quality
- reliability
- low cost
- future extensibility

## 1.4 Most Important Product Rule

The platform must remain useful **even if runtime AI is disabled**.

Stored content, deterministic exam logic, and premium access control are the true core.
AI is only a value amplifier.

---

# 2. Product Goals, Constraints, and Non-Negotiables

## 2.1 Primary Business Goal

Validate that users will pay for a focused exam package built around high-quality mock exams and explanations.

## 2.2 Primary Product Goal

Deliver one certification package that feels reliable, professional, and clearly more useful than scattered free alternatives.

## 2.3 Primary Technical Goal

Build a low-complexity system that can scale from one exam package to many without a rewrite.

## 2.4 Hard Constraints

- solo-founder-friendly
- low monthly burn
- low AI API spend
- low operational overhead
- low incident risk
- limited manual support burden
- minimal infrastructure sprawl

## 2.5 Non-Negotiables

These are mandatory:
- modular monolith architecture
- strict server-side entitlement enforcement
- immutable submitted attempt history
- stored base explanations for every published question
- ability to operate without runtime AI
- small real MVP
- deterministic exam engine behavior
- preview environment before production
- automated testing for critical flows
- human approval for risky changes

---

# 3. Product Scope

## 3.1 Product Identity

PrepHatch is:
- a realistic exam simulator
- a structured review system
- a premium exam-readiness product

PrepHatch is not:
- a video course platform
- a generic AI chat app
- a content marketplace
- an enterprise learning suite

## 3.2 First Certification

Launch with one certification only:
- **AWS SAA-C03**

## 3.3 Real MVP Definition

The MVP is the smallest version that can prove willingness to pay.

### Included in launch MVP
- public homepage
- package detail page
- login required for free trial
- authentication via:
  - Google OAuth
  - email magic link / OTP
- one free mock exam
- 2 to 3 premium mock exams
- practice mode
- timed mode
- deterministic scoring
- result and review page
- basic progress summary
- paid package workspace
- one-time purchase via Stripe
- 365-day entitlement
- notes and cheatsheets as simple Markdown content
- minimal admin for content management
- runtime AI deep explanation as optional, on-demand enhancement only

### Explicitly excluded from launch MVP
- Facebook login
- custom email/password auth unless required later
- subscriptions
- bundles
- team / enterprise accounts
- mobile app
- community features
- live AI tutor chat
- AI weak-area coach
- advanced analytics suite
- complex editorial workflow
- feature-rich WYSIWYG editors
- proctoring
- screenshot blocking claims
- multi-language support
- separate microservices
- vector database / RAG stack
- coupons at initial launch unless needed for a specific campaign

## 3.4 Post-Launch Phase 1 Candidates

Only after launch stability and demand validation:
- more premium mock exams
- coupon support
- richer analytics
- richer notes and cheatsheets
- AI study guidance
- additional auth providers if demand justifies them

## 3.5 Post-Launch Phase 2 Candidates

- second certification
- renewal offers
- bundles
- smarter study plans
- broader content automation
- team/B2B options

---

# 4. Target Users and Positioning

## 4.1 Primary Users

PrepHatch targets learners actively preparing for a specific certification exam, especially:
- working professionals
- career switchers
- retake candidates
- motivated beginners

## 4.2 Primary User Pain Points

Users often struggle with:
- fragmented prep resources
- low-trust dumps
- weak explanations
- no clear readiness signal
- unrealistic practice experiences
- too much irrelevant content

## 4.3 Positioning Statement

PrepHatch is a serious exam-readiness platform for certification learners who want realistic practice, clear explanations, and a trustworthy path to feeling ready.

## 4.4 Product Tone

The product should feel:
- serious
- technical
- clear
- structured
- trustworthy
- modern

---

# 5. Core User Experience and Conversion Flow

## 5.1 Primary Conversion Flow

This is the most important flow in the whole product:

1. visitor lands on homepage or package page
2. visitor understands the certification package and value proposition
3. visitor signs in or creates an account
4. visitor takes the free mock exam
5. visitor sees score, explanation quality, and weak-area signal
6. visitor sees a clear upgrade path to premium
7. visitor buys the package
8. system unlocks premium access
9. user enters purchased workspace
10. user keeps practicing and reviewing until confident

## 5.2 Product Navigation Model

The user experience has three major surfaces:

### Public surface
- homepage
- package detail page
- login entry points

### Learner surface
- dashboard
- package workspace
- exam engine
- results and history

### Admin surface
- content and publishing tools

## 5.3 Dashboard Rule

The dashboard is useful, but it is **not** the main growth surface.
The most important acquisition and conversion surfaces are:
- homepage
- package detail page
- free exam result page

## 5.4 Free Trial Rules

- login is required
- exactly one free mock exam for the launch certification
- free exam uses the same engine as premium
- free exam includes stored explanations
- free exam may include AI deep explanation on demand, subject to usage and cost controls
- free exam results must clearly upsell premium without hiding core value

## 5.5 Premium Workspace Rule

The premium workspace should be focused and low-clutter.
It should contain:
- premium mock exams
- recent attempts
- basic progress summary
- notes
- cheatsheets
- clear retake/start actions

---

# 6. Business Model and Access Model

## 6.1 Pricing Model

PrepHatch v1 uses:
- one-time purchase per certification package
- 365-day access window

## 6.2 Package Rule

A package is the commercial container for:
- one certification
- its mock exams
- its notes
- its cheatsheets
- its premium progress features

## 6.3 User States

- visitor
- free logged-in user
- paid active user
- expired user
- admin

## 6.4 Free User Access

Free users can:
- browse public pages
- log in
- take one free mock exam
- review its explanations
- see basic result history for that free exam

Free users cannot:
- access premium mock exams
- access premium workspace features
- access premium notes or cheatsheets
- access premium analytics

## 6.5 Paid User Access

Paid active users can access:
- premium mock exams
- package workspace
- notes
- cheatsheets
- basic and premium progress surfaces
- optional on-demand AI explanation features, within limits

## 6.6 Expired User Access

Expired users can:
- log in
- see that access has expired
- see basic historical attempt summaries
- see a renewal / repurchase CTA

Expired users cannot:
- start premium exams
- open premium notes or cheatsheets
- use premium AI features
- access premium-only analytics surfaces

## 6.7 Attempt History Rule

Attempt history is never deleted merely because entitlement expired.
The system preserves user history for trust, support, analytics, and reactivation.

What changes after expiry is feature access, not historical existence.

## 6.8 Repurchase / Renewal Rule

For MVP, use one simple rule:
- repurchase is blocked while entitlement is active
- repurchase or renewal becomes available when:
  - entitlement is expired, or
  - within the last 30 days before expiry

This rule must be implemented explicitly in code and UI.

## 6.9 Refund / Support Rule

Support remains manual-first.
Refund policy and contact path must exist before paid launch.

---

# 7. Runtime AI Strategy

## 7.1 Core Principle

AI is allowed only where it increases user value more than it increases cost, risk, or latency.

## 7.2 Launch Runtime AI Scope

Launch runtime AI supports one narrow feature:
- **deep explanation on demand** for a reviewed question

This is intentionally narrow.
It is not always-on.
It is not used during exam completion.
It is not required for scoring or premium access.

## 7.3 Runtime AI Must Not Control

Runtime AI must never be the source of truth for:
- correct answer validation
- scoring
- entitlement decisions
- payment unlock
- publish approval
- timing or submission rules

## 7.4 Cost Discipline Rules

Runtime AI must follow all of these rules:
- on-demand only
- never auto-generate for every question view
- cache outputs aggressively
- use the cheapest acceptable model by default
- use short, structured prompts
- include only required context
- rate limit usage per user and per question
- allow AI to be disabled without breaking the product

## 7.5 AI Caching Rule

Cache key should include at least:
- question_id
- explanation_type
- prompt_version
- model_name
- locale

Cached answers should be reused whenever safe.

## 7.6 AI Provider Abstraction

Runtime AI integration should be provider-agnostic behind a small internal interface.
Do not hard-code product logic around one model vendor.

## 7.7 AI Failure Rule

If AI fails, the user must still have:
- stored explanation
- correct answer
- wrong-answer reasoning

AI failure must degrade gracefully and silently, not break the result page.

## 7.8 Build-Time AI Strategy

AI should be heavily used during internal workflows for:
- planning
- task decomposition
- code scaffolding
- migrations drafting
- test generation
- documentation
- PR review
- bug triage
- refactoring suggestions

But all AI-generated outputs must be reviewed through defined quality gates.

---

# 8. AI-Optimized Execution Rules

## 8.1 Standard Work Pattern for AI

Every AI-assisted engineering task should follow this sequence:
1. read relevant blueprint sections
2. restate task and constraints
3. propose the smallest correct change
4. implement code
5. add or update tests
6. run checks
7. summarize risks and assumptions

## 8.2 Output Format for AI Engineering Tasks

When AI is asked to implement something, it should return:
- files to create/change
- high-level approach
- code changes
- tests added/updated
- migration impact
- rollback considerations
- unresolved questions

## 8.3 Mandatory AI Guardrails

AI must not:
- introduce libraries without justification
- change schema casually
- remove tests to make builds pass
- silence lint/type errors without understanding them
- skip idempotency in payment flows
- put secrets in code
- embed provider-specific logic deep in domain code
- introduce runtime AI in core hot paths

## 8.4 Human Review Requirements

A human must review:
- auth changes
- payment flows
- webhook handlers
- migrations
- exam engine timing logic
- access control
- production configs

---

# 9. Technical Architecture

## 9.1 Architecture Pattern

PrepHatch is built as a **modular monolith**.

This means:
- one primary application codebase
- one primary relational database
- one deployment unit for the app
- clear internal module boundaries
- no microservices in MVP

## 9.2 Why Modular Monolith

This pattern is chosen because it is best for:
- low cost
- faster development
- easier testing
- lower operational overhead
- easier AI-assisted code generation
- future extraction if growth later demands it

## 9.3 Recommended Stack

### Application
- Next.js (App Router)
- TypeScript in strict mode
- Tailwind CSS

### Backend / Data
- PostgreSQL
- Supabase for database, auth, and storage

### Payments
- Stripe

### Hosting
- Vercel for MVP deployment simplicity and lower execution risk

### Monitoring / Error Tracking
- minimal error tracking and structured logs from launch

## 9.4 Hosting Decision Rationale

Although Cloudflare can be cost-efficient, the recommended MVP hosting default is Vercel because it reduces integration and deployment complexity for a Next.js-first, AI-assisted, solo-founder workflow.

This is a quality-over-micro-savings decision.

Re-evaluate hosting only if:
- traffic grows materially
- serverless cost becomes meaningful
- product-market fit is already validated

## 9.5 Module List

Core modules:
- auth
- catalog
- packages
- entitlements
- exams
- attempts
- progress
- content
- admin
- payments
- ai
- support_ops

## 9.6 Server-Side Protection Principles

Never trust the frontend for:
- entitlement access
- admin access
- scoring
- timeout logic
- payment confirmation
- publish state decisions

## 9.7 Data Access Strategy

Use a mixed strategy:
- safe user-owned reads/writes through well-defined access rules
- privileged operations through server-side service layer
- keep domain logic out of UI components

## 9.8 Infrastructure Simplicity Rule

No queues, workers, or extra services at launch unless proven necessary.
Use synchronous or lightweight background-safe operations where possible.

Introduce asynchronous infrastructure only after a clear bottleneck exists.

---

# 10. Data Model and Domain Rules

## 10.1 Core Entity Groups

### Identity
- profiles
- user_roles

### Catalog and Commerce
- certifications
- exam_packages
- package_resources
- orders
- payments
- entitlements

### Content Taxonomy
- topics

### Question Bank
- questions
- question_options
- question_topics
- mock_exams
- mock_exam_questions

### Runtime
- attempts
- attempt_answers
- attempt_question_snapshots
- attempt_topic_scores

### Learning Resources
- notes
- cheatsheets

### AI
- ai_generation_cache

### Admin / Ops
- import_jobs
- support_events
- product_events

## 10.2 Key Schema Decisions

- submitted attempts are immutable
- questions are snapshotted into attempt history at submission time
- questions have publish state and review metadata
- stored base explanations are mandatory for publishable questions
- wrong-answer reasoning is mandatory for publishable questions
- topics are reusable across questions and analytics
- entitlements are the source of truth for premium access

## 10.3 Content Governance Fields

Published question records should include metadata for trust and maintenance:
- status
- version
- last_reviewed_at
- reviewer_note
- source_reference_note
- archived_reason (if archived)

These fields are worth the small cost because they protect long-term content quality.

## 10.4 Notes and Cheatsheets Format

Use **Markdown or MDX-style structured content** for launch.
Do not use a complex WYSIWYG editor in MVP.

Rationale:
- lower bug surface
- easier AI generation and editing
- easier diffing in Git
- cheaper implementation
- cleaner content portability

---

# 11. Exam Engine Specification

## 11.1 Supported Question Type

Launch supports only:
- multiple-choice
- single-answer questions

No multi-select at launch.

## 11.2 Engine Modes

- practice mode
- timed mode

Both modes use the same core data model and scoring pipeline.

## 11.3 Practice Mode Rules

- user answers one question
- answer is checked explicitly
- explanation becomes visible immediately after checking
- wrong-answer reasoning is visible
- answer locks after checking
- user proceeds to next question

## 11.4 Timed Mode Rules

- timer starts when the attempt is created
- deadline is computed server-side and stored as immutable `deadline_at`
- no pause
- no explanation during active attempt
- question palette/grid visible
- flagging available
- unanswered warning before manual submit
- auto-submit on timeout

## 11.5 Exam Timing Invariants

These rules are mandatory:
- the server is the source of truth for time
- client timers are display-only helpers
- answers written after deadline are rejected
- reconnecting does not extend time
- resuming is allowed only before deadline
- one active timed attempt per user per mock exam at a time

## 11.6 Multi-Tab / Reconnect Rule

MVP does not attempt heavy anti-cheat enforcement.
Instead it guarantees consistency:
- last valid write before deadline wins
- no extra time is granted
- submission state remains deterministic

## 11.7 Autosave Rule

Answers must autosave during both modes using a simple, reliable pattern.
Prefer fewer reliable writes over noisy chatty writes.

## 11.8 Submission States

Suggested attempt lifecycle:
- created
- in_progress
- submitted
- auto_submitted
- scored

## 11.9 Scoring Outputs

Expose:
- correct count
- incorrect count
- unanswered count
- raw percentage
- PrepHatch scaled score out of 1000
- readiness label

## 11.10 Scoring Communication Rule

The 1000-scale score must be clearly labeled as an **internal PrepHatch readiness score**, not an official AWS exam score.

## 11.11 Readiness Labels

Initial label set:
- Not Ready
- Improving
- Nearly Ready
- Exam Ready

These are product labels, not exam authority claims.

## 11.12 Review Page Requirements

For every reviewed question show:
- selected answer
- correct answer
- stored explanation
- why wrong answers are wrong
- topic labels
- optional AI deep explanation action

---

# 12. Content System and Admin Operations

## 12.1 Content Philosophy

PrepHatch wins on trustworthy content quality, not content quantity.

## 12.2 Content Types in Launch

- certification
- package
- topic
- question
- mock exam
- note
- cheatsheet

## 12.3 Minimal Admin Scope for Launch

Launch admin must support:
- certification CRUD
- package CRUD
- topic CRUD
- question CRUD
- mock exam composition
- Markdown notes and cheatsheets management
- publish / unpublish
- archive
- CSV import to draft state

Anything beyond this is optional and should not delay launch.

## 12.4 Content Status Model

Recommended question lifecycle:
- draft
- review_ready
- published
- archived

## 12.5 Publish Guard Rule

A question cannot be published unless it has:
- stem
- options
- exactly one correct answer
- base explanation
- wrong-answer reasoning
- at least one topic tag

## 12.6 Import Rule

Imported questions default to `draft`.
No imported question is auto-published.

## 12.7 Manual Quality Gate

Before content goes live, a human must verify:
- correctness
- wording clarity
- explanation quality
- answer-key correctness
- topic tagging sanity

---

# 13. Payments, Entitlements, and Access Control

## 13.1 Payment Flow

Launch uses:
- Stripe checkout
- server-side payment verification
- webhook-driven entitlement activation

## 13.2 Payment Safety Rules

Mandatory:
- webhook idempotency
- order state tracking
- explicit entitlement creation on verified success
- no frontend-only unlocks
- logging for payment and entitlement transitions

## 13.3 Entitlement Source of Truth

Premium access is controlled only by entitlement records validated server-side.

## 13.4 What Entitlements Gate

- premium mock exams
- premium workspace
- notes
- cheatsheets
- premium analytics surfaces
- premium AI features

## 13.5 Coupon Policy

Coupons are not launch-critical.
Do not delay launch for coupon support.
Add only after payment flow is stable.

## 13.6 Admin Grant Policy

Admin testing access is allowed, but it must be explicitly tagged as non-revenue access.
It must not pollute revenue analytics.

---

# 14. Cost Optimization Strategy

## 14.1 Cost Philosophy

Spend only on what materially improves:
- launch speed
- user trust
- conversion
- system reliability

Avoid paying for optional sophistication too early.

## 14.2 Biggest Cost Risks

Primary variable cost risks:
- runtime AI usage
- unnecessary infrastructure complexity
- avoidable failed deployments
- support burden from buggy flows

## 14.3 Cost-Control Priorities

1. keep runtime AI narrow and cached
2. keep infrastructure simple
3. reduce manual support through clearer rules
4. prevent bugs in payments and entitlements
5. avoid vendors that add cost without reducing engineering risk

## 14.4 Runtime AI Cost Controls

Required controls:
- on-demand generation only
- caching
- per-user rate limits
- per-question reuse
- small default model
- ability to disable with config
- token-efficient prompts

## 14.5 Token Usage Discipline

All AI prompts used internally or at runtime should:
- include only necessary context
- avoid passing whole documents when a section will do
- prefer structured bullet context over verbose prose
- version prompts explicitly
- cache reusable outputs

## 14.6 Content Format as Cost Strategy

Markdown-first content reduces:
- editor complexity
- rendering complexity
- migration pain
- AI transformation cost
- QA burden

## 14.7 Analytics Cost Strategy

Launch with a lightweight event strategy.
Do not add multiple analytics vendors at the start.
Only track business-critical events first.

## 14.8 No-RAG Rule for MVP

Do not build a vector database or RAG pipeline at launch.
It adds cost and complexity without being necessary for the core product.

---

# 15. Quality, Testing, and Bug Prevention

## 15.1 Quality Philosophy

PrepHatch must favor fewer features with higher confidence over more features with shallow reliability.

## 15.2 Definition of Done

A feature is not done unless:
- product behavior is explicit
- edge cases are handled
- tests are added where appropriate
- logging exists for critical failures
- access control is correct
- error states are acceptable
- AI-generated code has been reviewed

## 15.3 Highest-Risk Areas

These areas require strongest scrutiny:
- auth
- payments
- entitlements
- timed exam behavior
- submission and scoring
- content publish rules
- migrations

## 15.4 Test Pyramid for Launch

### Unit tests
Use for:
- scoring logic
- entitlement state rules
- readiness labels
- date math
- publish guards
- AI fallback logic

### Integration tests
Use for:
- auth/profile bootstrap
- attempt creation
- answer autosave
- submit and scoring pipeline
- Stripe webhook to entitlement flow
- import to draft flow

### End-to-end tests
Required for:
1. visitor → login → free exam → results
2. user → payment → entitlement unlock → premium workspace
3. paid user → timed exam → timeout/submit → results
4. expired user blocked from premium exam start
5. admin creates/publishes content

## 15.5 AI-Assisted QA Workflow

AI may help generate tests and bug hypotheses, but must not replace actual execution.
Every critical flow must be exercised by real automated tests.

## 15.6 Regression Rule

Any bug found in:
- payments
- entitlements
- exam timing
- scoring
- publish rules

should receive a regression test before the fix is considered complete.

---

# 16. Deployment, Environments, and DevOps

## 16.1 Environment Strategy

Use exactly three environments:
- local
- preview
- production

This is the minimum responsible setup.

## 16.2 Deployment Rules

- production deploys come from main
- preview deploys are automatic for pull requests or equivalent branches
- tests must pass before merge
- risky changes require manual review before production deploy

## 16.3 Why Preview Exists

Preview is required to reduce launch risk for:
- auth callbacks
- payment flows
- route protection
- entitlement checks
- timed exam behavior
- content rendering

## 16.4 Secrets Rules

- never commit secrets
- keep local and production secrets separate
- maintain `env.example`
- rotate secrets if exposed

## 16.5 Migration Rules

- migrations are the source of truth
- never patch production schema manually unless emergency requires it
- every migration must be reviewed
- destructive migrations require extra caution and backup plan

## 16.6 Observability Requirements

At minimum capture:
- auth failures
- payment events
- entitlement changes
- attempt submission failures
- timeout auto-submits
- admin publish failures
- AI generation failures
- top conversion events

## 16.7 Smoke Test Checklist After Production Deploy

Must verify:
- homepage loads
- login works
- dashboard loads
- free exam starts
- results page renders
- premium gating works
- admin route protection works
- checkout can start
- entitlement unlock path works
- AI failure fallback works

---

# 17. Analytics and Product Events

## 17.1 Launch Analytics Goal

Track only the events needed to understand acquisition, activation, conversion, and major failure points.

## 17.2 Minimum Event Set

Track at least:
- homepage_viewed
- package_viewed
- login_started
- login_completed
- free_exam_started
- free_exam_completed
- upgrade_cta_clicked
- checkout_started
- checkout_completed
- premium_exam_started
- premium_exam_completed
- entitlement_activated
- entitlement_expired

## 17.3 Analytics Rule

Do not let analytics tooling delay launch.
Track fewer events correctly rather than many events badly.

---

# 18. Scalability Strategy

## 18.1 Scalability Goal

The system must scale from:
- one certification and low traffic

to:
- multiple certifications, more content, and higher traffic

without a rewrite.

## 18.2 Scalability Principles

- keep domain boundaries clean
- keep app stateless where possible
- keep data relational and indexed
- snapshot history where correctness matters
- avoid vendor lock into AI-specific assumptions
- scale architecture only when a clear bottleneck appears

## 18.3 Expected Early Bottlenecks

Likely future bottlenecks:
- more question/content volume
- more attempt history rows
- heavier analytics queries
- runtime AI latency/cost

## 18.4 Design Choices That Preserve Future Scale

Chosen now to support future scale:
- modular monolith
- package-based commerce model
- reusable question bank
- topic-based analytics
- attempt snapshots
- Markdown content portability
- provider-agnostic AI wrapper

## 18.5 What Not to Do Too Early

Do not prematurely add:
- microservices
- event buses
- distributed queues
- vector infrastructure
- advanced multi-tenant architecture
- excessive caching layers

---

# 19. Implementation Blueprint

## 19.1 Recommended Repository Shape

```text
prephatch/
  app/
  components/
  features/
  lib/
  server/
  content/
  supabase/
  scripts/
  tests/
  docs/
```

## 19.2 Content Storage Recommendation

Store stable notes and cheatsheets in a content-friendly format that is easy to version and diff.
Preferred options:
- database Markdown fields for simple admin editing
- or repository-backed Markdown files if workflow supports it

For MVP, avoid complex CMS infrastructure.

## 19.3 Feature Module Breakdown

```text
features/
  auth/
  catalog/
  packages/
  exams/
  attempts/
  progress/
  content/
  entitlements/
  payments/
  admin/
  ai/
```

## 19.4 Server Structure

```text
server/
  services/
  repositories/
  policies/
  validators/
  mappers/
  jobs/
```

## 19.5 Coding Standards

- strict TypeScript
- explicit domain types
- thin route handlers / actions
- no raw SQL or raw DB access in UI components
- keep business logic in services/policies
- avoid giant utility files
- prefer explicit code over clever abstractions

## 19.6 First Build Order

### Phase 0 — Foundation
- initialize app
- configure TypeScript, linting, formatting
- configure Supabase and env structure
- set up testing
- set up preview deployment

### Phase 1 — Free Exam Vertical Slice
- auth
- catalog/package page
- free mock exam data seed
- exam engine
- results/review
- basic progress summary

### Phase 2 — Payment and Premium Unlock
- Stripe checkout
- webhook handling
- entitlements
- premium workspace
- premium gates

### Phase 3 — Minimal Admin and Content Ops
- question CRUD
- mock composition
- notes/cheatsheets CRUD
- publish/archive
- CSV import to draft

### Phase 4 — Runtime AI Enhancement
- on-demand deep explanation
- caching
- usage limits
- fallback handling

### Phase 5 — Hardening and Launch
- QA
- logging review
- funnel tracking
- support flows
- launch docs and policies

## 19.7 First Visible Milestone

The first milestone that proves product direction is:

**A user can log in, open AWS SAA-C03, start the free mock exam, complete it, and view results with explanations and clear upgrade prompts.**

Until this exists, avoid spending time on advanced admin or AI features.

---

# 20. Operational Playbook

## 20.1 Support Model

Support is manual-first at launch.
Common issue categories:
- login/access
- payment
- premium unlock
- exam behavior
- content accuracy

## 20.2 Incident Priority Order

1. payment failures
2. entitlement/access failures
3. exam submission/timer failures
4. content correctness issues
5. AI failures
6. admin tooling issues

## 20.3 Incident Response Steps

1. detect
2. assess severity
3. contain impact
4. fix or work around
5. verify
6. add regression protection
7. document what changed

## 20.4 Content Maintenance Rules

Regularly:
- review top-used questions
- improve weak explanations
- archive outdated or low-trust content
- update notes and cheatsheets
- preserve historical attempt snapshots even when source content changes

---

# 21. Frozen Decisions Register

## 21.1 Product
- product name: PrepHatch
- first certification: AWS SAA-C03
- positioning: serious exam simulator + structured review system

## 21.2 Launch Scope
- one free mock exam
- 2 to 3 premium mock exams
- practice mode and timed mode
- notes and cheatsheets included in premium package
- admin included, but minimal
- runtime AI only for on-demand deep explanation

## 21.3 Auth
- Google OAuth
- email magic link / OTP
- no Facebook login in MVP
- no custom password flow in MVP unless justified later

## 21.4 Payments
- one-time package purchase
- 365-day entitlement
- repurchase blocked while active
- renewal or repurchase allowed when expired or within last 30 days before expiry
- coupons deferred unless clearly needed
- admin test access separated from revenue analytics

## 21.5 Exam Engine
- multiple-choice single-answer only
- one unified engine
- practice answers lock after check
- timed mode has no pause
- server is source of truth for deadlines
- auto-submit on timeout
- raw percentage plus PrepHatch scaled score out of 1000
- readiness labels are internal product labels

## 21.6 Content
- reusable question bank
- publish requires explanation and wrong-answer reasoning
- imported questions default to draft
- archive over delete
- last_reviewed_at and source metadata included
- Markdown-first notes and cheatsheets

## 21.7 AI
- runtime AI is optional enhancement, not core dependency
- AI fallback mandatory
- AI provider abstraction required
- no RAG at launch

## 21.8 DevOps
- local + preview + production
- tests block merge
- migrations are source of truth
- human review required for risky changes

---

# 22. Immediate Next Steps

## 22.1 Documentation
Create or update:
- `README.md`
- `docs/MASTER_BLUEPRINT.md`
- `docs/DECISIONS.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `env.example`

## 22.2 Technical Setup

1. initialize Next.js app
2. configure TypeScript, ESLint, Prettier
3. wire Supabase
4. create migration workflow
5. configure preview deploys
6. add test harness

## 22.3 First Schema Draft

Start with:
- profiles
- user_roles
- certifications
- exam_packages
- topics
- questions
- question_options
- question_topics
- mock_exams
- mock_exam_questions
- orders
- payments
- entitlements
- attempts
- attempt_answers
- attempt_question_snapshots
- attempt_topic_scores
- notes
- cheatsheets
- ai_generation_cache
- import_jobs
- product_events

## 22.4 First Product Milestone

Ship this before anything else expands scope:

**Logged-in user → free AWS SAA-C03 mock exam → completion → result page with stored explanations → clear upgrade CTA**

## 22.5 First Validation Questions

Once the first milestone exists, answer these with real usage:
- do users finish the free mock?
- do they trust the explanations?
- do they click upgrade?
- do they buy?
- do support issues cluster around access, content, or UX?

---

# 23. Final Build Philosophy

PrepHatch should be built as:
- a narrow but polished product
- a low-cost but trustworthy system
- an AI-assisted but not AI-dependent platform
- a scalable but not over-engineered architecture

The correct launch strategy is not maximum feature count.
It is:
- sharp scope
- strong content quality
- reliable exam behavior
- safe payment logic
- disciplined cost control
- clean foundations for later growth