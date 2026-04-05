# Migrations

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines schema migration rules.

## Rules

- migrations are the source of truth
- test migrations locally first
- avoid manual production edits
- keep seed data separate from schema migrations
- document destructive changes carefully

## Required Checklist

For each migration:
- purpose
- rollback or mitigation note
- affected tables
- data risk
- required app changes
