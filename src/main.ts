import {
  addNote,
  countLabel,
  filterNotes,
  noteTextError,
  parseNotes,
  removeNote,
  serializeNotes,
  type NoteList,
} from "./notes";

const STORAGE_KEY = "notes";

const list = document.querySelector<HTMLUListElement>("#note-list");
if (!list) throw new Error("#note-list missing from index.html");

const count = document.querySelector<HTMLParagraphElement>("#note-count");
if (!count) throw new Error("#note-count missing from index.html");

const search = document.querySelector<HTMLInputElement>("#search");
if (!search) throw new Error("#search missing from index.html");

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
let query = "";

function update(next: { notes?: NoteList; query?: string }): void {
  notes = next.notes ?? notes;
  query = next.query ?? query;
  save(notes);
  render();
}

function render(): void {
  count!.textContent = countLabel(notes);
  list!.replaceChildren(
    ...filterNotes(notes, query).map((note) => {
      const li = document.createElement("li");
      const text = document.createElement("span");
      text.textContent = note.text;
      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "Delete";
      del.setAttribute("aria-label", `Delete note: ${note.text}`);
      del.addEventListener("click", () => update({ notes: removeNote(notes, note.id) }));
      li.append(text, del);
      return li;
    }),
  );
}

const form = document.querySelector<HTMLFormElement>("#note-form");
const input = document.querySelector<HTMLInputElement>("#note-input");
const error = document.querySelector<HTMLParagraphElement>("#note-error");
if (!form || !input || !error) throw new Error("note form missing from index.html");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = noteTextError(input.value);
  error.textContent = message ?? "";
  error.hidden = message === null;
  if (message !== null) return;
  const text = input.value;
  input.value = "";
  update({ notes: addNote(notes, text) });
});

search.addEventListener("input", () => update({ query: search.value }));

update({});
