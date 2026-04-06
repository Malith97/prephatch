# Coding Standards

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines implementation rules to reduce bugs and keep AI-generated code usable.

## Core Rules

- strict TypeScript everywhere
- thin route handlers and server actions
- explicit validation at every external boundary
- no raw DB access in UI files
- no duplicated business logic across client and server
- idempotency for webhook and submit flows

## Repo Conventions

- `app/` owns routes, layouts, and page composition
- `features/` owns UI plus orchestration by domain
- `server/` owns repositories, services, validators, and policies
- `lib/` owns shared primitives, not product business rules
- `tests/` mirrors critical business behavior, not implementation trivia

## Validation and Error Rules

- validate request input before service execution
- return explicit domain errors for auth, entitlement, and attempt-state failures
- do not let UI infer security-sensitive state from optimistic client assumptions

## Test Expectations

- pure business logic gets unit tests
- database-backed flows get integration tests
- launch-critical user flows get E2E coverage

## Definition of Done

A task is not done until:
- code exists
- automated tests exist where appropriate
- docs are updated if behavior changed
- manual QA path is identified
