# Migrations

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines schema migration rules.

## Rules

- migrations are the source of truth
- test migrations locally first
- avoid manual production edits
- keep seed data separate from schema migrations
- document destructive changes carefully

## Naming and Seed Strategy

- use ordered timestamp-based migration names
- keep package, topic, and mock seed data in explicit seed files
- do not hide production-required seed logic inside ad hoc scripts

## Required Checklist

For each migration:
- purpose
- affected tables
- data risk
- required app changes
- rollback or mitigation note
