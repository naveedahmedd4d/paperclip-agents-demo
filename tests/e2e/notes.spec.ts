import { expect, test } from "@playwright/test";

test("shows the welcome note", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Notes" }).locator(".note-text")).toHaveText(["Welcome to Notes"]);
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
