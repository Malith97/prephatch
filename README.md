# PrepHatch

PrepHatch is an exam-readiness platform focused on realistic certification practice, trusted explanations, and cost-aware AI assistance.

## Repo Purpose

This repository is designed for AI-assisted planning, development, testing, deployment, and operations.

## Documentation Start Here

- `docs/INDEX.md` — documentation map
- `docs/MASTER_BLUEPRINT.md` — control-tower summary and source of truth
- `docs/DECISIONS.md` — major decisions and rationale
- `docs/CHANGELOG.md` — notable documentation and product changes

## Working Principles

- Cost is a primary constraint.
- Reliability is more important than feature count.
- AI is used to accelerate work, not replace source-of-truth logic.
- The product is built as a modular monolith first.
- Documentation is written for both humans and AI systems.

## Suggested Local Setup

1. Copy `.env.example` to `.env.local`
2. Fill in Supabase, Stripe, and AI provider secrets
3. Read `docs/INDEX.md`
4. Read `docs/MASTER_BLUEPRINT.md`
5. Follow `docs/engineering/implementation-plan.md`

## Documentation Rules

- Keep `MASTER_BLUEPRINT.md` strategic and relatively short.
- Put detailed rules in section files.
- Record meaningful changes in `DECISIONS.md` and `CHANGELOG.md`.
- When a file becomes mixed or too large, split it.
