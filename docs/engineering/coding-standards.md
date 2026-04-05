# Coding Standards

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines implementation rules to reduce bugs and keep AI-generated code usable.

## Core Rules

- strict TypeScript
- small modules
- explicit types at boundaries
- thin route handlers
- no raw DB access in UI files
- no duplicated business logic across client and server
- idempotency for webhook and submit flows

## AI-Assisted Coding Rules

- ask AI for one area at a time
- always provide the relevant spec file
- require acceptance criteria in outputs
- require tests for non-trivial logic
- never accept generated code without review

## Definition of Done

A task is not done until:
- code exists
- tests exist where appropriate
- docs are updated if behavior changed
- manual QA path is identified
