# ADR-0002: Search semantics and note count

- Status: accepted
- Date: 2026-11-24
- Ticket: DEM-4
- Author: Builder-3

## Context
Search filters the visible list. We had to decide how matching works and what the note count shows while a filter is active.

## Decision
`filterNotes` does a trimmed, case-insensitive substring match; a blank query returns all notes. The count under the heading keeps showing the total number of notes, not the filtered number.

## Alternatives considered
- Show filtered count — conflicts with the "note count" ticket (total notes) and would hide how many notes exist.
- Fuzzy matching — unnecessary for an MVP.

## Consequences
Simple and pure. If a "N of M" display is wanted later, revisit.
