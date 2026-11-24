import { describe, expect, it } from "vitest";
import { addNote, countLabel, formatCreatedAt } from "./notes";

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

describe("formatCreatedAt", () => {
  const note = { id: "1", text: "x", createdAt: 1_000_000 };
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
