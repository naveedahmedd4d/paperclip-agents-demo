export interface Note {
  readonly id: string;
  readonly text: string;
  readonly createdAt: number;
}

export type NoteList = readonly Note[];

/** Returns a new list with the note appended. Never mutates the input. */
export function addNote(notes: NoteList, text: string, now: number = Date.now()): NoteList {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error("Note text must not be empty");
  }
  const note: Note = { id: `${now}-${notes.length}`, text: trimmed, createdAt: now };
  return [...notes, note];
}

/** Human-readable count, e.g. "1 note" or "3 notes". */
export function countLabel(notes: NoteList): string {
  return `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
}

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** Short relative time for a note, e.g. "just now", "5 min ago", "2 h ago", "3 d ago". */
export function formatCreatedAt(note: Note, now: number = Date.now()): string {
  const elapsed = Math.max(0, now - note.createdAt);
  if (elapsed < MINUTE_MS) return "just now";
  if (elapsed < HOUR_MS) return `${Math.floor(elapsed / MINUTE_MS)} min ago`;
  if (elapsed < DAY_MS) return `${Math.floor(elapsed / HOUR_MS)} h ago`;
  return `${Math.floor(elapsed / DAY_MS)} d ago`;
}
