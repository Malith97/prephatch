# Testing Strategy

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines how quality is protected without overbuilding.

## Test Layers

- unit: pure business logic such as scoring, readiness labels, and entitlement checks
- integration: auth bootstrap, attempt creation, result fetch, and database-backed workflows
- E2E: only launch-critical user paths

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

## Launch-Blocking Automated Coverage

- one unit suite for scoring and readiness logic
- one unit suite for entitlement access logic
- one integration test for auth bootstrap
- one integration test for attempt creation and snapshotting
- one E2E happy path for the free mock loop

## Rule

New business-critical logic must ship with at least one automated test and one manual QA path.
