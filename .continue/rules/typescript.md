---
name: TypeScript Standards
globs: "**/*.{ts,tsx}"
alwaysApply: false
description: TypeScript strictness and typing conventions
---
# TypeScript
- Strict mode — no `any`. Use `unknown` and narrow it, or define a real type.
- Interfaces for object shapes, type aliases for unions/utility types.
- Explicit return types on exported functions.
- No non-null assertions (`!`) without a comment explaining why it's safe.
- Don't add generics for a hypothetical second use case — only when one actually exists.