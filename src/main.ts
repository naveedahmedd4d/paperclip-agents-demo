import { addNote, countLabel, removeNote, type NoteList } from "./notes";

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
      const text = document.createElement("span");
      text.textContent = note.text;
      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "Delete";
      del.setAttribute("aria-label", `Delete note: ${note.text}`);
      del.addEventListener("click", () => {
        notes = removeNote(notes, note.id);
        render(notes);
      });
      li.append(text, del);
      return li;
    }),
  );
}

render(notes);
