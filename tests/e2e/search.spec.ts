import { expect, test } from "@playwright/test";

test("search filters the visible table case-insensitively", async ({ page }) => {
  await page.goto("/");
  const rows = page.locator(".notes-table tbody tr:not(.notes-empty)");
  const search = page.getByLabel("Search notes");
  await search.fill("WELCOME");
  await expect(rows.locator(".note-title")).toHaveText(["Welcome to Notes"]);
  await search.fill("zzz");
  await expect(rows).toHaveCount(0);
  await expect(page.locator(".notes-empty")).toBeVisible();
  await expect(page.getByTestId("note-count")).toHaveText("1 note");
  await search.fill("");
  await expect(rows).toHaveCount(1);
});
