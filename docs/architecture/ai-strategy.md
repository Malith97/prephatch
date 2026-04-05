# AI Strategy

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
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
- cache output by question_id + prompt_version
- store provider, model, latency, tokens, and cost estimate
- enforce per-user limits
- enforce daily budget caps
- use cheaper model tiers where acceptable
- fall back to stored base explanation
