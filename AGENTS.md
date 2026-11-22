# Working agreement for agents in this repo

## Roles
- **Manager**: plans, splits work into tickets, assigns, unblocks, and writes
  ADRs for cross-cutting decisions. Never edits code, never opens PRs.
- **Builder**: owns exactly one ticket. Works only on that ticket's branch and
  opens exactly one PR for it.
- **Reviewer**: reviews each PR diff. Approves or requests changes. A ticket
  gets at most 3 review rounds; after that it goes to the human.
- **QA**: runs `pnpm test` and `pnpm test:e2e`, then attaches the Playwright
  videos from `test-results/` and the test output to the ticket.
- **Human**: gives final approval and merges.

## Rules for every PR
1. One ticket = one branch = one PR. Put the ticket id in the PR title.
2. Keep logic in `src/notes.ts` (pure, immutable functions) with Vitest tests
   in `src/notes.test.ts`. Keep `src/main.ts` changes small.
3. Add or update a Playwright test in `tests/e2e/` for any user-visible change.
4. If you make a design decision, add `docs/adr/NNNN-<slug>.md` using
   `docs/adr/0000-template.md`. Pick the next free number.
5. Before opening the PR, run: `pnpm typecheck && pnpm test && pnpm test:e2e`.
