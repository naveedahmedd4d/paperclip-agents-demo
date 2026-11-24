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

/** Returns an error message for invalid note text, or null when valid. */
export function noteTextError(text: string): string | null {
  return text.trim().length === 0 ? "Note text must not be empty" : null;
}

/** Returns a new list without the note with the given id. Never mutates the input. */
export function removeNote(notes: NoteList, id: string): NoteList {
  return notes.filter((note) => note.id !== id);
}

/** Case-insensitive substring filter. A blank query returns all notes. */
export function filterNotes(notes: NoteList, query: string): NoteList {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) return notes;
  return notes.filter((note) => note.text.toLowerCase().includes(needle));
}

/** Serializes notes to a JSON string for storage. */
export function serializeNotes(notes: NoteList): string {
  return JSON.stringify(notes);
}

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.text === "string" &&
    typeof v.createdAt === "number" &&
    Number.isFinite(v.createdAt)
  );
}

/** Parses stored notes. Returns null for missing, malformed or invalid data; never throws. */
export function parseNotes(raw: string | null): NoteList | null {
  if (raw === null) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data) || !data.every(isNote)) return null;
    return data.map(({ id, text, createdAt }) => ({ id, text, createdAt }));
  } catch {
    return null;
  }
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
