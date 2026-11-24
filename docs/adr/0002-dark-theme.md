# ADR-0002: Switch the Notes app to a dark theme

- Status: accepted
- Date: 2026-11-23
- Ticket: DEM-17
- Author: Manager

## Context
The app ships a single light theme: `src/style.css` defines `--fg: #1d1d1f`, `--bg: #fafaf7`, `--accent: #3d5afe` on `:root`. The board asked for the app to be dark instead. No other file carries colors (`index.html` and `src/main.ts` have no inline styles).

## Decision
Make dark the only theme by changing the design tokens on `:root` in `src/style.css` and adding `color-scheme: dark` so native UI (scrollbars, form controls) matches. Keep the token names (`--fg`, `--bg`, `--accent`) and add only the tokens needed (e.g. `--muted` for the note count). Proposed palette: `--bg: #121214`, `--fg: #e8e8e6`, `--accent: #8c9eff` (lighter shade of the existing indigo). Every text/background pair must meet WCAG AA contrast (≥ 4.5:1).

## Alternatives considered
- Follow the OS setting with `prefers-color-scheme` — not what was asked; the user wants dark, not "dark when the OS is dark". Easy follow-up later because the tokens stay the same.
- Light/dark toggle saved in localStorage — more code in `src/main.ts` and a new UI control; out of scope (YAGNI).

## Consequences
- One-file CSS change, very low merge-conflict risk.
- Anyone who preferred the light look loses it; a toggle or `prefers-color-scheme` can be added later on top of the same tokens.
- Future UI must use the tokens rather than hard-coded colors.

