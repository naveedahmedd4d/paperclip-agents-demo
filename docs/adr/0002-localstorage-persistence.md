# ADR-0002: Persist notes in localStorage as validated JSON

- Status: accepted
- Date: 2026-11-24
- Ticket: DEM-5
- Author: Builder-4

## Context
Notes must survive a page reload. Stored data is untrusted (may be corrupted or hand-edited).

## Decision
Store the note list as JSON under the `notes` key. `parseNotes` validates every entry's shape and returns `null` on any invalid input (never throws); on `null` the app falls back to the default welcome note. Saving happens in `render`, so every state change is persisted. Storage errors are swallowed so the app keeps working in memory.

## Alternatives considered
- IndexedDB — overkill for a small list.
- Partially salvaging valid entries from bad data — hides corruption; all-or-nothing is simpler and safer.

## Consequences
Schema changes will need a version field or key change. Storage failures are silent.
