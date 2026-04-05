# Security

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines minimum security expectations for MVP.

## Security Priorities

- protect payments
- protect admin routes
- protect premium content
- protect secrets
- protect user data

## Must-Haves

- server-side access checks
- secret management via environment variables
- no secrets in client bundles
- row-level protections where supported
- audit logging for admin actions
- basic rate limiting on sensitive endpoints

## Sensitive Flows

- checkout creation
- webhook processing
- entitlement granting
- admin publishing
- AI runtime endpoint
