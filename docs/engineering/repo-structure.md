# Repo Structure

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines the recommended repository structure.

## Suggested Shape

```text
prephatch/
  app/
  components/
  features/
  lib/
  server/
  supabase/
  tests/
  scripts/
  public/
  docs/
```

## Placement Rules

- `app/`: routes, layouts, page files, route groups, server actions that are route-adjacent
- `components/`: shared presentation components with no domain ownership
- `features/`: domain-specific UI and page orchestration, for example `features/exams` or `features/catalog`
- `lib/`: shared utilities, formatting helpers, config loading, and safe common primitives
- `server/`: repositories, services, validators, policies, and provider adapters
- `tests/`: unit, integration, and E2E coverage grouped by behavior

## Feature Rule

Keep feature logic grouped by domain, not scattered randomly.

## Server Rule

Keep repositories, services, validators, and policies separate from UI.
