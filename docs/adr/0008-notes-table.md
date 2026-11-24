# ADR-0008: Note title/details inputs and notes table

- Status: accepted
- Date: 2026-11-25
- Ticket: DEM-22 (parent DEM-20)
- Author: Builder-4

## Context
Notes were a single text string rendered in a bullet list. DEM-20 asks for richer inputs and a table, following the class contract in DEM-20's ADR-0008.

## Decision
`Note` becomes `{ id, title, body?, createdAt }`. Title is required and trimmed; body is optional, trimmed, and omitted when blank. `parseNotes` maps legacy `text` to `title`. Notes render in `table.notes-table` (Title, Details, Created, Actions); the empty state is a `tr.notes-empty` row. Search matches title or body. Validation message is "Title must not be empty".

## Alternatives considered
- Migrating stored data with a version field — overkill; tolerant parsing is enough.
- Empty state outside the table — a row keeps the table structure and is trivial to style.

## Consequences
Legacy data keeps loading and is rewritten in the new shape on next save. Styling ticket targets the contract classes.
