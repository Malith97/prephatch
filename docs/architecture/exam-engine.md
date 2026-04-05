# Exam Engine

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines runtime rules for practice mode and timed mode.

## Modes

- practice mode
- timed mode

## Practice Mode Rules

- answer one question at a time
- user checks answer manually
- explanation shown immediately after check
- wrong-answer reasoning shown
- answer locks after check

## Timed Mode Rules

- server stores immutable `deadline_at`
- no pause in MVP
- no explanation during attempt
- auto-submit on timeout
- client timer is display-only; server time wins
- server rejects answer writes after deadline

## Edge Cases

- reconnect allowed before deadline
- timed attempt can resume only if deadline not passed
- multi-tab behavior should not extend time
- duplicate submit requests must be idempotent
- timeout during final submit must resolve on server consistently

## Attempt Lifecycle

- created
- in_progress
- submitted
- auto_submitted
- scored

## Review Requirements

- selected answer
- correct answer
- base explanation
- wrong-answer reasoning
- topic labels
- optional AI deep explanation
