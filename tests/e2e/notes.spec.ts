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

test("search filters the visible list case-insensitively", async ({ page }) => {
  await page.goto("/");
  const items = page.getByRole("list", { name: "Notes" }).getByRole("listitem");
  const search = page.getByRole("searchbox", { name: "Search notes" });
  await search.fill("WELCOME");
  await expect(items).toHaveText(["Welcome to Notes"]);
  await search.fill("zzz");
  await expect(items).toHaveCount(0);
  await search.fill("");
  await expect(items).toHaveCount(1);
});
