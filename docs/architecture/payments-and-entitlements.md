# Payments and Entitlements

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
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

## State Model

`orders`
- `created`
- `pending_payment`
- `paid`
- `failed`
- `refunded`

`payments`
- `pending`
- `succeeded`
- `failed`
- `refunded`

`entitlements`
- `active`
- `expired`
- `revoked`

## Expiry

- default entitlement duration: 365 days
- expired users keep limited historical visibility
- expired users lose premium content access

## MVP Renewal Rule

- block repurchase while active
- allow purchase again after expiry

## Support and Admin Grants

- admin test grants must be marked separately from paid purchases
- grants must not pollute paid revenue analytics

## Webhook Rules

- webhook event id must be stored and deduplicated
- only verified successful payment events may transition an order to `paid`
- entitlement creation must be idempotent per successful order
- repeated successful delivery for the same order must not create duplicate entitlements
- failed payment events may update payment status but must not grant access

## Reliability Rules

- never trust frontend for unlock
- webhook handling must be idempotent
- entitlement creation must be transactional or safely retried
