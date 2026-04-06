# Pricing and Access

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines commercial rules and user-facing access states.

## Pricing Model

- one-time purchase per certification package
- 365-day access duration

## Access States

- visitor
- free logged-in user
- paid active user
- expired user
- admin

## Free User Access

Allowed:
- browse packages
- take one free mock exam
- see detailed base explanations
- request AI deep explanations within controlled limits

Not allowed:
- premium mocks
- purchased workspace
- post-launch resources
- post-launch analytics surfaces

## Paid Active Access

Allowed:
- premium mock exams
- purchased workspace
- recent attempt history
- score summary and topic breakdown
- AI deep explanations within fair-use limits

Not included in launch MVP:
- broader notes and cheatsheets library
- richer analytics dashboards

## Expired Access

Allowed:
- login
- see package expired state
- see limited history summary
- see renewal CTA

Blocked:
- premium mocks
- premium resources
- richer analytics
- premium AI features

## MVP Renewal Rule

- block repurchase while active
- allow renewal after expiry

## User-Facing Access Matrix

| Surface | Visitor | Free Logged-In | Paid Active | Expired | Admin |
| --- | --- | --- | --- | --- | --- |
| Homepage | Yes | Yes | Yes | Yes | Yes |
| Package detail page | Yes | Yes | Yes | Yes | Yes |
| Free mock | No | Yes | Yes | Yes | Yes |
| Premium mocks | No | No | Yes | No | Yes |
| Purchased workspace | No | No | Yes | No | Yes |
| Results and review | No | Yes | Yes | Limited history only | Yes |
| Admin surfaces | No | No | No | No | Yes |
