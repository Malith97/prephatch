# PrepHatch Master Blueprint v1

> Canonical source of truth for PrepHatch product planning, architecture, delivery, operations, and growth.
> This document consolidates all planning threads into a single GitHub-ready master file for product alignment, AI-assisted implementation, and future evolution.

---

## Document Status

- **Project:** PrepHatch
- **Version:** v1
- **Status:** Active baseline
- **Primary use:** Product, engineering, AI-assisted coding, and roadmap reference
- **Owner:** Founder
- **Scope:** MVP through early scaling

---

## How to Use This Document

This file is the top-level project blueprint.

Use it for:
- product alignment
- architecture reference
- engineering implementation
- AI coding prompts
- roadmap tracking
- launch readiness
- post-launch operations

When the project grows, this file can be split into smaller docs under `docs/`. Until then, this file remains the canonical source of truth.

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Vision and Strategic Direction](#2-vision-and-strategic-direction)
3. [Branding and Domain](#3-branding-and-domain)
4. [Product Scope and MVP Definition](#4-product-scope-and-mvp-definition)
5. [Users, Market, and Positioning](#5-users-market-and-positioning)
6. [Business Model and Access Model](#6-business-model-and-access-model)
7. [Product Experience and User Flows](#7-product-experience-and-user-flows)
8. [Product Requirements](#8-product-requirements)
9. [AI Strategy](#9-ai-strategy)
10. [Technical Architecture](#10-technical-architecture)
11. [Data Model and Schema Direction](#11-data-model-and-schema-direction)
12. [Exam Engine Specification](#12-exam-engine-specification)
13. [Content System and Admin Operations](#13-content-system-and-admin-operations)
14. [Payments, Entitlements, and Access Control](#14-payments-entitlements-and-access-control)
15. [Budget and Cost Optimization](#15-budget-and-cost-optimization)
16. [Development Roadmap](#16-development-roadmap)
17. [Implementation Blueprint](#17-implementation-blueprint)
18. [Testing and QA Strategy](#18-testing-and-qa-strategy)
19. [Deployment and DevOps](#19-deployment-and-devops)
20. [Maintenance and Operations](#20-maintenance-and-operations)
21. [Growth and Scaling Strategy](#21-growth-and-scaling-strategy)
22. [Frozen Decisions Register](#22-frozen-decisions-register)
23. [Immediate Next Steps](#23-immediate-next-steps)
24. [Appendix: Recommended Repo Doc Split](#24-appendix-recommended-repo-doc-split)

---

# 1. Executive Summary

## 1.1 What PrepHatch Is

PrepHatch is a certification exam-readiness platform built to help learners prepare for specific certification exams through:

- realistic mock exams
- timed exam simulation
- practice mode
- detailed explanations
- AI-powered deep explanations
- progress tracking
- weak-area analysis
- topic-based notes
- cheatsheets
- admin-managed content

PrepHatch should feel like:

- a serious exam simulator
- a guided exam coach

## 1.2 First Product Focus

The first certification product is:

- **AWS Certified Solutions Architect – Associate (SAA-C03)**

## 1.3 Core User Promise

PrepHatch exists to help users:

- pass faster
- feel exam-ready
- identify weak areas clearly
- increase the chance of passing on the first attempt

## 1.4 Business Model Summary

PrepHatch v1 uses:

- one-time payment per certification package
- 365-day access per package
- one free mock exam available after login
- coupon support for launch promotions

## 1.5 Product Structure Summary

PrepHatch has two major surfaces.

### Learner-facing surface
- dashboard marketplace
- free exam flow
- purchased exam workspace
- exam engine
- results and review
- progress tracking
- notes
- cheatsheets

### Admin-facing surface
- certification and package management
- question bank management
- mock exam composition
- notes and cheatsheets management
- import workflows
- archive and publish controls
- testing-access support

## 1.6 Strategic Build Principle

PrepHatch should be built as a:

- **modular monolith**
- with a **reusable question bank**
- and a **hybrid explanation system**:
  - stored base explanations
  - AI deep explanations as an additional layer

---

# 2. Vision and Strategic Direction

## 2.1 Product Vision

PrepHatch is a focused certification-prep platform that helps learners prepare for specific exams through realistic practice, structured feedback, and targeted improvement tools.

It is not intended to be:

- a random dump site
- a generic course marketplace
- a broad learning portal at launch

It is intended to be:

- a practical exam-readiness platform
- trustworthy
- measurable
- focused
- scalable across certifications later

## 2.2 Core Outcome

When a learner buys a certification package, they should be able to:

- take multiple mock exams
- simulate exam conditions
- understand weak areas
- review high-quality explanations
- learn from wrong answers
- revise with notes and cheatsheets
- track progress over time
- build confidence before taking the real exam

## 2.3 Long-Term Direction

PrepHatch should grow from:

- one certification-ready product

into:

- a trusted multi-certification exam-readiness platform

and later possibly into:

- a broader certification-preparation ecosystem

Potential long-term areas:
- more certifications
- bundles
- renewal flows
- stronger analytics
- AI-driven study guidance
- broader learning assets
- B2B/team offerings later if justified

---

# 3. Branding and Domain

## 3.1 Brand Name

**PrepHatch**

## 3.2 Brand Direction

PrepHatch should feel:

- clean
- focused
- serious
- trustworthy
- technical
- professional
- exam-oriented

## 3.3 Brand Implication

The brand should communicate:

- readiness
- progress
- structure
- reliability
- modern technical credibility

## 3.4 Domain Status

- domain purchased
- hosting not separately purchased because the platform is planned on managed infrastructure

---

# 4. Product Scope and MVP Definition

## 4.1 MVP Objective

Validate that learners will pay for a focused, exam-specific prep platform that combines:

- realistic mock exams
- explanations
- AI deep explanations
- progress tracking
- weak-area analysis
- notes
- cheatsheets
- exam-like timed behavior

## 4.2 MVP Certification

The MVP launches with one certification only:

- **AWS SAA-C03**

## 4.3 What Is Included in MVP

### Learner-facing
- sign up and log in
- email verification
- Google login
- Facebook login
- dashboard marketplace
- package detail page
- one free mock exam
- 5 to 8 premium mock exams
- practice mode
- timed mode
- score and review
- progress tracking
- weak-area analysis
- notes
- cheatsheets
- premium workspace
- AI deep explanations
- coupon support
- expired-access handling
- 365-day access entitlement
- purchased exams section in dashboard

### Admin-facing
- admin-only dashboard
- certification CRUD
- package CRUD
- topic CRUD
- reusable question bank management
- mock exam composition
- CSV import
- notes editor
- cheatsheets editor
- publish and unpublish controls
- archive controls
- manual testing access support

## 4.4 What Is Explicitly Excluded from MVP

- mobile app
- subscriptions
- enterprise or team accounts
- community features
- live AI tutor chat
- heavy proctoring
- screenshot-proof browser controls
- multi-language support
- advanced analytics suite
- full course and video platform
- complex editorial workflow system

## 4.5 Free Trial Boundaries

The free trial is not anonymous.

A user must:
- sign up or log in
- then access the free mock exam

Free trial includes:
- one free mock exam
- detailed explanations
- AI deep explanations

Free trial excludes:
- premium mock exams
- premium notes
- premium cheatsheets
- premium progress history
- purchased exam workspace

## 4.6 Premium Package Includes

A paid certification package includes:
- premium mock exams
- purchased exam workspace
- progress tracking
- weak-area analysis
- notes
- cheatsheets
- AI deep explanations
- unlimited retakes during active entitlement

---

# 5. Users, Market, and Positioning

## 5.1 Target Users

PrepHatch is for learners actively preparing for a specific certification exam.

Primary user groups:
- working professionals
- job switchers
- retake candidates
- students and beginners

These groups are all important in v1.

## 5.2 Core Pain Points

PrepHatch exists because learners face:
- fragmented preparation resources
- low-quality or outdated dumps
- poor explanation quality
- no clear readiness signal
- weak exam simulation
- too much irrelevant content
- low trust in many prep sources

## 5.3 Positioning

PrepHatch should be positioned as:
- serious
- focused
- realistic
- technical
- trustworthy

It should feel like:
- a serious exam simulator
- a guided exam coach

## 5.4 Messaging Priorities

Core messaging pillars:
- pass faster
- feel exam-ready
- identify weak areas

## 5.5 Explanation Standard

Explanations must be:
- deep
- technical
- easy to understand
- useful for beginners and stronger learners
- explicit about why wrong answers are wrong

## 5.6 Notes Standard

Notes should support:
- concept learning
- revision
- reinforcement of weak areas

---

# 6. Business Model and Access Model

## 6.1 Business Model

PrepHatch v1 uses:

- one-time payment per certification package

Example:
- AWS SAA-C03 package
- fixed price
- 365-day access window

## 6.2 Access Duration

Each purchase grants:

- **365 days** of access

This is implemented via package entitlements.

## 6.3 Free vs Paid Access Levels

PrepHatch has these user states:

- visitor
- free logged-in user
- paid active user
- expired user
- admin

## 6.4 Free User Access

Free users can:
- browse packages
- access dashboard
- take one free mock exam
- see detailed explanations
- use AI deep explanations in free exam

Free users cannot:
- access premium mock exams
- use purchased exam workspace
- access premium notes
- access premium cheatsheets
- access premium progress features

## 6.5 Paid User Access

Paid users with active entitlement can access:
- purchased exam workspace
- premium mock exams
- progress tracking
- weak-area analysis
- notes
- cheatsheets
- AI deep explanations
- unlimited retakes during active access window

## 6.6 Expired Access

Expired users:
- can log in
- can see expired package state
- can see renewal CTA

Expired users cannot:
- access premium mock exams
- access premium notes
- access premium cheatsheets
- access premium detailed historical results
- access premium AI features within expired package

## 6.7 Renewal Direction

Renewal uses:
- the same package

Future flexibility should allow:
- special renewal pricing
- promo-based reactivation
- renewal campaigns later

## 6.8 Coupon Support

Coupon codes are part of MVP.

Use cases:
- launch promotions
- early user campaigns
- discount experiments

## 6.9 Admin Testing Access

Admins may manually grant package access for:
- testing
- internal QA
- support/testing scenarios

This must remain separate from paid revenue analytics.

---

# 7. Product Experience and User Flows

## 7.1 Navigation Model

PrepHatch should function as:
- a marketplace for available exams
- plus a workspace for purchased exams

After login, users land on:
- **dashboard marketplace**

The dashboard should show:
- available exams
- purchased exams section
- package states
- free trial availability

## 7.2 Signup and Login Flow

1. visitor lands on homepage or package page
2. user signs up or logs in
3. user lands on dashboard marketplace

## 7.3 Package Detail Flow

Package page should show:
- certification name
- code
- package summary
- mock exam availability
- included notes and cheatsheets
- pricing
- free trial CTA
- buy CTA

## 7.4 Free Trial Flow

1. user logs in
2. user opens free mock exam
3. user completes exam
4. user sees score and explanations
5. user sees premium upgrade path

## 7.5 Purchase Flow

1. user opens package page
2. user clicks buy
3. user enters checkout
4. payment verified server-side
5. dashboard updates purchased section
6. user enters purchased exam workspace

## 7.6 Purchased Exam Workspace

Inside purchased exam workspace:
- premium mock exams
- progress section
- weak-area summary
- notes
- cheatsheets
- recent attempts
- retake actions

## 7.7 Practice Mode Flow

- answer one question
- check answer
- see explanation immediately
- see why wrong answers are wrong
- answer locks
- continue to next question

## 7.8 Timed Mode Flow

- timer begins immediately
- no explanation during attempt
- question palette/grid visible
- flagging available
- unanswered warning before submission
- no pause
- auto-submit on timeout

## 7.9 Results and Review Flow

Results page includes:
- score
- readiness label
- topic/domain breakdown
- weak areas
- question review
- correct answer
- explanation
- why wrong answers are wrong
- AI deep explanation layer

## 7.10 Progress Tracking Flow

Progress exists:
- at summary level in dashboard
- in more detail inside purchased exam workspace

## 7.11 Notes and Cheatsheets Flow

Notes and cheatsheets live inside the respective purchased exam workspace.

## 7.12 Admin Flows

Admin must support:
- content creation
- content editing
- content archiving
- content publishing
- imports
- test access handling

---

# 8. Product Requirements

## 8.1 Authentication and Identity
- email/password login
- Google login
- Facebook login
- email verification
- role-aware identity

## 8.2 Marketplace and Package Discovery
- list exam packages
- view package detail pages
- display package access state
- display free trial and purchase actions

## 8.3 Exam Engine
- create attempt
- timed mode
- practice mode
- autosave
- resume
- scoring
- review
- weak-area outputs

## 8.4 Results and Progress
- score out of 1000
- readiness label
- attempt history
- topic-level breakdown
- weak-area analysis

## 8.5 Learning Resources
- notes
- cheatsheets
- premium gating
- purchased-workspace placement

## 8.6 Payments and Entitlements
- one-time purchase
- coupon code support
- verified unlock
- 365-day entitlement
- expired access handling
- repurchase block while active

## 8.7 Admin Operations
- certification/package/topic management
- reusable question bank
- mock exam composition
- CSV import
- notes and cheatsheets editing
- publish/archive controls
- testing access support

## 8.8 AI Features
- AI deep explanations
- AI weak-area study guidance
- fallback to base explanation

## 8.9 Non-Functional Requirements
- reliability
- security
- performance
- maintainability
- scalability by design
- cost-efficiency
- AI fallback safety

---

# 9. AI Strategy

## 9.1 AI Principle

Use AI as a value amplifier, not the core system of truth.

## 9.2 Two AI Layers

### Build-time AI
Use for:
- planning
- docs
- schema
- code generation
- tests
- debugging
- refactoring

### Product-time AI
Use for:
- deep explanations
- study guidance
- content assistance

## 9.3 Hybrid Explanation Model

Every question must have:
- stored base explanation

AI adds:
- deeper technical explanation
- richer clarification
- study coaching layer

## 9.4 Where AI Should Be Used

### Learner-facing
- deep explanation
- weak-area coaching
- study guidance

### Admin-facing
- cleanup of imported content
- explanation improvement
- note and cheatsheet assistance
- tagging suggestions

## 9.5 Where AI Must Not Be Trusted Alone

AI must not be the source of truth for:
- correct answer validation
- scoring
- entitlement access
- payment unlock
- publish approval

## 9.6 Reliability Rules

- user must complete exam even if AI fails
- base explanation must always exist
- AI failure must not break results page

## 9.7 Cost Rules

- AI usage should be monitored
- outputs should be cached where useful
- AI should not become an uncontrolled cost center

---

# 10. Technical Architecture

## 10.1 Architecture Pattern

PrepHatch should be built as a:
- **modular monolith**

This means:
- one main app
- one main DB
- one auth provider
- one payment provider
- internal feature boundaries

## 10.2 Core Modules

- auth
- catalog
- packages
- entitlements
- exams
- attempts
- progress
- resources
- admin
- payments
- coupons
- ai

## 10.3 Protection Principles

Critical flows must be server-protected:
- premium access checks
- payment unlock
- admin actions
- final submission logic
- AI runtime endpoints

## 10.4 Routing Model

### Public
- homepage
- package pages
- login and signup
- auth callback
- checkout success

### User
- dashboard
- purchased exam workspace
- progress
- notes
- cheatsheets
- exam start
- attempt screen
- result screen

### Admin
- admin home
- certifications
- packages
- topics
- questions
- mocks
- imports
- notes
- cheatsheets
- invites

## 10.5 Reliability Approach

- base explanation fallback
- immutable submitted attempts
- verified entitlements
- question snapshots for historical integrity
- graceful AI degradation

---

# 11. Data Model and Schema Direction

## 11.1 Core Modeling Decisions

PrepHatch uses:
- reusable question bank
- mock exam question mapping
- package-specific entitlements
- immutable attempt history
- topic-driven analysis

## 11.2 Main Entity Groups

### Identity
- profiles
- user_roles

### Catalog
- certifications
- exam_packages
- package_features

### Taxonomy
- topics

### Question Bank
- questions
- question_options
- question_topics
- mock_exams
- mock_exam_questions

### Commerce
- orders
- payments
- entitlements

### Runtime
- attempts
- attempt_answers
- attempt_question_snapshots
- attempt_topic_scores

### Learning Resources
- notes
- cheatsheets

### AI
- ai_explanations
- ai_study_guidance

### Admin Support
- csv_import_jobs

## 11.3 Schema Design Rules

- submitted attempts immutable
- question content snapshotted into attempt history
- base explanations separate from AI-generated explanations
- topics reused consistently across questions, notes, cheatsheets, and progress
- entitlements are source of truth for premium access

---

# 12. Exam Engine Specification

## 12.1 Engine Pattern

Use one unified exam engine with:
- practice mode
- timed mode

## 12.2 Supported Question Type

MVP supports:
- multiple-choice
- single-answer only

## 12.3 Practice Mode Rules

- explanation shown immediately after answer check
- wrong-answer reasoning shown
- AI explanation available
- answer locks after checking

## 12.4 Timed Mode Rules

- backend-authoritative timer
- no pause
- no explanation during attempt
- question palette/grid
- flagged questions
- unanswered warning before submit
- auto-submit on timeout

## 12.5 Attempt Lifecycle

- created
- in_progress
- submitted
- auto_submitted
- scored

## 12.6 Autosave and Resume

- answers autosave
- practice attempts can resume
- timed attempts can resume only before deadline
- no extra time granted

## 12.7 Scoring

Outputs:
- correct count
- incorrect count
- unanswered count
- percentage
- scaled score out of 1000
- readiness label

## 12.8 Readiness Labels

- Not Ready
- Improving
- Nearly Ready
- Exam Ready

## 12.9 Review Requirements

Review must include:
- selected answer
- correct answer
- detailed explanation
- why wrong answers are wrong
- topic/domain label
- AI deep explanation layer

## 12.10 Free Exam Rule

Free exam:
- uses same engine
- includes explanations
- includes AI deep explanations
- remains separate from premium progress history

---

# 13. Content System and Admin Operations

## 13.1 Content Philosophy

PrepHatch is a structured, maintainable exam-readiness content system, not a loose question dump.

## 13.2 Core Content Types

- certification packages
- mock exams
- reusable question bank
- explanations
- notes
- cheatsheets
- topics
- AI explanation cache

## 13.3 Key Content Rules

- no explicit difficulty labels in MVP
- mock exams should be balanced
- questions can belong to multiple topics
- base explanation required for published questions
- wrong-answer reasoning required for published questions
- imported CSV questions default to draft
- admins can archive questions
- notes and cheatsheets are premium-only

## 13.4 Mock Exam Composition

Support:
- manual composition
- future/admin-triggered auto-assembly from bank

## 13.5 Question Lifecycle

- draft
- review_ready
- published
- archived

## 13.6 Admin Requirements

Admin must support:
- certification/package/topic CRUD
- question CRUD
- option management
- explanation editing
- wrong-answer reasoning editing
- multi-topic tagging
- mock exam composition
- notes CRUD
- cheatsheets CRUD
- CSV import
- publish/archive controls
- testing access support

## 13.7 Notes and Cheatsheets

### Notes
- rich text
- concept learning
- revision support
- premium only

### Cheatsheets
- rich text
- compact revision content
- view-only
- premium only

---

# 14. Payments, Entitlements, and Access Control

## 14.1 Payment Model

- one-time purchase per certification package
- 365-day access window

## 14.2 Free Trial Rule

- login required
- one free mock exam
- detailed explanations
- AI deep explanations
- progress separate from premium history

## 14.3 Entitlement Rules

Premium access requires:
- authenticated user
- matching package entitlement
- active status
- current time before expiry

## 14.4 What Entitlements Gate

- premium mock exams
- purchased exam workspace
- premium progress
- weak-area analysis
- notes
- cheatsheets
- premium detailed historical results
- premium AI features

## 14.5 Expiry Rules

Expired users:
- can see dashboard and expired state
- cannot access premium content or premium detailed results

## 14.6 Repurchase and Renewal

- repurchase blocked while active until near expiry in MVP
- renewal uses same package
- special renewal pricing may be supported later

## 14.7 Coupon Codes

- supported in MVP
- used for launch promotions and campaigns

## 14.8 Admin Testing Access

- admins may manually grant testing access
- invitation and testing email flow handled manually at first
- grant source must remain separate from paid analytics

## 14.9 Access Control Principle

Never trust frontend alone for premium access.
Backend entitlement checks are the source of truth.

---

# 15. Budget and Cost Optimization

## 15.1 Budget Philosophy

Launch cheaply, validate quickly, and spend more only when justified.

## 15.2 Main Cost Buckets

- domain
- hosting
- database/auth/storage
- payment fees
- AI runtime
- complexity cost

## 15.3 Cost-Minimizing Strategy

Use:
- Cloudflare free or low-cost hosting
- Supabase free or low-cost start
- Stripe pay-as-you-go
- ChatGPT Pro already owned
- carefully controlled OpenAI runtime

## 15.4 Main Variable Cost Risk

The main variable cost risk is:
- AI-generated deep explanations

## 15.5 AI Cost Strategy

- keep strong stored base explanations
- use AI as additive layer
- cache AI outputs
- avoid uncontrolled repeated generation
- track usage

## 15.6 Avoid Early Spend On

- extra AI subscriptions without clear need
- premium builders
- heavy monitoring stacks
- premium auth vendor
- unnecessary SaaS layers

## 15.7 Admin Dashboard as Cost Optimization

The admin dashboard reduces long-term costs by avoiding code changes for content updates.

## 15.8 Entitlement Duration as Cost Optimization

365-day access prevents indefinite support burden from one old one-time sale.

---

# 16. Development Roadmap

## 16.1 Milestone 1 — Foundation
- repo setup
- app scaffold
- styling setup
- Supabase connection
- migrations workflow
- base layouts

## 16.2 Milestone 2 — Core User Platform
- auth
- dashboard marketplace
- package detail pages
- route protection
- package states

## 16.3 Milestone 3 — Exam Engine
- attempt creation
- practice mode
- timed mode
- autosave
- timer
- results and review
- progress basics

## 16.4 Milestone 4 — Payments and Entitlements
- checkout
- coupons
- webhooks
- entitlement creation
- expiry logic
- repurchase blocking
- access gates

## 16.5 Milestone 5 — Admin and Content Ops
- admin dashboard
- question bank management
- notes and cheatsheets
- mock composition
- CSV import
- archive and publish

## 16.6 Milestone 6 — AI Layer and Launch Readiness
- AI deep explanation
- AI study guidance
- caching
- fallback handling
- QA
- launch hardening

---

# 17. Implementation Blueprint

## 17.1 Repo Shape

```text
prephatch/
  app/
  components/
  features/
  lib/
  server/
  types/
  styles/
  public/
  supabase/
  scripts/
  tests/
```

## 17.2 Feature Modules

- auth
- catalog
- packages
- entitlements
- exams
- attempts
- progress
- resources
- admin
- payments
- coupons
- ai

## 17.3 Server Shape

```text
server/
  services/
  repositories/
  policies/
  validators/
  mappers/
```

## 17.4 Shared Utility Shape

```text
lib/
  supabase/
  stripe/
  auth/
  constants/
  utils/
  ai/
```

## 17.5 Component Shape

```text
components/
  ui/
  layout/
  catalog/
  dashboard/
  exams/
  progress/
  resources/
  admin/
  payments/
```

## 17.6 TypeScript Rules

- strict TypeScript
- explicit domain types
- avoid leaking raw DB types everywhere

## 17.7 State Management Direction

- local state for interactive exam UI
- server data for persisted product data
- avoid heavy global state early

## 17.8 Rich Text Direction

- rich text only where needed
- notes
- cheatsheets
- sanitize output safely

## 17.9 Exam Engine Code Organization

Recommended split:
- exam shell
- question card
- palette
- timer
- navigation
- explanation panel
- timer hook
- exam session hook
- scoring utils
- question state utils
- attempt actions and queries

## 17.10 Payments Code Organization

Recommended split:
- create checkout session
- apply coupon
- webhook handling
- admin test grant
- order and entitlement queries

## 17.11 AI Code Organization

Recommended split:
- generate deep explanation
- generate study guidance
- cached explanation lookup
- prompt builders
- fallback handling

## 17.12 Admin Code Organization

Recommended split:
- certifications
- packages
- topics
- mocks
- questions
- notes
- cheatsheets
- imports
- invites

## 17.13 Coding Sequence

1. app skeleton
2. auth
3. schema
4. dashboard marketplace
5. content loading
6. exam engine
7. payments and access
8. admin
9. AI
10. polish and QA

## 17.14 First 20 Build Tasks

1. initialize Next.js app
2. add Tailwind and UI base
3. configure Supabase helpers
4. env config structure
5. create public, dashboard, and admin layouts
6. add auth pages and callback flow
7. create `profiles` and `user_roles` migrations
8. create catalog schema migrations
9. create question and mock schema migrations
10. seed AWS SAA-C03
11. build dashboard marketplace
12. build package detail page
13. build free exam access flow
14. create attempt schema and actions
15. build exam start page
16. build practice mode UI
17. build timed mode UI
18. build submit and scoring flow
19. build results and review page
20. build entitlement guards

## 17.15 Coding Rules

- thin route handlers
- explicit types
- no raw DB access in UI files
- backend-enforced access checks
- immutable submitted attempts
- AI always has fallback

---

# 18. Testing and QA Strategy

## 18.1 QA Model

Use:
- manual QA
- unit tests
- integration tests
- a small set of high-value end-to-end flows

## 18.2 Highest-Risk Areas

- auth/provider correctness
- timer and autosubmit
- payment unlock
- entitlement expiry
- scoring
- admin publishing
- import safety
- AI fallback

## 18.3 Core Manual QA Flows

### User-facing
- signup and login
- dashboard load
- free exam
- purchase path
- purchased workspace
- notes and cheatsheets visibility

### Exam
- practice mode
- timed mode
- palette
- flagging
- unanswered warning
- auto-submit
- review

### Admin
- route protection
- question create, edit, archive
- imports
- notes and cheatsheets
- publish behavior

## 18.4 Core Unit Tests

- entitlement active, expired, revoked logic
- coupon validation
- scoring and readiness
- practice answer lock
- unanswered detection
- date calculations
- content state filtering

## 18.5 Core Integration Tests

- auth/profile bootstrap
- attempt creation and submit
- autosave and resume
- checkout, webhook, entitlement
- CSV import to draft
- AI fallback behavior

## 18.6 Must-Have End-to-End Flows

1. visitor to signup to free exam
2. user buys package and enters purchased workspace
3. paid user timed exam to result
4. practice mode completion
5. expired access blocked
6. admin creates and publishes content

## 18.7 Pre-Launch QA Gate

Before launch, verify:
- auth
- free exam
- premium exam
- payments
- entitlement checks
- notes and cheatsheets
- admin content ops
- AI fallback safety

---

# 19. Deployment and DevOps

## 19.1 Environment Strategy

Formal environments:
- local
- production

No full staging environment in MVP.

## 19.2 Domain Strategy

Production runs on:
- root domain

Any preview environment, if used:
- hidden subdomain
- password-protected or private

## 19.3 CI/CD Rules

- CI blocks merges if tests fail
- deploy production from main
- run smoke tests after every production deploy

## 19.4 Secrets Rules

- never commit secrets
- separate local and production secrets
- document environment variables
- maintain `env.example`

## 19.5 Migration Rules

- migrations are source of truth
- test locally before production
- avoid uncontrolled manual production schema edits

## 19.6 Invitation and Testing Emails

Handled manually at first.

## 19.7 Feature Rollout Policy

- coupons live once deployed
- AI features live once deployed
- no feature flags in MVP

## 19.8 Logging Priorities

- auth failures
- payment and webhook events
- entitlement changes
- attempt submit failures
- import failures
- AI failures

## 19.9 Smoke Test Checklist After Deploy

- homepage
- login
- dashboard
- package page
- free exam
- premium gating
- admin protection
- checkout creation
- entitlement checks
- AI fallback path

---

# 20. Maintenance and Operations

## 20.1 Operating Principle

Run PrepHatch with a lightweight but disciplined solo-founder operating model.

## 20.2 Core Ops Areas

- platform health
- content maintenance
- user support
- payment and access operations
- AI operations
- admin workflow upkeep
- cost monitoring

## 20.3 Support Model

Manual-first support via simple contact path.

Support issue categories:
- access
- payment
- exam
- content
- account

## 20.4 Content Maintenance Rules

- correct weak or inaccurate questions
- improve explanations
- archive outdated content
- refine notes and cheatsheets
- preserve historical attempt snapshots

## 20.5 Payment and Access Ops

Regularly verify:
- payments create entitlements
- expired access blocks correctly
- coupons work
- admin grants behave correctly
- renewal path remains usable

## 20.6 AI Ops

Monitor:
- failure rate
- latency
- output quality
- usage volume
- cost
- cache effectiveness

## 20.7 Incident Handling

Simple incident response:
1. identify
2. assess severity
3. contain harm
4. fix or work around
5. verify
6. record prevention note

## 20.8 Highest Maintenance Priorities

1. keep core learner loop healthy
2. keep content trustworthy
3. keep AI useful and affordable
4. keep admin operations sustainable

---

# 21. Growth and Scaling Strategy

## 21.1 Growth Order

PrepHatch should scale in this order:
1. prove one exam works
2. deepen that exam’s value
3. add more certifications
4. improve retention and monetization
5. improve automation and systems

## 21.2 First Growth Lever

Add more certifications after AWS SAA-C03 proves demand.

## 21.3 Second Growth Lever

Increase value inside each exam package:
- better explanations
- better notes
- better cheatsheets
- stronger weak-area guidance
- better revision support

## 21.4 Third Growth Lever

Repeat purchases:
- one user buys one exam
- trusts PrepHatch
- buys another related exam later

## 21.5 Fourth Growth Lever

Renewal-driven revenue:
- reminders
- reactivation
- renewal offers
- near-expiry campaigns later

## 21.6 Fifth Growth Lever

Better AI assistance:
- stronger explanations
- smarter weak-area guidance
- resource recommendations
- next-step suggestions

## 21.7 Future Monetization Options

- renewal offers
- bundles
- cross-sell flows
- premium AI tier later
- B2B and team offerings much later if justified

## 21.8 Avoid Too Early

- too many exams at once
- giant course platform
- enterprise-first pivot
- subscription complexity
- architecture rewrite without demand

---

# 22. Frozen Decisions Register

## 22.1 Product
- product name: PrepHatch
- first certification: AWS SAA-C03
- serious exam simulator plus guided exam coach positioning

## 22.2 MVP
- one free mock exam
- 5 to 8 premium mock exams
- notes and cheatsheets included in paid package
- admin dashboard included in MVP

## 22.3 Auth
- email/password
- Google
- Facebook

## 22.4 Free Trial
- login required
- detailed explanations visible
- AI deep explanations visible
- free progress separate from premium

## 22.5 Payments
- one-time package purchase
- 365-day entitlement
- coupon support in MVP
- repurchase blocked while active until near expiry
- expired premium content fully locked
- renewal uses same package
- admin manual testing access supported

## 22.6 Exam Engine
- unified engine
- multiple-choice single-answer only
- practice answers lock after checking
- timed mode has no pause
- palette/grid in timed mode
- flagged questions supported
- unanswered warning before submit
- score out of 1000
- readiness labels fixed
- wrong answers must be explained

## 22.7 Content
- reusable question bank
- balanced mock exams
- future auto-assembly support
- no explicit difficulty labels in MVP
- multiple topics per question
- archive instead of delete where possible
- imports default to draft
- no last-reviewed-date field in MVP

## 22.8 Notes and Cheatsheets
- premium only
- inside purchased workspace
- rich text
- cheatsheets view-only online

## 22.9 AI
- AI deep explanations in MVP
- hybrid explanation model
- AI weak-area guidance planned in MVP
- AI fallback mandatory

## 22.10 DevOps
- root domain production
- local plus production only
- private hidden preview if used
- CI blocks merges if tests fail
- migrations are source of truth
- manual testing emails at first
- coupons and AI live once deployed

---

# 23. Immediate Next Steps

## 23.1 Repository Documentation
Create:
- `README.md`
- `docs/MASTER_BLUEPRINT.md` ← this file
- `docs/DECISIONS.md`
- `env.example`

## 23.2 Technical Initialization
- initialize Next.js app
- configure styling
- wire Supabase
- create migrations workflow
- create base layouts

## 23.3 First Schema Draft
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
- ai_explanations
- ai_study_guidance
- csv_import_jobs

## 23.4 First Product Milestone
Reach this first visible checkpoint:

**A user can sign up, land on dashboard, open AWS SAA-C03, start the free mock exam, complete the attempt, and see results with explanations.**

## 23.5 Recommended Build Order
1. app scaffold
2. auth
3. schema
4. dashboard marketplace
5. free exam flow
6. exam engine
7. results and review
8. payments and entitlements
9. admin dashboard
10. AI explanation layer

---

# 24. Appendix: Recommended Repo Doc Split

When this file gets too large, split into:

```text
docs/
  README.md
  MASTER_BLUEPRINT.md
  product/
    vision.md
    mvp.md
    requirements.md
    user-flows.md
  architecture/
    architecture.md
    data-model.md
    exam-engine.md
    ai-strategy.md
  engineering/
    roadmap.md
    implementation.md
    testing.md
    devops.md
  operations/
    maintenance.md
    support.md
  growth/
    scaling.md
  decisions/
    frozen-decisions.md
```

---

## Final Note

This document is the current canonical source of truth for PrepHatch v1.

It should be updated whenever:
- scope changes
- architecture changes
- business model changes
- major implementation decisions change

Until the repo grows large enough for multi-document governance, this file should remain the top-level blueprint for product and engineering alignment.
