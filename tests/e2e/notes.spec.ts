import { expect, test } from "@playwright/test";

test("shows the welcome note", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Notes" }).getByRole("listitem")).toHaveText([/^Welcome to Notes/]);
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
  await expect(page.getByRole("list", { name: "Notes" }).getByRole("listitem")).toHaveCount(0);
  await expect(page.getByTestId("note-count")).toHaveText("0 notes");
});
