# PrepHatch First Sprint Checklist

Status: Active
Owner: Founder
Purpose: Narrow the first sprint to the minimum work needed to start building safely.
Last Updated: 2026-04-06

## Sprint Goal

Reach this milestone:

A user can sign up, log in, open the AWS SAA-C03 package, start the free mock exam, answer questions, submit, and see a stable results page with base explanations.

## Do This First

### 1. Repo setup
- [ ] Initialize Next.js app with TypeScript
- [ ] Enable strict mode
- [ ] Configure ESLint and Prettier
- [ ] Add Tailwind
- [ ] Create base folder structure
- [ ] Add npm scripts: dev, build, lint, test, typecheck

### 2. Supabase and auth
- [ ] Create Supabase project
- [ ] Configure email/password auth
- [ ] Configure Google auth
- [ ] Add auth callback route
- [ ] Add login page
- [ ] Add signup page
- [ ] Add logout action

### 3. Identity schema
- [ ] Create `profiles` table
- [ ] Create `user_roles` table
- [ ] Bootstrap profile on first login
- [ ] Default all new users to learner

### 4. Catalog schema
- [ ] Create `certifications` table
- [ ] Create `exam_packages` table
- [ ] Seed AWS SAA-C03 package
- [ ] Add package slug/code lookup

### 5. Question and mock schema
- [ ] Create `topics`
- [ ] Create `questions`
- [ ] Create `question_options`
- [ ] Create `question_topics`
- [ ] Create `mock_exams`
- [ ] Create `mock_exam_questions`
- [ ] Seed one free mock exam

### 6. Attempt schema
- [ ] Create `attempts`
- [ ] Create `attempt_answers`
- [ ] Create `attempt_question_snapshots`
- [ ] Create `attempt_topic_scores`

### 7. User-facing routes
- [ ] Homepage
- [ ] Login page
- [ ] Signup page
- [ ] Dashboard
- [ ] Package detail page
- [ ] Free exam start page
- [ ] Attempt page
- [ ] Result page

### 8. Free exam loop
- [ ] Start attempt action
- [ ] Snapshot questions at attempt start
- [ ] Render question UI
- [ ] Save selected answers
- [ ] Submit attempt
- [ ] Score attempt
- [ ] Render results with explanations

### 9. Quality gates
- [ ] CI workflow created
- [ ] Preview environment configured
- [ ] One unit test for scoring
- [ ] One integration test for auth bootstrap
- [ ] One e2e test for free exam happy path

## Do Not Build In Sprint 1
- [ ] Stripe checkout
- [ ] coupons
- [ ] admin dashboard UI
- [ ] markdown notes and cheatsheets
- [ ] AI runtime endpoint
- [ ] weak-area coaching
- [ ] Facebook login
- [ ] renewal flow

## Sprint Exit Criteria

Sprint 1 is complete only when:
- app builds cleanly
- auth works in local and preview
- dashboard and package page load from DB data
- free mock can be started by a logged-in user
- attempt can be submitted and scored
- results page shows stable base explanations
- one automated test exists for each of: unit, integration, e2e

## Suggested Commit Sequence

1. `chore: initialize app and toolchain`
2. `feat: wire supabase auth and callback`
3. `feat: add profiles and roles bootstrap`
4. `feat: add catalog schema and seed aws package`
5. `feat: add question bank and mock exam schema`
6. `feat: add attempt schema and start attempt flow`
7. `feat: implement free exam ui and submit flow`
8. `feat: add results page with base explanations`
9. `ci: add checks and preview deployment`
10. `test: add scoring, auth, and free exam path coverage`
