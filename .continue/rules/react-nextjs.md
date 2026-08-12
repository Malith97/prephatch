---
name: React & Next.js Conventions
globs: "**/*.{ts,tsx}"
alwaysApply: false
description: Component and Next.js App Router conventions for this project
---
# React / Next.js
- Use App Router conventions — server components by default, "use client" only when the file needs hooks, browser APIs, or event handlers.
- Functional components only.
- Prefer composition over prop-drilling; lift state only as high as it needs to go.
- Prefer server components / route handlers for data fetching over client-side fetch when the data isn't interactive.
- PascalCase for components, camelCase prefixed with `use` for hooks.
- Do not introduce a new state management approach if Zustand is already used in this repo — extend the existing store instead.