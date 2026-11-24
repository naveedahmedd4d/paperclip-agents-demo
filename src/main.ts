import { addNote, countLabel, filterNotes, type NoteList } from "./notes";

const list = document.querySelector<HTMLUListElement>("#note-list");
if (!list) throw new Error("#note-list missing from index.html");

const count = document.querySelector<HTMLParagraphElement>("#note-count");
if (!count) throw new Error("#note-count missing from index.html");

const search = document.querySelector<HTMLInputElement>("#note-search");
if (!search) throw new Error("#note-search missing from index.html");

let notes: NoteList = addNote([], "Welcome to Notes");

function render(items: NoteList): void {
  count!.textContent = countLabel(notes);
  list!.replaceChildren(
    ...items.map((note) => {
      const li = document.createElement("li");
      li.textContent = note.text;
      return li;
    }),
  );
}

render(notes);

search.addEventListener("input", () => render(filterNotes(notes, search.value)));
