# ADR-0003: Validate note text with a pure helper, not by catching addNote

- Status: accepted
- Date: 2026-11-24
- Ticket: DEM-2
- Author: Builder-1

## Context
`addNote` throws on empty text. The form must show an inline error instead.

## Decision
Add pure `noteTextError(text)` in `src/notes.ts`; the form checks it before calling `addNote`. The error renders in a `role="alert"` paragraph.

## Alternatives considered
- try/catch around `addNote` — uses exceptions for expected user input.

## Consequences
Validation rule lives in one tested place; `addNote` still guards invariants.
