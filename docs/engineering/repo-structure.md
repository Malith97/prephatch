# Repo Structure

Status: Proposed  
Owner: Founder  
Last Updated: 2026-04-06  
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

## Feature Rule

Keep feature logic grouped by domain, not scattered randomly.

## Server Rule

Keep repositories, services, validators, and policies separate from UI.
