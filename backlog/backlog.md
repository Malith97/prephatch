# PrepHatch MVP Backlog (Enhanced, Real-World Ready)

## Phase 0 – Dev Environment / Test Mode
TASK_ID: TASK-000
TITLE: Setup development auth bypass
MODULE/COMPONENT: Platform / Auth
DESCRIPTION: Add dev-mode flag to bypass auth for testing core flows.
DEPENDENCIES: None
ESTIMATED_EFFORT: Small
MVP_PRIORITY: High
DEV_ONLY: true
STATUS: Done
NOTES: Allows testing core flows without authentication; must be disabled in production.

TASK_ID: TASK-000a
TITLE: Seed test users and sample data
MODULE/COMPONENT: Backend / DB
DESCRIPTION: Create test users, exam packages, questions, and entitlements.
DEPENDENCIES: TASK-000
ESTIMATED_EFFORT: Small
MVP_PRIORITY: High
DEV_ONLY: true
STATUS: Done
NOTES: Required for MVP testing without auth; separate from production data.

---

## Phase 1 – Core Backend Exam Functionality
TASK_ID: TASK-001
TITLE: Package catalog API
MODULE/COMPONENT: Backend / Catalog
DESCRIPTION: API to fetch exam packages and package details; caching enabled for performance.
DEPENDENCIES: TASK-000a
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: High
DEV_ONLY: false
STATUS: Done
NOTES: Validate package_slug; log API calls; dev-mode bypass allowed.

TASK_ID: TASK-002
TITLE: Free mock attempt creation
MODULE/COMPONENT: Backend / Exam
DESCRIPTION: Create server-backed attempt; snapshots stored; support resume across devices.
DEPENDENCIES: TASK-001
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: High
DEV_ONLY: true
STATUS: Done
NOTES: Idempotent creation; multi-tab safe; dev-mode bypass allowed.

TASK_ID: TASK-003
TITLE: Attempt autosave
MODULE/COMPONENT: Backend / Exam
DESCRIPTION: Autosave answers; enforce deadlines; ensure multi-tab safety.
DEPENDENCIES: TASK-002
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: High
DEV_ONLY: true
STATUS: Done
NOTES: Debounce writes; transient client-side cache only; log save events.

TASK_ID: TASK-004
TITLE: Attempt submit & scoring
MODULE/COMPONENT: Backend / Exam
DESCRIPTION: Idempotent submit with deterministic scoring; handle multi-tab submits.
DEPENDENCIES: TASK-003
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: High
DEV_ONLY: false
STATUS: Done
NOTES: Validate ownership; log attempt submit; server authoritative; prevent duplicate scoring.

---

## Phase 2 – Frontend / UI/UX
TASK_ID: TASK-008
TITLE: Landing page & CTA flow
MODULE/COMPONENT: Frontend / Public
DESCRIPTION: Hero with CTA to start free mock; anchor links fixed; skeleton/loading/error states.
DEPENDENCIES: TASK-001
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: High
DEV_ONLY: false
STATUS: Pending
NOTES: Ensure accessible navigation; CTA navigates correctly; use server-side data.

TASK_ID: TASK-009
TITLE: Exam runtime frontend
MODULE/COMPONENT: Frontend / Exam
DESCRIPTION: Exam page with server-backed attempt state; timer, question panel, submit/save; skeleton/loading/error states.
DEPENDENCIES: TASK-002, TASK-003
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: High
DEV_ONLY: true
STATUS: Pending
NOTES: Multi-tab safe; accessible; show error if server unavailable.

TASK_ID: TASK-010
TITLE: Accessibility and IA fixes
MODULE/COMPONENT: Frontend / UX
DESCRIPTION: Keyboard navigation, semantic headings, focus-visible, forms with labels, error feedback.
DEPENDENCIES: TASK-009
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: High
DEV_ONLY: false
STATUS: Pending
NOTES: Prioritize high-traffic pages first; ensure screen-reader friendly.

---

## Phase 3 – Marketplace & Reporting
TASK_ID: TASK-011
TITLE: Package search/filter and marketplace pages
MODULE/COMPONENT: Frontend / Catalog
DESCRIPTION: Filter and search packages; display package details.
DEPENDENCIES: TASK-001
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: High
DEV_ONLY: false
STATUS: Pending
NOTES: Include skeletons for loading; accessible filtering.

TASK_ID: TASK-012
TITLE: Dashboard metrics and reports
MODULE/COMPONENT: Frontend / Dashboard
DESCRIPTION: Show attempts, scores, weak areas, and progress charts.
DEPENDENCIES: TASK-004
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: High
DEV_ONLY: true
STATUS: Pending
NOTES: Aggregation only; no AI yet; charts must update in real-time from server.

---

## Phase 4 – Edge Cases & Observability
TASK_ID: TASK-013
TITLE: Multi-tab handling & auto-submit
MODULE/COMPONENT: Backend / Exam
DESCRIPTION: Ensure multi-tab exam attempts do not duplicate timing/scoring; auto-submit when timer expires.
DEPENDENCIES: TASK-004
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: High
DEV_ONLY: false
STATUS: Pending
NOTES: Log all auto-submits; prevent duplicate scoring; server authoritative.

TASK_ID: TASK-014
TITLE: Basic logging / observability
MODULE/COMPONENT: Platform
DESCRIPTION: Log critical events: attempt create/submit, exam errors; track failed API requests.
DEPENDENCIES: TASK-002, TASK-004
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: Medium
DEV_ONLY: false
STATUS: Pending
NOTES: Structured logs for debugging; minimal overhead for MVP.

TASK_ID: TASK-015
TITLE: Legacy / redirect route handling
MODULE/COMPONENT: Frontend / Routing
DESCRIPTION: Ensure `/exams/*` and `/exam/*` redirects are consistent; prevent broken navigation.
DEPENDENCIES: TASK-001
ESTIMATED_EFFORT: Small
MVP_PRIORITY: High
DEV_ONLY: false
STATUS: Pending
NOTES: Include analytics tracking for legacy routes.

---

## Phase 5 – Costly / Optional (Deferred)
TASK_ID: TASK-007
TITLE: AI explanations endpoint
MODULE/COMPONENT: Backend / AI
DESCRIPTION: Deferred until core MVP stable; server-backed caching, rate-limits, budget control.
DEPENDENCIES: TASK-004
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: Low
DEV_ONLY: false
STATUS: Pending
NOTES: Only add once exams are stable; token-cost aware.

TASK_ID: TASK-005
TITLE: Stripe checkout integration
MODULE/COMPONENT: Backend / Payments
DESCRIPTION: Deferred; premium package unlock, webhook handling.
DEPENDENCIES: TASK-004
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: Low
DEV_ONLY: false
STATUS: Pending
NOTES: Defer until paying users; test in dev only with sandbox keys.

TASK_ID: TASK-006
TITLE: Stripe webhook & entitlement issuance
MODULE/COMPONENT: Backend / Payments
DESCRIPTION: Deferred; idempotent handling of payments and entitlements.
DEPENDENCIES: TASK-005
ESTIMATED_EFFORT: Medium
MVP_PRIORITY: Low
DEV_ONLY: false
STATUS: Pending
NOTES: Only required once Stripe checkout is implemented.
