export interface Note {
  readonly id: string;
  readonly title: string;
  readonly body?: string;
  readonly createdAt: number;
}

export type NoteList = readonly Note[];

export interface NoteInput {
  readonly title: string;
  readonly body?: string;
}

/** Returns a new list with the note appended. Never mutates the input. */
export function addNote(notes: NoteList, input: NoteInput | string, now: number = Date.now()): NoteList {
  const { title, body = "" } = typeof input === "string" ? { title: input } : input;
  const error = noteTitleError(title);
  if (error !== null) throw new Error(error);
  const trimmedBody = body.trim();
  const note: Note = {
    id: `${now}-${notes.length}`,
    title: title.trim(),
    ...(trimmedBody.length > 0 ? { body: trimmedBody } : {}),
    createdAt: now,
  };
  return [...notes, note];
}

/** Human-readable count, e.g. "1 note" or "3 notes". */
export function countLabel(notes: NoteList): string {
  return `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
}

/** Returns an error message for an invalid note title, or null when valid. */
export function noteTitleError(title: string): string | null {
  return title.trim().length === 0 ? "Title must not be empty" : null;
}

/** Returns a new list without the note with the given id. Never mutates the input. */
export function removeNote(notes: NoteList, id: string): NoteList {
  return notes.filter((note) => note.id !== id);
}

/** Case-insensitive substring filter. A blank query returns all notes. */
export function filterNotes(notes: NoteList, query: string): NoteList {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) return notes;
  return notes.filter(
    (note) => note.title.toLowerCase().includes(needle) || (note.body ?? "").toLowerCase().includes(needle),
  );
}

/** Serializes notes to a JSON string for storage. */
export function serializeNotes(notes: NoteList): string {
  return JSON.stringify(notes);
}

function toNote(value: unknown): Note | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || typeof v.createdAt !== "number" || !Number.isFinite(v.createdAt)) return null;
  // Legacy notes stored only `text`; map it to `title`.
  const title = typeof v.title === "string" ? v.title : v.text;
  if (typeof title !== "string") return null;
  if (v.body !== undefined && typeof v.body !== "string") return null;
  const body = v.body;
  return { id: v.id, title, ...(body ? { body } : {}), createdAt: v.createdAt };
}

/** Parses stored notes. Returns null for missing, malformed or invalid data; never throws. */
export function parseNotes(raw: string | null): NoteList | null {
  if (raw === null) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    const notes = data.map(toNote);
    return notes.every((n): n is Note => n !== null) ? notes : null;
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
