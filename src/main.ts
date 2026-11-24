import { addNote, countLabel, noteTextError, type NoteList } from "./notes";

const list = document.querySelector<HTMLUListElement>("#note-list");
if (!list) throw new Error("#note-list missing from index.html");

const count = document.querySelector<HTMLParagraphElement>("#note-count");
if (!count) throw new Error("#note-count missing from index.html");

let notes: NoteList = addNote([], "Welcome to Notes");

function render(items: NoteList): void {
  count!.textContent = countLabel(items);
  list!.replaceChildren(
    ...items.map((note) => {
      const li = document.createElement("li");
      li.textContent = note.text;
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
  notes = addNote(notes, input.value);
  input.value = "";
  render(notes);
});

render(notes);
