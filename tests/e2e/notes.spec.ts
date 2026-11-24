import { expect, test } from "@playwright/test";

test("shows the welcome note", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
  await expect(page.locator(".notes-table .note-title")).toHaveText(["Welcome to Notes"]);
});

test("shows the note count under the heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("note-count")).toHaveText("1 note");
});

test("uses the dark theme", async ({ page }) => {
  await page.goto("/");
  const body = page.locator("body");
  await expect(body).toHaveCSS("background-color", "rgb(18, 18, 20)");
  await expect(body).toHaveCSS("color", "rgb(232, 232, 230)");
});

test("deletes a note with its Delete button", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Delete note: Welcome to Notes" }).click();
  await expect(page.locator(".notes-table tbody tr:not(.notes-empty)")).toHaveCount(0);
  await expect(page.locator(".notes-empty")).toBeVisible();
  await expect(page.getByTestId("note-count")).toHaveText("0 notes");
});

test("notes survive a page reload", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("notes", JSON.stringify([{ id: "a", text: "Persisted note", createdAt: 1 }])),
  );
  await page.reload();
  await expect(page.locator(".notes-table .note-title")).toHaveText(["Persisted note"]);
  await page.reload();
  await expect(page.getByTestId("note-count")).toHaveText("1 note");
});

test("falls back to the welcome note when stored data is invalid", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("notes", "{broken"));
  await page.reload();
  await expect(page.locator(".notes-table .note-title")).toHaveText(["Welcome to Notes"]);
});
