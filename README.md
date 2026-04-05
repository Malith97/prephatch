# PrepHatch

PrepHatch is an AI-assisted certification exam-readiness platform focused on realistic mock exams, strong explanations, progress tracking, and a scalable low-cost architecture.

The first launch target is:

- **AWS Certified Solutions Architect – Associate (SAA-C03)**

PrepHatch is being built as a focused, high-quality, cost-conscious product with strong AI support across planning, development, testing, and operations.

---

## Project Status

Status: Active planning and build phase

This repository currently contains the product, architecture, engineering, and operations documentation that will guide implementation.

Primary documentation entry point:

- [`docs/INDEX.md`](docs/INDEX.md)

---

## Documentation Reading Order

Start here if you are new to the project:

1. [`docs/MASTER_BLUEPRINT.md`](docs/MASTER_BLUEPRINT.md)
2. [`docs/DECISIONS.md`](docs/DECISIONS.md)
3. [`docs/product/mvp-scope.md`](docs/product/mvp-scope.md)
4. [`docs/architecture/system-architecture.md`](docs/architecture/system-architecture.md)
5. [`docs/engineering/implementation-plan.md`](docs/engineering/implementation-plan.md)
6. [`docs/engineering/IMPLEMENTATION_BACKLOG.md`](docs/engineering/IMPLEMENTATION_BACKLOG.md)
7. [`docs/engineering/FIRST_SPRINT_CHECKLIST.md`](docs/engineering/FIRST_SPRINT_CHECKLIST.md)

---

## What PrepHatch Is

PrepHatch is intended to help learners:

- take realistic certification mock exams
- practice under timed conditions
- get high-quality explanations
- identify weak areas
- track improvement over time
- access structured notes and cheatsheets
- feel more ready for the real exam

At launch, the product is intentionally narrow:

- one certification first
- one strong learner flow
- one modular monolith codebase
- strict cost control
- AI used carefully, not everywhere

---

## Core Product Principles

- **Quality first**: explanations, scoring, entitlement checks, and exam behavior must be reliable
- **Low-cost by design**: avoid unnecessary services, limit runtime AI calls, and optimize infrastructure spend
- **AI-assisted execution**: use AI heavily for planning, coding, testing, debugging, and documentation
- **Human-controlled truth**: AI can assist, but scoring, payments, access, and publishing must remain deterministic
- **Scalable architecture**: start as a modular monolith, with clean boundaries that support future growth
- **Small real MVP**: launch the smallest version that proves users want and trust the product

---

## Current Build Priorities

The current execution priority is:

1. app scaffold
2. authentication
3. schema foundation
4. free mock exam flow
5. results and review
6. payments and entitlements
7. premium workspace
8. minimal admin tools
9. controlled AI explanation layer

Primary working docs for execution:

- [`docs/engineering/IMPLEMENTATION_BACKLOG.md`](docs/engineering/IMPLEMENTATION_BACKLOG.md)
- [`docs/engineering/FIRST_SPRINT_CHECKLIST.md`](docs/engineering/FIRST_SPRINT_CHECKLIST.md)

---

## License

This repository is proprietary. All rights reserved.

No permission is granted to use, copy, modify, distribute, sublicense, sell, train on, or create derivative works from this repository or its contents without prior express written permission from the copyright holder.

---

## Documentation Structure

```text
docs/
  INDEX.md
  MASTER_BLUEPRINT.md
  DECISIONS.md
  CHANGELOG.md
  product/
  architecture/
  engineering/
  operations/
  prompts/

