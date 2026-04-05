# Payments and Entitlements

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines purchase, access, and renewal behavior.

## Payment Model

- one-time purchase per exam package
- Stripe checkout
- server-side webhook confirmation required before unlock

## Entitlement Rules

Premium access requires:
- authenticated user
- package-matching entitlement
- active status
- current time before expiry

## Expiry

- default entitlement duration: 365 days
- expired users keep limited historical visibility
- expired users lose premium content access

## MVP Renewal Rule

- block repurchase while active
- allow purchase again after expiry

## Support / Admin Grants

- admin test grants must be marked separately from paid purchases
- grants must not pollute paid revenue analytics

## Reliability Rules

- never trust frontend for unlock
- webhook handling must be idempotent
- entitlement creation must be transactional or safely retried
