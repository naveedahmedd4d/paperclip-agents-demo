import {
  addNote,
  countLabel,
  filterNotes,
  formatCreatedAt,
  noteTitleError,
  parseNotes,
  removeNote,
  serializeNotes,
  type Note,
  type NoteList,
} from "./notes";

const STORAGE_KEY = "notes";

const list = document.querySelector<HTMLTableSectionElement>("#note-list");
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

function cell(className: string, ...content: (Node | string)[]): HTMLTableCellElement {
  const td = document.createElement("td");
  td.className = className;
  td.append(...content);
  return td;
}

function emptyRow(): HTMLTableRowElement {
  const tr = document.createElement("tr");
  tr.className = "notes-empty";
  const td = document.createElement("td");
  td.colSpan = 4;
  td.textContent = query.trim() ? "No notes match your search." : "No notes yet.";
  tr.append(td);
  return tr;
}

function noteRow(note: Note): HTMLTableRowElement {
  const time = document.createElement("time");
  time.className = "note-time";
  time.dateTime = new Date(note.createdAt).toISOString();
  time.textContent = formatCreatedAt(note);
  const del = document.createElement("button");
  del.type = "button";
  del.textContent = "Delete";
  del.setAttribute("aria-label", `Delete note: ${note.title}`);
  del.addEventListener("click", () => update({ notes: removeNote(notes, note.id) }));
  const tr = document.createElement("tr");
  tr.append(
    cell("note-title", note.title),
    cell("note-body", note.body ?? ""),
    cell("note-created", time),
    cell("note-actions", del),
  );
  return tr;
}

function render(): void {
  count!.textContent = countLabel(notes);
  const visible = filterNotes(notes, query);
  list!.replaceChildren(...(visible.length === 0 ? [emptyRow()] : visible.map(noteRow)));
}

const form = document.querySelector<HTMLFormElement>("#note-form");
const titleInput = document.querySelector<HTMLInputElement>("#note-title");
const bodyInput = document.querySelector<HTMLTextAreaElement>("#note-body");
const error = document.querySelector<HTMLParagraphElement>("#note-error");
if (!form || !titleInput || !bodyInput || !error) throw new Error("note form missing from index.html");

const dialog = document.querySelector<HTMLDialogElement>("#note-dialog");
const openButton = document.querySelector<HTMLButtonElement>("#add-note-open");
const cancelButton = document.querySelector<HTMLButtonElement>("#note-cancel");
if (!dialog || !openButton || !cancelButton) throw new Error("note dialog missing from index.html");

openButton.addEventListener("click", () => {
  dialog.showModal();
  titleInput.focus();
});
cancelButton.addEventListener("click", () => dialog.close());
// Fires for Cancel, Esc and successful add: reset form and error each time.
dialog.addEventListener("close", () => {
  form.reset();
  error.textContent = "";
  error.hidden = true;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = noteTitleError(titleInput.value);
  error.textContent = message ?? "";
  error.hidden = message === null;
  if (message !== null) return;
  const input = { title: titleInput.value, body: bodyInput.value };
  update({ notes: addNote(notes, input) });
  dialog.close();
});

search.addEventListener("input", () => update({ query: search.value }));

update({});
