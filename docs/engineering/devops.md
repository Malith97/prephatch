# DevOps

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines environments, deployment rules, and release protections.

## Environments

- local
- preview
- production

## Environment Rules

- preview environment is required before production
- production deploys only from `main`
- pull requests must produce preview deploys
- callback URLs must be valid in local, preview, and production
- maintain `.env.example`

## Secret and Config Ownership

- server secrets stay server-only
- public environment variables are limited to values safe for client bundles
- missing required environment variables must fail fast in development and CI

## CI and Deploy Rules

- CI blocks merge on failed checks
- required checks: install, lint, typecheck, test, build
- smoke tests run after production deploy

## Notes

A lightweight preview environment is enough. Full enterprise staging is not required for MVP.
