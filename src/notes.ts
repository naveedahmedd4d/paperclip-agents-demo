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
