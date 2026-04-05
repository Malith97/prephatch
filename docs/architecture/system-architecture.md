# System Architecture

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines the top-level architecture and boundaries.

## Architecture Pattern

PrepHatch is a modular monolith.

## Why

- lower cost
- faster delivery
- simpler deployments
- easier debugging
- enough scalability for early stages

## Core Modules

- auth
- catalog
- exams
- attempts
- progress
- resources
- payments
- entitlements
- admin
- ai

## Protection Principles

Server-side checks are mandatory for:
- premium access
- payment unlock
- admin actions
- final submission
- timer deadlines
- AI runtime endpoints

## Rule

No UI component may be treated as the source of truth for security or monetization logic.
