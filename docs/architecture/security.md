# Security

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
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

## Concrete Control Mapping

- checkout creation: validate authenticated user and package on the server; never accept client-set pricing
- webhook processing: verify provider signatures and deduplicate provider event ids
- entitlement granting: derive from verified order state only
- attempt submit: ignore client-side timing claims and score from server-side snapshots
- admin publishing: require admin role and reviewed required fields before publish
- AI runtime endpoint: require authenticated user, validated question context, and rate limiting
