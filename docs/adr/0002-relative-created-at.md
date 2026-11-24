# ADR-0002: Relative "created at" labels computed in a pure function

- Status: accepted
- Date: 2026-11-24
- Ticket: DEM-6
- Author: Builder-5

## Context
Each note should show when it was created in a short, human-readable form.

## Decision
`formatCreatedAt(note, now)` in `src/notes.ts` is pure and takes `now` as a parameter. It returns "just now" (under 1 min, or clock skew), then "N min ago", "N h ago", "N d ago". Labels are rendered once per render in a `<time datetime>` element and are not live-updated.

## Alternatives considered
- `Intl.RelativeTimeFormat` — verbose output ("5 minutes ago") and locale-dependent, harder to assert; the ticket asks for a short form.
- Live-updating timer — extra state and side effects for an MVP.

## Consequences
Easy to unit-test. Labels go stale until the next render; revisit if notes are added/edited dynamically.
