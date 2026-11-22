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
