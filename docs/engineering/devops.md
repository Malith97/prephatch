# DevOps

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines environments, deployment rules, and release protections.

## Environments

- local
- preview
- production

## Rules

- preview environment is required before production
- CI blocks merges on failed checks
- production deploys only from main
- smoke tests run after deploy
- secrets never committed
- maintain `.env.example`

## Notes

A lightweight preview environment is enough. Full enterprise staging is not required for MVP.
