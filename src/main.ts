import { addNote, countLabel, filterNotes, type NoteList } from "./notes";

const list = document.querySelector<HTMLUListElement>("#note-list");
if (!list) throw new Error("#note-list missing from index.html");

const count = document.querySelector<HTMLParagraphElement>("#note-count");
if (!count) throw new Error("#note-count missing from index.html");

const search = document.querySelector<HTMLInputElement>("#search");
if (!search) throw new Error("#search missing from index.html");

let notes: NoteList = addNote([], "Welcome to Notes");
let query = "";

function render(): void {
  count!.textContent = countLabel(notes);
  list!.replaceChildren(
    ...filterNotes(notes, query).map((note) => {
      const li = document.createElement("li");
      li.textContent = note.text;
      return li;
    }),
  );
}

function update(next: { notes?: NoteList; query?: string }): void {
  notes = next.notes ?? notes;
  query = next.query ?? query;
  render();
}

update({});

search.addEventListener("input", () => update({ query: search.value }));
