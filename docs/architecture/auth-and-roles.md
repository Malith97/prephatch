# Auth and Roles

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines authentication and authorization rules.

## MVP Auth

- Supabase Auth
- email/password
- Google login
- email verification for email/password users

## Deferred

- Facebook login

## Roles

- learner
- admin

## Auth Rules

- all premium routes require authenticated user
- all admin routes require admin role
- role checks happen server-side
- UI may hide actions but cannot enforce permission alone

## Profile Bootstrap

- create `profiles` row on first successful login
- default all new users to `learner`
- store admin access in `user_roles`, not in client-only metadata

## Session and Callback Rules

- auth callback must complete in local, preview, and production
- server utilities own session lookup for protected routes and actions
- auth-required exam starts redirect unauthenticated users to login and then back to the package page

## Admin Assignment

- admin role is granted manually outside self-serve user flows
- admin routes must verify role server-side on every request

## Notes

Keep auth flow simple in MVP to reduce edge cases and support burden.
