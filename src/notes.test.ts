import { describe, expect, it } from "vitest";
import { addNote, countLabel, filterNotes } from "./notes";

describe("addNote", () => {
  it("appends a trimmed note without mutating the input", () => {
    const before: ReturnType<typeof addNote> = [];
    const after = addNote(before, "  buy milk  ", 1);
    expect(after).toHaveLength(1);
    expect(after[0]?.text).toBe("buy milk");
    expect(before).toHaveLength(0);
  });

  it("rejects empty text", () => {
    expect(() => addNote([], "   ")).toThrow("must not be empty");
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

describe("filterNotes", () => {
  const notes = addNote(addNote([], "Buy Milk", 1), "Call mom", 2);

  it("matches case-insensitively by substring", () => {
    expect(filterNotes(notes, "milk").map((n) => n.text)).toEqual(["Buy Milk"]);
    expect(filterNotes(notes, "CALL").map((n) => n.text)).toEqual(["Call mom"]);
  });

  it("returns all notes for a blank query", () => {
    expect(filterNotes(notes, "  ")).toHaveLength(2);
  });

  it("returns an empty list when nothing matches and does not mutate input", () => {
    expect(filterNotes(notes, "zzz")).toHaveLength(0);
    expect(notes).toHaveLength(2);
  });
});
