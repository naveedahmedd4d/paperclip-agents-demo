import { expect, test } from "@playwright/test";

test("shows the welcome note", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Notes" }).getByRole("listitem")).toHaveText(["Welcome to Notes"]);
});

test("shows the note count under the heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("note-count")).toHaveText("1 note");
});

test("notes survive a page reload", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("notes", JSON.stringify([{ id: "a", text: "Persisted note", createdAt: 1 }])),
  );
  await page.reload();
  await expect(page.getByRole("list", { name: "Notes" }).getByRole("listitem")).toHaveText(["Persisted note"]);
  await page.reload();
  await expect(page.getByTestId("note-count")).toHaveText("1 note");
});

test("falls back to the welcome note when stored data is invalid", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("notes", "{broken"));
  await page.reload();
  await expect(page.getByRole("list", { name: "Notes" }).getByRole("listitem")).toHaveText(["Welcome to Notes"]);
});
