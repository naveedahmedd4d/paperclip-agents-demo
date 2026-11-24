import { describe, expect, it } from "vitest";
import {
  addNote,
  countLabel,
  filterNotes,
  formatCreatedAt,
  noteTitleError,
  parseNotes,
  removeNote,
  serializeNotes,
} from "./notes";

describe("addNote", () => {
  it("appends a trimmed note without mutating the input", () => {
    const before: ReturnType<typeof addNote> = [];
    const after = addNote(before, "  buy milk  ", 1);
    expect(after).toHaveLength(1);
    expect(after[0]?.title).toBe("buy milk");
    expect(before).toHaveLength(0);
  });

  it("rejects an empty title", () => {
    expect(() => addNote([], { title: "   " })).toThrow("must not be empty");
  });

  it("stores a trimmed optional body and omits a blank one", () => {
    expect(addNote([], { title: "t", body: "  details " }, 1)[0]?.body).toBe("details");
    expect(addNote([], { title: "t", body: "  " }, 1)[0]).not.toHaveProperty("body");
    expect(addNote([], { title: "t" }, 1)[0]).not.toHaveProperty("body");
  });
});

describe("countLabel", () => {
  it("uses plural for zero notes", () => {
    expect(countLabel([])).toBe("0 notes");
  });

  it("uses singular for one note", () => {
    expect(countLabel(addNote([], "a", 1))).toBe("1 note");
  });

  it("uses plural for several notes", () => {
    expect(countLabel(addNote(addNote([], "a", 1), "b", 2))).toBe("2 notes");
  });
});

describe("noteTitleError", () => {
  it("returns an error for empty or whitespace-only text", () => {
    expect(noteTitleError("")).not.toBeNull();
    expect(noteTitleError("   ")).not.toBeNull();
  });
  it("returns null for valid text", () => {
    expect(noteTitleError(" hi ")).toBeNull();
  });
});

describe("removeNote", () => {
  const list = addNote(addNote([], "a", 1), "b", 2);

  it("removes the note with the given id without mutating the input", () => {
    const result = removeNote(list, list[0].id);
    expect(result.map((n) => n.title)).toEqual(["b"]);
    expect(list).toHaveLength(2);
  });

  it("returns an equal list when the id is unknown", () => {
    expect(removeNote(list, "nope")).toEqual(list);
  });
});

describe("filterNotes", () => {
  const notes = addNote(addNote([], "Buy Milk", 1), "Call mom", 2);

  it("matches case-insensitively by substring", () => {
    expect(filterNotes(notes, "milk").map((n) => n.title)).toEqual(["Buy Milk"]);
    expect(filterNotes(notes, "CALL").map((n) => n.title)).toEqual(["Call mom"]);
  });

  it("matches the body too", () => {
    const withBody = addNote([], { title: "a", body: "Secret sauce" }, 1);
    expect(filterNotes(withBody, "sauce")).toHaveLength(1);
  });

  it("returns all notes for a blank query", () => {
    expect(filterNotes(notes, "  ")).toHaveLength(2);
  });

  it("returns an empty list when nothing matches and does not mutate input", () => {
    expect(filterNotes(notes, "zzz")).toHaveLength(0);
    expect(notes).toHaveLength(2);
  });
});

describe("persistence", () => {
  const sample = [{ id: "1-0", title: "hi", createdAt: 1 }];

  it("round-trips notes", () => {
    expect(parseNotes(serializeNotes(sample))).toEqual(sample);
  });

  it.each([null, "", "{oops", "{}", "[1]", '[{"id":1,"title":"a","createdAt":1}]', '[{"id":"a","title":"a"}]', '[{"id":"a","createdAt":1}]'])(
    "rejects invalid data %s",
    (raw) => {
      expect(parseNotes(raw)).toBeNull();
    },
  );

  it("maps legacy text-only notes to title", () => {
    expect(parseNotes('[{"id":"a","text":"old","createdAt":5}]')).toEqual([{ id: "a", title: "old", createdAt: 5 }]);
  });

  it("keeps a stored body and rejects a non-string body", () => {
    expect(parseNotes('[{"id":"a","title":"t","body":"b","createdAt":5}]')?.[0]?.body).toBe("b");
    expect(parseNotes('[{"id":"a","title":"t","body":3,"createdAt":5}]')).toBeNull();
  });

  it("accepts an empty list", () => {
    expect(parseNotes("[]")).toEqual([]);
  });
});

describe("formatCreatedAt", () => {
  const note = { id: "1", title: "x", createdAt: 1_000_000 };
  const at = (ms: number) => formatCreatedAt(note, note.createdAt + ms);

  it("says just now under a minute, including clock skew", () => {
    expect(at(0)).toBe("just now");
    expect(at(59_999)).toBe("just now");
    expect(at(-5_000)).toBe("just now");
  });
  it("formats minutes, hours and days", () => {
    expect(at(5 * 60_000)).toBe("5 min ago");
    expect(at(3 * 3_600_000)).toBe("3 h ago");
    expect(at(2 * 86_400_000)).toBe("2 d ago");
  });
});
