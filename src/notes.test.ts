import { describe, expect, it } from "vitest";
import { addNote } from "./notes";

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
