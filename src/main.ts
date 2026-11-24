import { addNote, countLabel, parseNotes, serializeNotes, type NoteList } from "./notes";

const STORAGE_KEY = "notes";

const list = document.querySelector<HTMLUListElement>("#note-list");
if (!list) throw new Error("#note-list missing from index.html");

const count = document.querySelector<HTMLParagraphElement>("#note-count");
if (!count) throw new Error("#note-count missing from index.html");

function load(): NoteList {
  try {
    const stored = parseNotes(localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
  } catch {
    // storage unavailable: fall through to default
  }
  return addNote([], "Welcome to Notes");
}

function save(items: NoteList): void {
  try {
    localStorage.setItem(STORAGE_KEY, serializeNotes(items));
  } catch {
    // storage full/unavailable: keep working in memory
  }
}

let notes: NoteList = load();

function render(items: NoteList): void {
  save(items);
  count!.textContent = countLabel(items);
  list!.replaceChildren(
    ...items.map((note) => {
      const li = document.createElement("li");
      li.textContent = note.text;
      return li;
    }),
  );
}

render(notes);
