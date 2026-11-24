import { createHash } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";

// Each worktree gets its own preview port, so agents running e2e in parallel
// worktrees never share (or silently reuse) another ticket's build.
// E2E_PORT overrides it.
const PORT_BASE = 4200;
const PORT_RANGE = 700;
const worktreePort =
  PORT_BASE + (createHash("sha1").update(process.cwd()).digest().readUInt16BE(0) % PORT_RANGE);
const PORT = Number(process.env.E2E_PORT) || worktreePort;

export default defineConfig({
  testDir: "tests/e2e",
  outputDir: "test-results",
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // QA evidence: every e2e run records a video per test.
    video: "on",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Type checking runs separately (`pnpm typecheck`), so build with Vite only.
    command: `pnpm exec vite build && pnpm exec vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    // Never reuse a server already on the port: it may be another worktree's
    // build, and tests would pass or fail against the wrong code.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
