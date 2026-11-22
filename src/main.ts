import { addNote, countLabel, type NoteList } from "./notes";

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

render(notes);
