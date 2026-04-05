# Testing Strategy

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines how quality is protected without overbuilding.

## Test Pyramid

- unit tests for business rules
- integration tests for critical flows
- a small number of E2E flows

## Highest-Risk Areas

- auth
- timer and auto-submit
- scoring
- payment unlock
- entitlement expiry
- admin publish flow
- AI fallback

## Must-Have E2E Flows

1. signup to free mock to result
2. package purchase to premium access
3. timed exam to result
4. expired access blocked
5. admin publishes content

## Rule

New business-critical logic must ship with at least one automated test and one manual QA path.
