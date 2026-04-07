# Dashboard UI Architecture

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Define the two-level dashboard information architecture and the canonical route split for the current Next.js implementation.

## Canonical Route Split

### Platform Dashboard

Route family:
- `/dashboard`
- `/dashboard/my-exams`
- `/dashboard/marketplace`
- `/dashboard/marketplace/:packageSlug`
- `/dashboard/billing`
- `/dashboard/achievements`
- `/dashboard/settings`
- `/dashboard/help`

Owns:
- purchased exams summary
- marketplace discovery
- package preview and purchase-facing detail
- billing and renewal flows
- account-wide settings
- learner-wide milestones and help

Does not own:
- topic mastery
- weak area analysis
- notes, cheatsheets, and tips
- exam-specific recommendations
- mock attempt runtime UI

### Exam Dashboard

Route family:
- `/exam/:examSlug`
- `/exam/:examSlug/mock-exams`
- `/exam/:examSlug/practice-questions`
- `/exam/:examSlug/analytics`
- `/exam/:examSlug/weak-areas`
- `/exam/:examSlug/notes`
- `/exam/:examSlug/cheatsheets`
- `/exam/:examSlug/tips`
- `/exam/:examSlug/recommendations`
- `/exam/:examSlug/settings`

Owns:
- exam overview
- mock exam list
- practice question sets
- analytics and weak areas
- notes, cheatsheets, and tips
- exam-scoped recommendations
- exam-specific preferences

Does not own:
- package marketplace browsing
- billing
- cross-exam progress management
- account settings

## Runtime Routes Outside the Dashboard Shell

These routes remain exam-scoped but intentionally avoid the left dashboard shell so the learner can focus:
- `/exam/:examSlug/session/:mockId`
- `/exam/:examSlug/results`
- `/exam/:examSlug/results/:attemptId`

## Shell Architecture

- `PlatformShell`: wraps only platform routes under `/dashboard/*`
- `ExamShell`: wraps only exam dashboard routes under `/exam/:examSlug/*`
- session and results routes stay outside the exam dashboard shell

## Compatibility Redirects

Legacy route family:
- `/exams`
- `/exams/:examSlug`
- `/exams/:examSlug/mock/:mockId`
- `/exams/:examSlug/session`
- `/exams/:examSlug/results`
- `/exams/:examSlug/results/:attemptId`

Behavior:
- redirect into the canonical `/dashboard/*` or `/exam/*` routes

## Current Feature Mapping

- `features/platform-dashboard/*`: platform-level pages and cards
- `features/exam-dashboard/*`: exam-level pages and charts
- `features/exams/components/exam-session.tsx`: focused exam-taking flow
- `features/exams/components/results-summary.tsx`: focused result review flow

## UI Rule

If the user is deciding what to buy, what they own, or how their account is configured, keep the UI in `/dashboard`.

If the user is studying one certification package, keep the UI in `/exam/:examSlug`.
