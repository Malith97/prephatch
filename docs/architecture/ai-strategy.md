# AI Strategy

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines where AI is used, where it is forbidden, and how spend is controlled.

## AI Principles

- AI is a value amplifier, not the source of truth.
- AI must never break the core learner journey.
- AI usage must be budgeted and observable.

## Build-Time AI

Use for:
- planning
- documentation
- schema drafting
- code generation
- test generation
- refactoring
- debugging assistance

## Product-Time AI in MVP

Allowed:
- on-demand deep explanation for a question after answer review

Deferred:
- weak-area coach
- full study plans
- live tutor chat

## Hard Prohibitions

AI cannot be authoritative for:
- correct answer selection
- scoring
- payment confirmation
- entitlement state
- content publication approval

## Cost Controls

- only call AI when the user asks for deeper explanation
- cache output by `question_id + prompt_version + model policy`
- store provider, model, latency, tokens, and cost estimate
- enforce per-user limits
- enforce daily budget caps
- use cheaper model tiers where acceptable
- fall back to stored base explanation

## Request Contract

Required input:
- authenticated user
- reviewed question context from stored snapshot or canonical reviewed question
- question id
- prompt version

Response rules:
- return stored explanation immediately if cached result exists
- return AI explanation only as a supplemental layer
- never overwrite base explanation

## Fallback Rules

- if AI fails, times out, or is rate-limited, keep the review page functional
- show stored base explanation regardless of AI outcome
- present AI failure as an optional enhancement failure, not as a broken result
