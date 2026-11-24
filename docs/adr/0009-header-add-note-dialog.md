# ADR-0009: App header and Add Note native dialog

- Status: accepted
- Date: 2026-11-25
- Ticket: DEM-26 (parent DEM-25)
- Author: Builder-1

## Context
The note form was always visible. We want a top app header with a brand and an Add Note button, and the form hidden until requested.

## Decision
Add a semantic `<header class="app-header">` (brand left, button right) and move the existing form into a native `<dialog>` opened with `showModal()`. The dialog's `close` event resets the form and error, so Cancel, Esc and a successful add share one code path.

## Alternatives considered
- Custom div modal — would need hand-written focus trap, Esc and backdrop handling.
- Inline collapsible form — not a popup as requested.

## Consequences
Focus trapping, Esc and backdrop come free from the platform. E2E tests must open the dialog first, and must match the submit button with `exact: true` since "Add Note" also contains "Add". The brand is not a heading so the single `h1` "Notes App" stays unique.
