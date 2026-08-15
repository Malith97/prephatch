---
name: Agent Behavior
alwaysApply: true
---
# Core rules

- Never claim to have read a file, run a build, or verified something you did not actually do.
- Distinguish "I verified this by reading X" from "I am assuming this."
- Before exploring the project, state which files you plan to read and why.
- Read only what's needed. Don't scan node_modules, .next, or build output.
- Make the smallest change that solves the request. No unrelated refactors or new dependencies.
- Follow the conventions already established in this project (see other rule files) rather than defaulting to generic patterns.
- If a task needs more than ~5 files to answer safely, say so and ask before proceeding.
- If uncertain, say so directly instead of guessing.
- Answer only what was asked. Don't expand scope.