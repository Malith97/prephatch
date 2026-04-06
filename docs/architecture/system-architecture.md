# System Architecture

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines the top-level architecture and boundaries.

## Architecture Pattern

PrepHatch is a modular monolith.

## Why

- lower cost
- faster delivery
- simpler deployments
- easier debugging
- enough scalability for early stages

## Core Modules

- auth
- catalog
- exams
- attempts
- progress
- resources
- payments
- entitlements
- admin
- ai

## Module Responsibilities

- `auth`: sessions, auth callbacks, profile bootstrap, role checks
- `catalog`: certifications, packages, package detail state
- `exams`: question bank, mock composition, publish state
- `attempts`: start, save, submit, timeout, scoring inputs, snapshots
- `progress`: results aggregation, readiness label, topic breakdown
- `resources`: reserved for post-launch notes and cheatsheets
- `payments`: checkout session creation and payment event handling
- `entitlements`: premium access lookup and expiry logic
- `admin`: question and mock management, publishing, imports
- `ai`: deep explanation request, caching, throttling, fallback

## Allowed Dependencies

- UI may call server actions and route handlers, but never owns business rules.
- `attempts` may read from `exams`, but submitted attempt data must be snapshot-based.
- `payments` may create or update `entitlements`, but premium access checks belong to `entitlements`.
- `admin` may manage `exams` content and package composition, but not bypass payment or entitlement rules.
- `ai` may read reviewed question context, but may not determine correctness, scoring, or publish state.

## Protection Principles

Server-side checks are mandatory for:
- premium access
- payment unlock
- admin actions
- final submission
- timer deadlines
- AI runtime endpoints

## Rule

No UI component may be treated as the source of truth for security or monetization logic.

## Scaling Constraints

Scale inside the monolith first:
- better caching
- better indexing and queries
- CDN and static optimization
- background jobs where justified
- clearer internal module boundaries

Do not add microservices, event buses, or extra platforms until real bottlenecks justify them.
