# Dashboard UI Architecture

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Define the two-level dashboard information architecture and the canonical route split for the current Next.js implementation.

## Architecture

- Platform Dashboard (`/dashboard`)
  - owns cross-exam overview and marketplace surfaces
- Exam Dashboard (`/exam/:examId`)
  - owns exam-specific progress, analytics, resources, and mock flow

## Runtime Routes Outside the Dashboard Shell

These routes remain exam-scoped but intentionally avoid the left dashboard shell so the learner can focus:
- `/exam/:examSlug/session/:mockId`
- `/exam/:examSlug/results`
- `/exam/:examSlug/results/:attemptId`

## Navigation

- Platform sidebar
  - `Dashboard`, `My Exams`, `Marketplace`, `Billing`, `Achievements`, `Settings`, `Help`
- Exam sidebar
  - `Overview`, `Mock Exams`, `Practice Questions`, `Analytics`, `Weak Areas`, `Notes`, `Cheatsheets`, `Tips`, `Recommendations`, `Settings`

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

## Components

- `MyExamCard`
  - implementation: `PurchasedExamCard` in `features/platform-dashboard/components/purchased-exam-card.tsx`
- `ExamMarketplaceCard`
  - implementation: `MarketplaceExamCard` in `features/platform-dashboard/components/marketplace-exam-card.tsx`
- `ExamProgressCard`
  - implementation: `ExamProgressCard` in `features/exam-dashboard/components/exam-progress-card.tsx`
- `WeakAreasChart`
  - implementation: `WeakAreasChart` in `features/exam-dashboard/components/weak-areas-chart.tsx`
- `RecommendationPanel`
  - implementation: `RecommendedActionsPanel` in `features/exam-dashboard/components/recommended-actions-panel.tsx`

## Routes

| Route | Surface | Notes |
| --- | --- | --- |
| `/dashboard` | Platform Dashboard | Cross-exam entry page |
| `/exam/:examId` | Exam Dashboard | Exam overview entry (`:examId` is implemented as `:examSlug` in code) |
| `/exam/:examId/mock` | Exam Dashboard | Mock exam flow |
| `/exam/:examId/analytics` | Exam Dashboard | Analytics and weak areas |
| `/exam/:examId/resources` | Exam Dashboard | Notes, cheatsheets, and tips resource surfaces |

## UI Rule

If the user is deciding what to buy, what they own, or how their account is configured, keep the UI in `/dashboard`.

If the user is studying one certification package, keep the UI in `/exam/:examSlug`.
