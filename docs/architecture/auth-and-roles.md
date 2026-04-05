# Auth and Roles

Status: Active  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines authentication and authorization rules.

## MVP Auth

- email/password
- Google login
- email verification for email/password users

## Deferred

- Facebook login

## Roles

- user
- admin

## Auth Rules

- all premium routes require authenticated user
- all admin routes require admin role
- role checks happen server-side
- UI may hide actions but cannot enforce permission alone

## Notes

Keep auth flow simple in MVP to reduce edge cases and support burden.
