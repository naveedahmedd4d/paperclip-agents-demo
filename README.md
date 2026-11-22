# paperclip-agents-demo

A tiny notes app built by a team of AI agents coordinated by
[Paperclip](https://github.com/paperclipai/paperclip): a Manager, five
parallel Builders, a Reviewer and QA, with a human approving every merge.

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # e2e tests (Playwright, records video to test-results/)
```

See [AGENTS.md](AGENTS.md) for the team's working agreement and
[docs/adr/](docs/adr/) for architecture decision records.
