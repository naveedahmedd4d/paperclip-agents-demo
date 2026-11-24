import { describe, expect, it } from "vitest";
import { addNote, countLabel, noteTextError,removeNote } from "./notes";

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

describe("removeNote", () => {
  const list = addNote(addNote([], "a", 1), "b", 2);

  it("removes the note with the given id without mutating the input", () => {
    const result = removeNote(list, list[0].id);
    expect(result.map((n) => n.text)).toEqual(["b"]);
    expect(list).toHaveLength(2);
  });

  it("returns an equal list when the id is unknown", () => {
    expect(removeNote(list, "nope")).toEqual(list);
  });
});
