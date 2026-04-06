# Exam Engine

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines runtime rules for practice mode, timed mode, scoring, and review.

## Modes

- practice mode
- timed mode

## Practice Mode Rules

- answer one question at a time
- user checks answer manually
- explanation shown immediately after check
- wrong-answer reasoning shown
- answer locks after check
- practice attempt may be resumed until submitted

## Timed Mode Rules

- server stores immutable `deadline_at`
- no pause in MVP
- no explanation during attempt
- auto-submit on timeout
- client timer is display-only; server time wins
- server rejects answer writes after deadline
- timed attempt may resume before deadline only

## Attempt Creation

- a logged-in user may start the free mock once the package is visible to them
- a paid active user may start premium mocks for the entitled package
- attempt creation snapshots the exact reviewed question content needed for scoring and review
- duplicate start requests for the same user and same active flow should return the existing attempt when safe

## Autosave and Resume

- answers autosave on selection change with debouncing
- autosave persists selected option only; correctness is not revealed during timed mode
- reload restores the last saved answer state
- reload never extends time or changes deadline

## Submit and Scoring

- submit endpoint is idempotent
- server computes correct, incorrect, unanswered, and percentage correct from snapshot data
- `scaled_score` is derived from percentage correct for internal display only
- readiness labels:
  - `not_ready`: below 70%
  - `borderline`: 70% to 79.99%
  - `ready`: 80% and above
- results must clearly avoid implying an official vendor score

## Edge Cases

- reconnect allowed before deadline
- timed attempt can resume only if deadline not passed
- multi-tab behavior should not extend time
- duplicate submit requests must be idempotent
- timeout during final submit must resolve on server consistently
- answer save after deadline returns a rejected write without mutating stored answers

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

## Result Outputs

- raw counts: correct, incorrect, unanswered
- percentage correct
- internal normalized scaled score
- readiness label
- topic breakdown
- review-by-question payload based on snapshots
