# Content Operations

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines how launch content is created, reviewed, and published.

## Content Rules

- base explanation required before publish
- wrong-answer reasoning required before publish
- imported questions default to draft
- archive instead of hard delete where practical
- each published item must have review metadata

## Publish Preconditions

Question publish requires:
- prompt
- answer options
- exactly one correct option
- base explanation
- wrong-answer reasoning for incorrect options
- topic tags
- reviewed by
- reviewed at

## Question Lifecycle

- draft
- review_ready
- published
- archived

## Import Rules

- imports may create draft questions only
- imports must validate required fields before insert
- publish remains a separate reviewed action

## Content Quality Goal

Questions should be accurate, clearly written, and useful for exam readiness.
