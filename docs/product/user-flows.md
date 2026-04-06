# User Flows

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines the main user journeys.

## Learner Conversion Flow

1. Visitor lands on homepage or package page.
2. Visitor opens the single package detail page.
3. User signs up or logs in.
4. User starts the free mock.
5. User completes the exam.
6. User sees results, explanations, readiness label, and upgrade CTA.
7. User purchases package.
8. User enters purchased workspace.

## Logged-In Dashboard

Dashboard shows:
- the single AWS package card
- current access state
- shortcut to continue free or paid work

Dashboard does not introduce extra discovery logic in MVP.

## Practice Mode

- answer one question at a time
- check answer
- see explanation immediately
- see wrong-answer reasoning
- answer locks after checking
- continue

## Timed Mode

- attempt begins immediately
- deadline is server-controlled
- no pause
- autosave keeps answers but does not extend time
- no explanation during attempt
- question palette and flagging available
- unanswered warning before final submit
- auto-submit on timeout

## Purchased Workspace

Includes:
- premium mocks
- recent attempts
- basic progress summary from completed attempts

Does not include in launch MVP:
- expanded analytics dashboards
- notes
- cheatsheets

## Learner Error States

- expired users see locked paid surfaces and renewal CTA
- AI explanation failure falls back to stored base explanation
- timed-out attempts route to submitted results without extra client action
- unauthenticated users are redirected to auth before starting an exam

## Admin Flow

Admin can:
- create and edit questions
- assemble mocks
- publish and archive content
- import draft content

Not launch-critical:
- advanced review queues
- bulk editorial workflows
- notes and cheatsheets management
