# ADR-0010: Remove the "Notes App" heading section; add notes only via the header popup

- Status: accepted
- Date: 2026-11-25
- Ticket: DEM-27
- Author: Manager

## Context
Below the landing "Why it works" section sits a `<main>` block headed by an `<h1>` "Notes App". The user wants that section removed so the page goes from "Why it works" straight to the notes, with adding notes available only through the header's Add Note popup (ADR-0009).

## Decision
Remove the visible "Notes App" `<h1>` heading from `#notes-app` (keep the section, `#notes-app` anchor used by the CTA, note count, search, table and the dialog). Notes are added only through the header Add Note dialog. Keep an accessible name via `aria-label="Notes"` on the section; the landing hero stays the page's single `h1`.

## Alternatives considered
- Delete the whole `#notes-app` section - would also delete the notes list, search and dialog, which the user still needs.
- Hide heading with CSS - leaves a duplicate/unneeded h1 in the DOM.

## Consequences
Existing e2e tests that look for the `Notes App` h1 must be updated. Document `<title>` stays "Notes App". Assumption flagged to the board: only the heading is removed, the list/search remain.
