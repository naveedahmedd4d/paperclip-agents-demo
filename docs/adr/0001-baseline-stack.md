# ADR-0001: Baseline stack for the notes app

- Status: accepted
- Date: 2026-11-22
- Ticket: repo bootstrap
- Author: human (repo setup)

## Context
The repo is a demo target for a multi-agent team: several builders work in
parallel, each on one ticket, branch and PR. The stack must be small, fast to
test, and easy to review.

## Decision
Vanilla TypeScript with Vite, no UI framework. Pure, immutable note logic lives
in `src/notes.ts` and is unit-tested with Vitest. User flows are covered by
Playwright e2e tests that record a video of every run as QA evidence.

## Alternatives considered
- React/Vue: more code per feature and more merge conflicts between builders.
- No e2e tests: QA would have no recorded evidence to attach before merge.

## Consequences
Features stay small and independent. DOM code in `src/main.ts` is a shared
hotspot; keep logic in `src/notes.ts` and keep `main.ts` edits minimal.
